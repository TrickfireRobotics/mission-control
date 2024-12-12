import { defineStore } from 'pinia';
import { roslibManager } from '@/lib/roslibUtils/roslibManager';

export const useRoslibStore = defineStore('roslib', () => {
  return roslibManager();
});
