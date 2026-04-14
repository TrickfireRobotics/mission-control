import { ControllerState } from './controllerState';
import { useControllerStore } from '@/store/controllerStore';

const DELTA_SENSITIVITY = 0.01;
const POLLING_RATE_IN_HERTZ = 20;
// Cap how fast motor commands are published to the network.
// Matches the robot's 10 Hz polling rate and prevents burst flooding
// on high-latency routers when multiple axes change in the same poll tick.
const MOTOR_COMMAND_MAX_RATE_HZ = 10;

const indexToControllerName = new Map();
const indexToControllerState = new Map();
export function gamepadInit() {
  const controller = useControllerStore();
  window.addEventListener('gamepadconnected', onGamePadConnectsHandler);
  window.addEventListener('gamepaddisconnected', onGamePadDisconnectsHandler);
  function onGamePadConnectsHandler(e: GamepadEvent) {
    console.log('HELLO CONTROLLER CONNECTED');
    console.log('Controller connected with index %d\n' + e.gamepad.id, e.gamepad.index);
    indexToControllerName.set(e.gamepad.index, e.gamepad.id);
    const state = new ControllerState(
      'src\\lib\\controller\\drivebaseAndArmBinding.json',
      DELTA_SENSITIVITY,
      MOTOR_COMMAND_MAX_RATE_HZ,
    );
    indexToControllerState.set(e.gamepad.index, state);

    if (indexToControllerName.has(0)) {
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
