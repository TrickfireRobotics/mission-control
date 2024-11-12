import type { StdMsg, TopicType, TopicTypeMap } from '@/lib/roslibUtils/rosTypes';
import { useRoslibStore } from '@/store/useRoslib';
import ROSLIB from 'roslib';

// This could have been a function, but to stay consistent with Subscriber and to add future
export default class Publisher<T extends TopicType> {
  private static ros: ROSLIB.Ros;
  private topic: ROSLIB.Topic<StdMsg<TopicTypeMap[T]>>;
  topicName: string;
  topicType: T;

  constructor(options: { topicName: string; topicType: T }) {
    const { topicName, topicType } = options;
    if (!Publisher.ros) {
      Publisher.ros = useRoslibStore().ros;
    }
    this.topic = new ROSLIB.Topic<StdMsg<TopicTypeMap[T]>>({
      ros: Publisher.ros,
      name: topicName,
      messageType: topicType,
      compression: 'cbor',
    });
    this.topicName = options.topicName;
    this.topicType = options.topicType;
  }
  /**
   * Publish given data
   * @param data publishes data
   */
  // wraps in {} because it will be backward compatibility when adding new parameters as with normal parameter, that would require changing modifying everywhere that it is called
  publish(options: { data: TopicTypeMap[T]; isDebugging?: boolean }) {
    const { data, isDebugging } = options;
    const message: StdMsg<TopicTypeMap[T]> = { data };
    this.topic.publish(message);
    if (isDebugging) {
      console.log(`[${this.topicName}] Publishing: ${data}`);
    }
  }
  // TODO: Publisher that runs every interval has passed
  // publishTimer(options:{callback? : () => void, interval : number, isDebugging : boolean })
}
