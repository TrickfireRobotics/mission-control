import ROSLIB from 'roslib';
import type { TopicType, TopicTypeMap } from './rosTypes';
import { type Ref, ref } from 'vue';
import { useRoslibStore } from '@/store/useRoslib';

export type Subscriber<T extends TopicType> = {
  msg: Ref<TopicTypeMap[T] | undefined, TopicTypeMap[T] | undefined>;
  start: (options?: {
    callback?: (message: TopicTypeMap[T]) => void;
    defaultValue?: TopicTypeMap[T];
    isDebugging?: boolean;
  }) => void;
  stop: () => void;
  isOn: Ref<boolean>;
};

/**
 * Generic Subscriber to interact with Ros
 * @param options.topicName should start with '/' along with topic name
 * @param options.topicType Ros Message Type
 * @param options.startingDefaultValue? optional starting value
 * @param options.isDebugging? optional prints to console for debugging
 * @returns {Object} data, subscribe callback, unsubscribe callback, isOn
 * @returns {Ref<TopicTypeMap[T] | undefined>} Object.data - data automatically updated when subscribes
 * @returns {function} Object.start - function that starts subscriber
 * @returns {function} Object.stop - function that turns of subscriber
 * @returns {Ref<boolean>} Object.isOn - Is Subscribing on
 */
export default function createSubscriber<T extends TopicType>(options: {
  topicName: string;
  topicType: T;
  startingDefaultValue?: TopicTypeMap[T] | null;
}): Subscriber<T> {
  const { topicName, topicType, startingDefaultValue } = options;
  const ros = useRoslibStore().ros;
  const isOn = ref<boolean>(false);
  //as to clean up complex inferred type
  const msg = ref<TopicTypeMap[T] | null | undefined>(startingDefaultValue) as Ref<
    TopicTypeMap[T] | undefined
  >;
  const topic = new ROSLIB.Topic<TopicTypeMap[T]>({
    ros,
    name: topicName,
    messageType: topicType,
    compression: 'cbor',
  });
  /**
   * Subscribe and updates data
   * @param options.callback optional as to handle more complex logic, can pass in callback (Default behavior of setting to data is then lost)
   * @param options.defaultValue optional default value if started subscribing
   * @param options.isDebugging? optional prints to console for debugging
   */
  const start = (options?: {
    callback?: (message: TopicTypeMap[T]) => void;
    defaultValue?: TopicTypeMap[T];
    isDebugging?: boolean;
  }) => {
    // If options is not passed in, then variables below are undefined. || {} allows this function to called without passing an empty {} manually
    const { callback, defaultValue, isDebugging } = options || {};
    if (isOn.value) {
      return;
    }
    isOn.value = true;
    if (defaultValue) {
      msg.value = defaultValue;
    }
    topic.subscribe((message) => {
      if (!callback) {
        msg.value = message;
      } else {
        callback(message);
      }
      if (isDebugging) {
        console.log(`[${topicName}] Received:`, msg.value);
      }
    });
  };
  /**
   * Unsubscribes and stops receiving data from Rover
   */
  const stop = () => {
    isOn.value = false;
    topic.unsubscribe();
  };
  // Returns as an object, so caller determines the name of the object
  return { msg, start, stop, isOn };
}
