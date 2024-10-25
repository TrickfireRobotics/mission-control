import ROSLIB from 'roslib';
import { ref } from 'vue';

const heartbeatDisconnectSeconds = 2;
const reconnectionGraceSeconds = 2;
const secondsToTimestamp = 1000;

const isWebSocketConnected = ref<boolean>(false);
//Since we are going to return exampleData, it is fine to use typeOf
export default function rosInit(serverHost: string): {
  ros: ROSLIB.Ros;
  isWebSocketConnected: typeof isWebSocketConnected;
  stop: { value: boolean };
} {
  const ros = new ROSLIB.Ros({ url: serverHost });
  const stop = { value: false };

  // TODO: Realistically, we should use websocket ping/pong control frames for this.
  //       This potentially requires hooking into rosbridge_server, so we'll leave it for the future.
  //       With this, we can increase the heartbeat frequency.
  let heartbeatTime: number = Date.now() + reconnectionGraceSeconds * secondsToTimestamp;

  console.count();
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

  const heartbeatRes = new ROSLIB.Topic({
    ros,
    name: '/heartbeatres',
    messageType: 'std_msgs/Bool',
    compression: 'cbor',
  });

  heartbeatRes.subscribe<boolean>((msg) => {
    // TODO: Why are we using bool for a heartbeat?
    if (msg.data) {
      heartbeatTime = Date.now();
    }
  });

  // Close the connection if the heartbeat stops for too long.
  const interval = setInterval(() => {
    if (stop.value) {
      clearInterval(interval);

      // No need to error if the websocket is already closed.
      try {
        ros.close();
      } catch (_) {
        /* empty */
      }

      return;
    }

    if (Date.now() - heartbeatTime > heartbeatDisconnectSeconds * secondsToTimestamp) {
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
      // Give the reconnection extra time so that it doesn't
      // immediately get killed.
      heartbeatTime = Date.now() + reconnectionGraceSeconds * secondsToTimestamp;
      ros.connect(serverHost);
    }
  }, 100);

  return { ros, isWebSocketConnected, stop };
}
