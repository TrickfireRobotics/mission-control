import type { StdMsg, TopicType, TopicTypeMap } from '@/lib/roslibUtils/rosTypes';
import { useRoslibStore } from '@/store/useRoslib';
import ROSLIB, { Topic } from 'roslib';
import { ref } from 'vue';
import type { Ref } from 'vue';
// type CreateSubscriberOptions<T extends TopicType> = {
//   topicName: string;
//   topicType: T;
//   startingDefaultValue?: TopicTypeMap[T];
// };
// type CreateSubscriberReturn<T extends TopicType> = [
//   Ref<TopicTypeMap[T] | undefined, TopicTypeMap[T] | undefined>,
//   (options: {
//     callback?: (message: StdMsg<TopicTypeMap[T]>) => void;
//     defaultValue?: TopicTypeMap[T];
//     isDebugging?: boolean;
//   }) => void,
//   () => void,
// ];

export default class Subscriber<T extends TopicType> {
  // private static roslib :typeof useRoslibStore = useRoslibStore();
  private static ros: ROSLIB.Ros;
  isOn = false;
  // Made Topic private, so nobody can access its methods
  private topic: ROSLIB.Topic<StdMsg<TopicTypeMap[T]>>;
  topicName: string;
  topicType: TopicType;
  data: Ref<TopicTypeMap[T] | undefined>;
  // as Ref<
  // startingDefaultValue: TopicTypeMap[T];

  constructor(options: {
    topicName: string;
    topicType: T;
    startingDefaultValue?: TopicTypeMap[T];
  }) {
    const { topicName, topicType, startingDefaultValue } = options;
    // Ensures store is
    if (!Subscriber.ros) {
      Subscriber.ros = useRoslibStore().ros;
    }
    this.topicName = options.topicName;
    this.topicType = options.topicType;
    // this.topic = new ROSLIB.Topic<StdMsg<TopicTypeMap[T]>>({
    this.topic = new ROSLIB.Topic({
      ros: Subscriber.ros,
      name: topicName,
      messageType: topicType,
      compression: 'cbor',
    });
    this.data = ref(startingDefaultValue) as Ref<TopicTypeMap[T] | undefined>;
    console.log(this.data.value);
    // this.data.value = startingDefaultValue || undefined;
  }
  /**
   * Generic Subscriber to interact with Ros
   * @param options.topicName should start with '/' along with topic name
   * @param options.topicType Ros Message Type
   * @param options.startingDefaultValue? optional starting value
   * @param options.isDebugging? optional prints to console for debugging
   * @returns data, subscribe callback, unsubscribe callback, isOn = isCurrentlyBeingSubscribed
   */
  // createSubscriber<T extends TopicType>(
  //   options: CreateSubscriberOptions<T>,
  // ): [typeof data, typeof subscribe, typeof unsubscribe, typeof isOn] {
  //   const { topicName, topicType, startingDefaultValue } = options;

  // const isOn = ref<boolean>(false);
  //as to clean up complex inferred type
  // const data = ref<TopicTypeMap[T] | undefined>(startingDefaultValue) as Ref<
  //   TopicTypeMap[T] | undefined
  // >;
  // const topic = new ROSLIB.Topic<StdMsg<TopicTypeMap[T]>>({
  //   ros,
  //   name: topicName,
  //   messageType: topicType,
  //   compression: 'cbor',
  // });
  /**
   * Subscribe and updates data
   * @param options.callback optional as to handle more complex logic, can pass in callback (Default behavior of setting to data when subscribe then lost)
   * @param options.defaultValue optional default value if started subscribing
   * @param options.isDebugging? optional prints to console for debugging
   * @returns data, subscribe callback, unsubscribe callback, isOn
   */
  start(options?: {
    callback?: (message: StdMsg<TopicTypeMap[T]>) => void;
    defaultValue?: TopicTypeMap[T];
    isDebugging?: boolean;
  }) {
    // If options is not passed in, then variables below are undefined. || {} allows this function to called without passing an empty {} manually
    const { callback, defaultValue, isDebugging } = options || {};
    if (this.isOn) {
      return;
    }
    this.isOn = true;
    // if (defaultValue) {
    //   this.data.value = defaultValue;
    // }
    this.topic.subscribe((message) => {
      const data = message.data;
      try {
        this.data.value = data;
      } catch (e) {
        console.log(e);
      }
      this.data.value = data;
      if (!callback) {
        this.data.value = message.data;
      } else {
        callback(message);
      }
      if (isDebugging) {
        console.log(`[${this.topicName}] Subscribing: ${this.data.value}`);
      }
    });
  }
  /**
   * Unsubscribes and stops receiving data from Rover
   */
  stop() {
    this.isOn = false;
    this.topic.unsubscribe();
  }
}
