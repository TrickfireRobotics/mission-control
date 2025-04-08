import { defineStore } from 'pinia';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';
import { useRoslibStore } from '@/store/roslibStore';

// 0th Define any constants above
// const TOPIC_MESSAGE_TYPE: TopicType = 'sensor_msgs/NavSatFix';

export const useMapStore = defineStore('example', () => {
  // 1st define any dependency stores
  // This will most likely only be useRoslibStore
  // 2nd define any state here in ref<>()
  const mapNavSub = createSubscriber({
    topicName: '/fix',
    topicType: 'sensor_msgs/msg/NavSatFix',
    //startingDefaultValue: { data: 'Hello World' },
  });

  function myFunction() {
    const ros = useRoslibStore();
    console.log(mapNavSub.msg.value);
    console.log(mapNavSub.msg);
    ros.ros.getTopics((bob) => {
      console.log(bob);
    });
  }

  // Call `myFunction` every 1000 milliseconds (1 second)
  setInterval(myFunction, 1000);
  //3rd define any getters in computed
  //const allCapsData = computed(() => helloWorldSub.msg.value?.data.toUpperCase());
  //4th define any functions
  /*
  const helloWorldPub = createPublisher({
    topicName: TOPIC_NAME,
    topicType: TOPIC_MESSAGE_TYPE,
  });
  */

  // Return all state, getters and functions
  return mapNavSub;
});
import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { TopicType } from '@/lib/roslibUtils/rosTypes';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';
import { createPublisher } from '@/lib/roslibUtils/createPublisher';

// 0th Define any constants above
const TOPIC_NAME = '/fix';
const TOPIC_MESSAGE_TYPE: TopicType = 'sensor_msgs/NavSatFix';

export const useMapStore = defineStore('example', () => {
  // 1st define any dependency stores
  // This will most likely only be useRoslibStore
  // 2nd define any state here in ref<>()
  const mapNavSub = createSubscriber({
    topicName: TOPIC_NAME,
    topicType: 'sensor_msgs/NavSatFix',
    //startingDefaultValue: { data: 'Hello World' },
  });
  //3rd define any getters in computed
  //const allCapsData = computed(() => helloWorldSub.msg.value?.data.toUpperCase());
  //4th define any functions
  /*
  const helloWorldPub = createPublisher({
    topicName: TOPIC_NAME,
    topicType: TOPIC_MESSAGE_TYPE,
  });
  */

  // Return all state, getters and functions
  return mapNavSub;
});
