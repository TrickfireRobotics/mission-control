import { defineStore } from 'pinia';
import ROSLIB from 'roslib';
import { ref } from 'vue';
import type { Ref } from 'vue';
import type {
  TopicType,
  StdMsg,
  TopicTypeMap,
  RosCompressionType,
} from '../lib/roslibUtils/rosTypes';
import Subscriber from '@/lib/roslibUtils/Subscriber';

const HEARTBEAT_DISCONNECT_SECONDS = 2;
const RECONNECTION_GRACE_SECONDS = 2;
const SECONDS_TO_TIMESTAMP = 1000;

export const useRoslibStore = defineStore('roslib', () => {
  const ros = new ROSLIB.Ros({ url: undefined });
  const isWebSocketConnected = ref<boolean>(false);
  const stop = ref<boolean>(false);
  /**
   * Initializes Ros, websocket with Rover and runs heartbeat subscribes. Should only be used in App.vue
   * @param serverHost IP address of websocket
   */
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
    // Runs Heartbeat Subscriber so that if there is a long delay, it tells motor to turn off
    // TODO: refactor to retrieve time instead of boolean
    const heartBeatSub = new Subscriber({
      topicName: 'hbr',
      topicType: 'std_msgs/Bool',
      startingDefaultValue: false,
    });
    heartBeatSub.start({ isDebugging: true });

    // const [isReceivingHeartBeatData, heartbeatSub] = createSubscriber({
    //   topicName: 'hbr',
    //   topicType: 'std_msgs/Bool',
    //   startingDefaultValue: false,
    // });
    // heartbeatSub({ defaultValue: false, isDebugging: true });
    // Close the connection if the heartbeat stops for too long.
    const interval = setInterval(() => {
      console.log(heartBeatSub.data.value, stop.value);
      if (heartBeatSub.data.value) {
        heartbeatTime = Date.now();
      }
      if (stop.value) {
        clearInterval(interval);
        console.log('clear interval');
        // No need to error if the websocket is already closed.
        try {
          ros.close();
        } catch (_) {
          /* empty */
        }

        return;
      }
      // console.count(
      //   (Date.now() - heartbeatTime > HEARTBEAT_DISCONNECT_SECONDS * SECONDS_TO_TIMESTAMP) + '',
      // );
      if (Date.now() - heartbeatTime <= HEARTBEAT_DISCONNECT_SECONDS * SECONDS_TO_TIMESTAMP) {
        return;
      }
      console.log('first');
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
    }, 100);
  }
  /**
   * Creates Topic that return type from subscribing is T. Only use if not StdMsg or isn't a simple {data : T}.
   * @param topicName should start with '/' along with topic name
   * @param topicType Ros Message Type
   * @param compression? optional type of compression to use, like 'png', 'cbor', or 'cbor-raw'
   * @returns ROSLIB.TOPIC that expects T result
   */
  function createNonStandardTopic<T>(
    topicName: string,
    topicType: TopicType,
    compression: RosCompressionType = 'cbor',
  ) {
    return new ROSLIB.Topic<T>({
      ros,
      name: topicName,
      messageType: topicType,
      compression,
    });
  }

  // function createSubscriberList<T extends TopicType>(optionsArr:[],
  //   isDebugging : boolean
  //   ) {
  //  {

  //   optionsArr.forEach((options) =>{
  //     const {topicName, topicType, startingDefaultValue} = options
  //     const [data, subscribe, unsubscribe, isOn ] = createSubscriber({topicName, topicType,startingDefaultValue})

  //   })
  //   const { topicName, topicType };
  //   if (topicName.length !== topicType.length()) {
  //     throw new RangeError('');
  //   }
  // }
  /**
   * Creates Generic Publisher to interact with Ros.
   * @param options.topicName should start with '/' along with topic name
   * @param options.topicType TopicType Ros Message Type
   * @param options.isDebugging? optional prints to console for debugging
   * @returns a callback function that publishes given Data
   */
  function createPublisher<T extends TopicType>(options: {
    topicName: string;
    topicType: T;
    isDebugging?: boolean;
  }) {
    const { topicName, topicType, isDebugging } = options;
    const topic = new ROSLIB.Topic({
      ros,
      name: topicName,
      messageType: topicType,
    });
    /**
     * Publish given data
     * @param data publishes data
     */
    const publish = (data: TopicTypeMap[T]) => {
      const message = new ROSLIB.Message({
        data,
      });
      topic.publish(message);
      if (isDebugging) {
        console.log(`[${topicName}] Publishing: ${data}`);
      }
    };
    // returns anonymous function so it doesn't create topic object everytime and the caller chooses the name of the return function
    return (data: TopicTypeMap[T]) => publish(data);
  }
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

  return {
    ros,
    isWebSocketConnected,
    stop,
    init,
    createNonStandardTopic,
    createPublisher,
    heartbeatPub,
  };
});
