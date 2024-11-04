import { defineStore } from 'pinia';
import ROSLIB from 'roslib';
import { ref } from 'vue';
import type { Ref } from 'vue';

const HEARTBEAT_DISCONNECT_SECONDS = 2;
const RECONNECTION_GRACE_SECONDS = 2;
const SECONDS_TO_TIMESTAMP = 1000;

export const useRoslibStore = defineStore('roslib', () => {
  const ros = new ROSLIB.Ros({ url: undefined });
  const isWebSocketConnected = ref<boolean>(false);
  const stop = ref<boolean>(false);
  function init(serverHost: string) {
    ros.connect(serverHost);
    console.count('Reinitialized RosInit');
    // TODO: Realistically, we should use websocket ping/pong control frames for this.
    //       This potentially requires hooking into rosbridge_server, so we'll leave it for the future.
    //       With this, we can increase the heartbeat frequency.
    let heartbeatTime: number = Date.now() + RECONNECTION_GRACE_SECONDS * SECONDS_TO_TIMESTAMP;

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
      name: '/hbr',
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
      if (Date.now() - heartbeatTime > HEARTBEAT_DISCONNECT_SECONDS * SECONDS_TO_TIMESTAMP) {
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
        heartbeatTime = Date.now() + RECONNECTION_GRACE_SECONDS * SECONDS_TO_TIMESTAMP;
        ros.connect(serverHost);
      }
    }, 100);
  }
  /**
   * Generic Subscriber to interact with Ros
   * @param topicName should start with '/' along with topic name
   * @param MessageType Ros Message Type
   * @param defaultValue? optional starting value
   * @returns Vue Ref that can be undefined if not provided default value. Can use "as Ref<T>" if default Value is provided
   */
  function subscribe<T>(
    topicName: string,
    messageType: MessageType,
    defaultValue?: T,
  ): Ref<T | undefined> {
    const topic = new ROSLIB.Topic({
      ros,
      name: topicName,
      //more message types at https://docs.ros.org/en/melodic/api/std_msgs/html/index-msg.html
      messageType: messageType,
    });
    const data = ref<T>();
    if (defaultValue) {
      data.value = defaultValue;
    }

    topic.subscribe<T>((message) => {
      data.value = message.data;
      console.log(data);
    });
    return data;
  }
  /**
   * Generic Publisher to interact with Ros
   * @param topicName should start with '/' along with topic name
   * @param messageType Ros Message Type
   * @param input published Value
   */
  function publish<T>(topicName: string, messageType: MessageType, input: T) {
    const topic = new ROSLIB.Topic({
      ros,
      name: topicName,
      messageType: messageType,
    });
    // Function to publish a heartbeat message
    const data = new ROSLIB.Message({
      data: input,
    });
    //publishes data under topic
    console.log(`[${topicName}] Publishing , `, data);
    topic.publish(data);
  }
  //TODO: Figure out how to implement unsubscribe
  function unsubscribe(topicName: string, messageType: MessageType) {}
  function heartbeatPub(input: boolean, interval: number) {
    // Function to publish a heartbeat message
    const heartbeat_topic = new ROSLIB.Topic({
      ros,
      name: '/heartbeat',
      messageType: 'std_msgs/Bool',
      compression: 'cbor',
    });

    const heartbeatData = new ROSLIB.Message({
      data: input,
    });

    setInterval(() => {
      heartbeat_topic.publish(heartbeatData);
      // console.log('Heartbeat message published'); // Uncomment if publisher debugging is needed
    }, interval);
  }

  return { ros, isWebSocketConnected, stop, init, subscribe, publish, unsubscribe, heartbeatPub };
});
