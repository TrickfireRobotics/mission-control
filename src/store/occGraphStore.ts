import { defineStore } from 'pinia';
import type { TopicType } from '@/lib/roslibUtils/rosTypes';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';

const TOPIC_NAME = '/point_cloud_graph';
const TOPIC_MESSAGE_TYPE = 'sensor_msgs/PointCloud2';

export const useOccGraphStore = defineStore('example', () => {
  return {};
});
