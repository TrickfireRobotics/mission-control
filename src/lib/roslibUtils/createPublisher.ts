import ROSLIB from 'roslib';
import { useRoslibStore } from '@/lib/store/roslib';
import type { TopicType, TopicTypeMap } from './rosTypes';

/**
 * A publisher that can send out messages to a certain topic.
 */
export interface Publisher<T extends TopicType> {
  /**
   * Publishes the given data to the configured topic.
   * @param data - is the data to publish.
   * @param options - are the options to use during this publish.
   * @param options.isDebugging - should debug output be displayed?
   */
  publish: (data: TopicTypeMap[T], options?: { isDebugging?: boolean }) => void;
}

/**
 * Creates a publisher that can send out messages to a certain topic.
 * @param options.topicName - should start with '/' along with topic name
 * @param options.topicType - TopicType Ros Message Type
 * @param options.isDebugging - optional prints to console for debugging
 */
export function createPublisher<T extends TopicType>(options: {
  topicName: string;
  topicType: T;
}): Publisher<T> {
  const ros = useRoslibStore();
  return createPublisherForRos(ros.ros, options);
}

/**
 * Equivalent to createPublisher, except using a supplied roslib instead of the
 * default one.
 */
export function createPublisherForRos<T extends TopicType>(
  ros: ROSLIB.Ros,
  options: {
    topicName: string;
    topicType: T;
  },
): Publisher<T> {
  const { topicName, topicType } = options;
  const topic = new ROSLIB.Topic<TopicTypeMap[T]>({
    ros,
    name: topicName,
    messageType: topicType,
    compression: 'cbor',
    reconnect_on_close: true,
  });

  const publish: Publisher<T>['publish'] = (data, options) => {
    const { isDebugging } = options || {};
    topic.publish(data);
    if (isDebugging) {
      console.log(`[${topicName}] Publishing:`, data);
    }
  };

  // TODO: Publisher that runs every interval has passed
  // publishTimer(options:{callback? : () => void, interval : number, isDebugging? : boolean })
  // returns Object so if needed to add more methods, cane easily do and it doesn't create topic object everytime
  return { publish };
}
