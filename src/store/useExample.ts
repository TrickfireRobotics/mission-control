import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useRoslibStore } from './useRoslib';
import type { TopicType } from '../lib/roslibUtils/rosTypes';
import Subscriber from '@/lib/roslibUtils/Subscriber';
import Publisher from '@/lib/roslibUtils/Publisher';
// 0th Define any constants above
const TOPIC_NAME = '/exampleData';
const TOPIC_MESSAGE_TYPE: TopicType = 'std_msgs/String';

export const useExampleStore = defineStore('example', () => {
  // 1st define any dependency stores
  // This will most likely only be useRoslibStore
  const roslib = useRoslibStore();
  // 2nd define any state here in ref<>()
  // const [exampleData, subscribeExample, unsubscribeExample, isSubOnExample] =
  //   roslib.createSubscriber({
  //     topicName: TOPIC_NAME,
  //     topicType: 'std_msgs/String',
  //     startingDefaultValue: 'Hello World',
  //   });
  const helloWorldSub = new Subscriber({
    topicName: TOPIC_NAME,
    topicType: TOPIC_MESSAGE_TYPE,
    startingDefaultValue: 'Hello World',
  });
  //3rd define any getters in computed
  const allCapsData = computed(() => helloWorldSub.data.value?.toUpperCase());
  //4th define any functions
  const helloWorldPub = new Publisher({ topicName: TOPIC_NAME, topicType: TOPIC_MESSAGE_TYPE });

  // Return all state, getters and functions
  return {
    helloWorldSub,
    allCapsData,
    helloWorldPub,
  };
});
