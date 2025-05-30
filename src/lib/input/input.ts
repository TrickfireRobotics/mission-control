import Controller from './controller';
import Keyboard from './keyboard';
import { useInputStore } from '@/store/inputStore';

import ControllerInstanceProfiles from './input_bindings/controllerBindings';

const DELTA_SENSITIVITY = 0.01;
const POLLING_RATE_IN_HERTZ = 20;

export function inputInit() {
  const input = useInputStore();

  const keyboard = new Keyboard();

  window.addEventListener('gamepadconnected', onGamePadConnectsHandler);
  function onGamePadConnectsHandler(e: GamepadEvent) {
    console.log('HELLO CONTROLLER CONNECTED');

    if (e.gamepad.index <= ControllerInstanceProfiles.length) {
      const controller = new Controller(
        ControllerInstanceProfiles[input.controllers.length],
        DELTA_SENSITIVITY,
        e.gamepad.index,
      );
      input.addController(controller);

      setInterval(pollController, 1000 / POLLING_RATE_IN_HERTZ);
    } else {
      console.warn(
        'The controller index %d exceeds the number of bindings available (%d). Please define additional ones',
        e.gamepad.index,
        ControllerInstanceProfiles.length,
      );
    }

    function pollController() {
      for (const controller of input.controllers.values()) {
        processInput(controller, controller.apiIndex);
      }
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
    input.removeController(e.gamepad.index);

    // Shift the controller instance profiles to ensure the next controller gets the correct profiles.
    for (let i = 0; i < input.controllers.length; i++) {
      const prevController = input.controllers.shift();

      const newController = new Controller(
        ControllerInstanceProfiles[i],
        DELTA_SENSITIVITY,
        prevController?.apiIndex || 0,
      );
      input.controllers.push(newController);
    }
  }
}
