import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export type GamePadMode = 'drivebase' | 'arm';

// Should handle global states of all types of controllers including xbox controller and
export const useControllerStore = defineStore('controller', () => {
  // TODO: Add support for other controllers
  const isGamepadConnected = ref(false);
  const gamePadMode = ref<GamePadMode>('drivebase');

  // Whether the Controller tab is the active page. While true, the real gamepad's
  // input is still displayed but not forwarded to the rover.
  const isTestTabFocused = ref(false);

  // Latest friendly-name -> value snapshot of the real gamepad, for the Controller
  // tab's live display.
  const liveInputValues = reactive<Record<string, number>>({});

  function setGamepadConnectedStatus(status: boolean) {
    isGamepadConnected.value = status;
  }
  function setGamePadMode(mode: GamePadMode) {
    gamePadMode.value = mode;
  }
  function toggleGamePadMode() {
    gamePadMode.value = gamePadMode.value === 'drivebase' ? 'arm' : 'drivebase';
  }
  function setTestTabFocused(active: boolean) {
    isTestTabFocused.value = active;
  }
  function setLiveInputValues(values: Map<string, number>) {
    for (const [name, value] of values) {
      liveInputValues[name] = value;
    }
  }

  // Return all state, getters and functions
  return {
    isGamepadConnected,
    gamePadMode,
    isTestTabFocused,
    liveInputValues,
    setGamepadConnectedStatus,
    setGamePadMode,
    toggleGamePadMode,
    setTestTabFocused,
    setLiveInputValues,
  };
});
