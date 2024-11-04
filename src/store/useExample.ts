import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useRoslibStore } from './useRoslib';

// 0th Define any constants above
const TOPIC_NAME = '/exampleData';
const TOPIC_TYPE: MessageType = 'std_msgs/String';

export const useExampleStore = defineStore('example', () => {
  // 1st define any dependency stores
  // This will most likely only be useRoslibStore
  const roslib = useRoslibStore();
  // 2nd define any state here in ref<>()
  const data = roslib.subscribe<string>(TOPIC_NAME, TOPIC_TYPE, 'Hello World!');
  //3rd define any getters in computed
  const allCapsData = computed(() => data.value?.toUpperCase());
  //4th define any functions
  function publishExampleData() {
    console.log(TOPIC_NAME, TOPIC_TYPE, data);
    roslib.publish(TOPIC_NAME, TOPIC_TYPE, data.value + '!');
  }
  function unsubscribe() {
    roslib.unsubscribe(TOPIC_NAME, TOPIC_TYPE);
  }
  // Return all state, getters and functions
  return { data, allCapsData, publishExampleData, unsubscribe };
});
