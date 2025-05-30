import { Controller } from './controller';
import Keyboard from './keyboard';
import { useControllerStore } from '@/store/controllerStore';

import ControllerBindings from './input_bindings/controllerBindings';

const DELTA_SENSITIVITY = 0.01;
const POLLING_RATE_IN_HERTZ = 20;

const indexToControllerName = new Map();
const indexToControllerState = new Map();


export function inputInit() {
  const keyboard = new Keyboard();

  const controller = useControllerStore();
  window.addEventListener('gamepadconnected', onGamePadConnectsHandler);
  function onGamePadConnectsHandler(e: GamepadEvent) {
    const controller = useControllerStore();
    console.log('HELLO CONTROLLER CONNECTED');
    console.log('Controller connected with index %d\n' + e.gamepad.id, e.gamepad.index);

    const state = new Controller(ControllerBindings[e.gamepad.index], DELTA_SENSITIVITY, e.gamepad.index);
    indexToControllerName.set(e.gamepad.index, e.gamepad.id);
    indexToControllerState.set(e.gamepad.index, state);

    if (indexToControllerName.size) {
      controller.setGamepadConnectedStatus(true);
      setInterval(pollController, 1000 / POLLING_RATE_IN_HERTZ);
    }

    function pollController() {
      indexToControllerState.forEach(processInput);
    }

    function processInput(state: Controller, key: number) {
      const jsGamepad = navigator.getGamepads()[key];

      if (jsGamepad != null) {
        state.updateState(jsGamepad);
      }
    }
  }

  window.addEventListener('gamepaddisconnected', onGamePadDisconnectsHandler);
  function onGamePadDisconnectsHandler(e: GamepadEvent) {
    console.log('Removing controller with index %d\n' + e.gamepad.id, e.gamepad.index);

    indexToControllerName.delete(e.gamepad.index);
    indexToControllerState.delete(e.gamepad.index);

    controller.setGamepadConnectedStatus(false);
  }
}
