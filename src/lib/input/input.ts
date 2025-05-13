import { ControllerState } from './controllerState';
import { useControllerStore } from '@/store/controllerStore';

import { createPublisher } from '../roslibUtils/createPublisher';
import { onKeyDown, onKeyUp } from '@vueuse/core';

import { Bindings, KeyboardBindings, ControllerBindings } from './InputBindings';


const DELTA_SENSITIVITY = 0.01;
const POLLING_RATE_IN_HERTZ = 20;

const indexToControllerName = new Map();
const indexToControllerState = new Map();

export function inputInit() {
  const controller = useControllerStore();
  window.addEventListener('gamepadconnected', onGamePadConnectsHandler);
  window.addEventListener('gamepaddisconnected', onGamePadDisconnectsHandler);

  for (const [eventName, action] of Object.entries(KeyboardBindings)) {
    switch (typeof action) {
      // If a publisher name is supplied
      case 'string': {
        if (action === '') break;

        const publisher = createPublisher({
          topicName: action,
          topicType: 'std_msgs/Float32',
        });

        onKeyDown(eventName, () => {
          publisher.publish({ data: 1 }, { isDebugging: true });
        });
        onKeyUp(eventName, () => {
          publisher.publish({ data: 0 }, { isDebugging: true });
        });
        break;
      }
      // If a function is supplied
      case 'function': {
        onKeyDown(eventName, () => action());
        break;
      }
      // If arguments are supplied with a function or publisher
      case 'object': {
        onKeyDown(eventName, () => action.function(...(action.args || [])));
        break;
      }
      default: {
        console.log(`Error: Invalid action "${action}" supplied for event "${eventName}"`);
      }
    }
  }

  function onGamePadConnectsHandler(e: GamepadEvent) {
    console.log('HELLO CONTROLLER CONNECTED');
    console.log('Controller connected with index %d\n' + e.gamepad.id, e.gamepad.index);
    indexToControllerName.set(e.gamepad.index, e.gamepad.id);
    const state = new ControllerState(ControllerBindings, DELTA_SENSITIVITY);
    indexToControllerState.set(e.gamepad.index, state);

    if (indexToControllerName.size) {
      controller.setGamepadConnectedStatus(true);
      setInterval(pollController, 1000 / POLLING_RATE_IN_HERTZ);
    }
  }
  // When a controller is removed
  function onGamePadDisconnectsHandler(e: GamepadEvent) {
    console.log('Removing controller with index %d\n' + e.gamepad.id, e.gamepad.index);
    indexToControllerName.delete(e.gamepad.index);
    indexToControllerState.delete(e.gamepad.index);
    controller.setGamepadConnectedStatus(false);
  }

  // Poll each controller
  function pollController() {
    indexToControllerState.forEach(processInput);
  }

  function processInput(state: ControllerState, key: number) {
    const jsGamepad = navigator.getGamepads()[key];

    if (jsGamepad !== null) {
      state.updateState(jsGamepad);
      //state.printNumbers();
    }
  }
}
