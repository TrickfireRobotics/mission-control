import { defineStore } from 'pinia';
import { ref } from 'vue';
// TODO: figure out names of different controller modes like "tank control" etc"
type GamePadMode = 'tankControl' | 'standard' | 'arm';

// Should handle global states of all types of controllers including xbox controller and
export const useControllerStore = defineStore('controller', () => {
  // TODO: Add support for other controllers and different driving modes
  const isGamepadConnected = ref(false);
  const gamePadMode = ref<GamePadMode>('standard');
  function setGamepadConnectedStatus(status: boolean) {
    isGamepadConnected.value = status;
  }
  // Return all state, getters and functions
  return { isGamepadConnected, gamePadMode, setGamepadConnectedStatus };
});
