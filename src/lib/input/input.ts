import { ControllerState } from './controllerState';
import { useControllerStore } from '@/store/controllerStore';

import { createPublisher } from '../roslibUtils/createPublisher';
import { onKeyDown, onKeyUp } from '@vueuse/core';

const DELTA_SENSITIVITY = 0.01;
const POLLING_RATE_IN_HERTZ = 20;

const CONTROLLER_BINDING_JSON = 'src\\lib\\input\\ControllerBindings.json';
const KEYBOARD_BINDING_JSON = 'src\\lib\\input\\KeyboardBindings.json';

const indexToControllerName = new Map();
const indexToControllerState = new Map();
export function inputInit() {
  const controller = useControllerStore();
  window.addEventListener('gamepadconnected', onGamePadConnectsHandler);
  window.addEventListener('gamepaddisconnected', onGamePadDisconnectsHandler);

  fetch(KEYBOARD_BINDING_JSON)
    .then((response) => response.json())
    .then((json) => keyboardInit(json));

  function keyboardInit(jsonInput: JSON) {
    const json: { [friendlyName: string]: string } = JSON.parse(JSON.stringify(jsonInput));

    for (const friendlyName in json) {
      const topicName = json[friendlyName];

      if (topicName) {
        const publisher = createPublisher({
          topicName,
          topicType: 'std_msgs/Float32',
        });

        onKeyDown(friendlyName, () => {
          publisher.publish({ data: 1 }, { isDebugging: true });
        });
        onKeyUp(friendlyName, () => {
          publisher.publish({ data: 0 }, { isDebugging: true });
        });
      }
    }
  }

  function onGamePadConnectsHandler(e: GamepadEvent) {
    console.log('HELLO CONTROLLER CONNECTED');
    console.log('Controller connected with index %d\n' + e.gamepad.id, e.gamepad.index);
    indexToControllerName.set(e.gamepad.index, e.gamepad.id);
    const state = new ControllerState(CONTROLLER_BINDING_JSON, DELTA_SENSITIVITY);
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
// export function gamepadCleanup() => {
//     onUnmounted(() => {
//     window.removeEventListener('gamepadconnected', onGamePadConnectsHandler);
//     window.removeEventListener('gamepadconnected', onGamePadDisconnectsHandler);
//   });
// }
