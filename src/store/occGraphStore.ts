import { defineStore } from 'pinia';
import type { TopicType } from '@/lib/roslibUtils/rosTypes';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';

const TOPIC_NAME = '/octomap_point_cloud_centers';
const TOPIC_MESSAGE_TYPE: TopicType = 'sensor_msgs/PointCloud2';

export const useOccGraphStore = defineStore('occGraphStore', () => {
  const occSub = createSubscriber({
    topicName: TOPIC_NAME,
    topicType: TOPIC_MESSAGE_TYPE,
  });
  return { occSub };
});
