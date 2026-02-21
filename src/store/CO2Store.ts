import { defineStore } from 'pinia';
import type { TopicType } from '@/lib/roslibUtils/rosTypes';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';
import { createPublisher } from '@/lib/roslibUtils/createPublisher';

const TOPIC_NAME = '/emissionsData';
const TOPIC_MESSAGE_TYPE: TopicType = 'std_msgs/Float32';

export const useCO2Store = defineStore('CO2Store', () => {
  const CO2Sub = createSubscriber({
    topicName: TOPIC_NAME,
    topicType: TOPIC_MESSAGE_TYPE,
    startingDefaultValue: { data: 0 },
  });

  const CO2Pub = createPublisher({
    topicName: TOPIC_NAME,
    topicType: TOPIC_MESSAGE_TYPE,
  });

  return {
    CO2Sub,
    CO2Pub,
  };
});
