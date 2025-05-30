import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Keyboard } from '@/lib/input/keyboard';
import { Controller } from '@/lib/input/controller';

type GamePadMode = 'tankControl' | 'standard' | 'arm';

// Should handle global states of all types of controllers including xbox controller and
export const useInputStore = defineStore('input', () => {
  // TODO: Add support for other controllers and different driving modes
  const isGamepadConnected = ref(false);
  const gamePadMode = ref<GamePadMode>('standard');
  const keyboard = ref<Keyboard | undefined>(undefined);
  const controllers = ref<Controller[]>([]);

  function setGamepadConnectedStatus(status: boolean) {
    isGamepadConnected.value = status;
  }
  function setKeyboard(keyboardInstance: Keyboard) {
    keyboard.value = keyboardInstance;
  }
  function addController(controller: Controller) {
    console.log(`Initializing controller ${controllers.value.length}`);
    controllers.value.push(controller);
  }
  function removeController(apiIndex: number) {
    controllers.value = controllers.value.filter((controller, index) => {
      if (controller.apiIndex === apiIndex) {
        console.log(`Removing controller ${index}`);
        return false;
      }
      return true;
    });
  }
  // Return all state, getters and functions
  return {
    isGamepadConnected,
    gamePadMode,
    keyboard,
    controllers,
    setGamepadConnectedStatus,
    setKeyboard,
    addController,
    removeController,
  };
});
