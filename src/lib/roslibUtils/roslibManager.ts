import ROSLIB from 'roslib';
import { ref, type Ref, watch } from 'vue';
import { useSettingsStore } from '@/lib/store/settings';
import { storeToRefs } from 'pinia';
import { createSubscriberForRos } from '@/lib/roslibUtils/createSubscriber';

const HEARTBEAT_DISCONNECT_SECONDS = 2;
const RECONNECTION_GRACE_SECONDS = 2;
const SECONDS_TO_TIMESTAMP = 1000;

const HEARTBEAT_CHECK_INTERVAL = 100;
const HEARTBEAT_SEND_INTERVAL = 1000;

/**
 * A self-contained connection to the rover, that handles
 * reconnection and responds to changes in settings.
 */
export interface RoslibManager {
  ros: ROSLIB.Ros;
  stop: Ref<boolean>;
  isWebSocketConnected: Ref<boolean>;
  latency: Ref<number>;
}

/**
 * Creates an instance of `RoslibManager`.
 * This will automatically connect to the configured
 * server address.
 */
export function roslibManager(): RoslibManager {
  const settings = storeToRefs(useSettingsStore());

  const ros: ROSLIB.Ros = new ROSLIB.Ros({ url: undefined });

  let heartbeatRunning: boolean = false;
  let heartbeatCheckInterval: number | null = null;
  let heartbeatSendInterval: number | null = null;
  let heartbeatTime: number = 0;

  const stop: Ref<boolean> = ref(false);
  const isWebSocketConnected: Ref<boolean> = ref(false);
  const latency: Ref<number> = ref(0);

  let serverHost: string | null = settings.settings.value.websocketAddress;

  /**
   * Runs the heartbeat loops.
   */
  function setupHeartbeat() {
    if (heartbeatRunning) return;
    heartbeatRunning = true;

    const heartbeatSub = createSubscriberForRos(ros, {
      topicName: 'hbr',
      topicType: 'std_msgs/Bool',
      startingDefaultValue: { data: false },
    });

    heartbeatSub.start({
      defaultValue: { data: false },
      callback: (msg) => {
        if (msg.data) {
          heartbeatTime = Date.now();
        }
      },
    });

    const checkInterval = setInterval(() => {
      if (stop.value) {
        clearInterval(checkInterval);
        heartbeatSub.stop();

        return;
      }

      // We can't do anything if a server host hasn't been set yet.
      if (serverHost == null) return;

      if (Date.now() - heartbeatTime > HEARTBEAT_DISCONNECT_SECONDS * SECONDS_TO_TIMESTAMP) {
        connect(serverHost);
      }
    }, HEARTBEAT_CHECK_INTERVAL);

    const heartbeatPub = new ROSLIB.Topic({
      ros: ros,
      name: '/heartbeat',
      messageType: 'std_msgs/Bool',
      compression: 'cbor',
    });

    // TODO: refactor to use time instead of boolean
    const heartbeatData = new ROSLIB.Message({
      data: true,
    });

    const sendInterval = setInterval(() => {
      if (stop.value) {
        clearInterval(sendInterval);

        return;
      }

      heartbeatPub.publish(heartbeatData);
    }, HEARTBEAT_SEND_INTERVAL);

    // interval variables exist so that the heartbeat interval doesn't
    // kill a different interval if heartbeatInterval gets changed.
    heartbeatCheckInterval = checkInterval;
    heartbeatSendInterval = sendInterval;
  }

  /**
   * Connects to the given address, forcefully disconnecting
   * if a connection already exists.
   * @param address - is the new address to connect to.
   */
  function connect(address: string) {
    // Give the reconnection extra time so that it doesn't
    // immediately get killed.
    heartbeatTime = Date.now() + RECONNECTION_GRACE_SECONDS * SECONDS_TO_TIMESTAMP;

    close();
    ros.connect(address);
  }

  /**
   * Forcefully closes the connection.
   * This leaves it in a good state to reconnect again.
   */
  function close() {
    isWebSocketConnected.value = false;

    // No need to error if the websocket is already closed.
    try {
      ros.close();
    } catch (_) {
      /* empty */
    }

    // Forcefully reconnect.
    // @ts-expect-error socket is private but needs to be set to null to force roslib to reconnect in case of hangs.
    ros.socket = null;
  }

  ros.on('connection', () => {
    isWebSocketConnected.value = true;
  });

  ros.on('error', (error) => {
    isWebSocketConnected.value = false;
    console.error(error);
  });

  ros.on('close', () => {
    isWebSocketConnected.value = false;
  });

  // Reconnect if the websocket address changes.
  watch(settings.settings, (newSettings, oldSettings) => {
    if (newSettings.websocketAddress === oldSettings.websocketAddress) return;
    if (stop.value) return;

    serverHost = newSettings.websocketAddress;
    connect(serverHost);
  });

  // Stop when requested.
  // The intervals will stop themselves
  // automatically.
  watch(stop, (newStop) => {
    if (newStop) close();
  });

  connect(serverHost);

  setupHeartbeat();

  return {
    ros,
    latency,
    stop,
    isWebSocketConnected,
  };
}
