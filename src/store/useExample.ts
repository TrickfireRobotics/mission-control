import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { TopicType } from '../lib/roslibUtils/rosTypes';
import createSubscriber from '@/lib/roslibUtils/createSubscriber';
import createPublisher from '@/lib/roslibUtils/createPublisher';
// 0th Define any constants above
const TOPIC_NAME = '/exampleData';
const TOPIC_MESSAGE_TYPE: TopicType = 'std_msgs/String';

export const useExampleStore = defineStore('example', () => {
  // 1st define any dependency stores
  // This will most likely only be useRoslibStore
  // 2nd define any state here in ref<>()
  const helloWorldSub = createSubscriber({
    topicName: TOPIC_NAME,
    topicType: 'std_msgs/String',
    startingDefaultValue: 'Hello World',
  });

  //3rd define any getters in computed
  const allCapsData = computed(() => helloWorldSub.data.value?.toUpperCase());
  //4th define any functions
  const helloWorldPub = createPublisher({
    topicName: TOPIC_NAME,
    topicType: TOPIC_MESSAGE_TYPE,
  });

  // Return all state, getters and functions
  return {
    helloWorldSub,
    allCapsData,
    helloWorldPub,
  };
});
