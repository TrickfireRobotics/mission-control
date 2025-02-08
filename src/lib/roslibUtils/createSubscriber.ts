import ROSLIB from 'roslib';
import type { TopicType, TopicTypeMap } from './rosTypes';
import { type Ref, ref } from 'vue';
import { useRoslibStore } from '@/store/roslibStore';

// The CB type is there to ensure that we can't access both msg and callback at the same time.
// It might mess with Intellisense, but it's better than trying to debug why some code is broken
// and find that it's due to a callback being used.

/**
 * A subscriber that listens for messages on a specific topic.
 */
export interface Subscriber<T extends TopicType, CB extends boolean> {
  /**
   * The latest message that was received.
   * This can only be accessed if a callback isn't used.
   */
  msg: CB extends false ? Ref<TopicTypeMap[T] | undefined> : never;
  /**
   * Start the subscriber.
   * @param options - are the options used during the duration of this startup.
   * @param options.callback - is a callback that will be ran when data is received, containing the data itself.
   * @param options.defaultValue - is an optional value to set `msg` to after subscribing.
   * @param options.isDebugging - prints out message when subscriber receives message.
   */
  start: (options?: {
    callback?: CB extends true ? (message: TopicTypeMap[T]) => void : never;
    defaultValue?: CB extends false ? TopicTypeMap[T] : never;
    isDebugging?: boolean;
  }) => void;
  /** Stops the subscriber. */
  stop: () => void;
  /** Is the subscriber currently running? */
  isOn: Ref<boolean>;
}

/**
 * Creates a subscriber that listens for messages on a specific topic.
 * @param options.topicName - should start with '/' along with topic name
 * @param options.topicType - Ros Message Type
 * @param options.startingDefaultValue - optional starting value
 * @param options.isDebugging - optional prints to console for debugging
 */
export function createSubscriber<T extends TopicType, CB extends boolean>(options: {
  topicName: string;
  topicType: T;
  startingDefaultValue?: CB extends false ? TopicTypeMap[T] : never;
}): Subscriber<T, CB> {
  const ros = useRoslibStore();
  return createSubscriberForRos(ros.getTopic, options);
}

/**
 * Equivalent to createSubscriber, except using a supplied roslib instead of the
 * default one.
 */
export function createSubscriberForRos<T extends TopicType, CB extends boolean>(
  getTopic: <T>(name: string, type: string) => ROSLIB.Topic<T>,
  options: {
    topicName: string;
    topicType: T;
    startingDefaultValue?: CB extends false ? TopicTypeMap[T] : never;
  },
): Subscriber<T, CB> {
  const { topicName, topicType, startingDefaultValue } = options;
  const isOn = ref<boolean>(false);
  //as to clean up complex inferred type
  const msg = ref<TopicTypeMap[T] | null | undefined>(startingDefaultValue) as Ref<
    TopicTypeMap[T] | undefined
  > as Subscriber<T, CB>['msg'];
  const topic = getTopic<TopicTypeMap[T]>(topicName, topicType);

  let subCallback: ((msg: TopicTypeMap[T]) => void) | null = null;

  const start: Subscriber<T, CB>['start'] = (options) => {
    // If options is not passed in, then variables below are undefined. || {} allows this function to called without passing an empty {} manually
    const { callback, defaultValue, isDebugging } = options || {};
    if (isOn.value) {
      return;
    }
    isOn.value = true;
    if (defaultValue) {
      msg.value = defaultValue;
    }

    // Save the old callback so we can unsubscribe from it.
    // We aren't unsubscribing here because it might lead
    // to an actual unsubscribe message being sent to the rover,
    // followed by a subscribe message, which is wasteful.
    const prevCallback = subCallback;

    subCallback = (message) => {
      if (!callback) {
        msg.value = message;
      } else {
        callback(message);
      }
      if (isDebugging) {
        console.log(`[${topicName}] Received:`, message);
      }
    };
    topic.subscribe(subCallback);

    if (prevCallback) topic.unsubscribe(prevCallback);
  };

  const stop: Subscriber<T, CB>['stop'] = () => {
    isOn.value = false;

    if (subCallback) topic.unsubscribe(subCallback);
    subCallback = null;
  };
  // Returns as an object, so caller determines the name of the object
  return { msg, start, stop, isOn };
}
