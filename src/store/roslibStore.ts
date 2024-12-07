import { defineStore } from 'pinia';
import { type RoslibManager, roslibManager } from '@/lib/roslibUtils/roslibManager';

export const useRoslibStore = defineStore('roslib', () => {
  return roslibManager();
});
