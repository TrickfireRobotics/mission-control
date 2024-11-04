import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRoslibStore } from './useRoslib';

// TODO: figure out names of different controller modes like "tank control" etc"
type GamePadMode = 'tankControl' | 'standard' | 'arm';

// 0th Define any constants above
const TOPIC_NAME = '/exampleData';
const TOPIC_TYPE: MessageType = 'std_msgs/String';
// Should handle global states of all types of controllers including xbox controller and
export const useControllerStore = defineStore('controller', () => {
  // 1st define any dependency stores
  // This will most likely only be useRoslibStore
  const roslib = useRoslibStore();
  // 2nd define any state here in ref<>()
  // TODO: Add support for other controllers and different driving modes
  const isGamepadConnected = ref(false);
  const gamePadMode = ref<GamePadMode>('standard');
  //3rd define any getters in computed
  //4th define any functions
  function setGamepadConnectedStatus(status: boolean) {
    isGamepadConnected.value = status;
  }
  // Return all state, getters and functions
  return { isGamepadConnected, setGamepadConnectedStatus };
});
