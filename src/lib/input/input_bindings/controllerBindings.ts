import { type ControllerBind, makeFunction } from './bindingTypes';

let intervalId: ReturnType<typeof setInterval> | null = null;

function toggleInterval(callback: () => void, intervalMs: number): void {
  if (intervalId === null) {
    intervalId = setInterval(callback, intervalMs);
    console.log('Interval started');
  } else {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Interval cleared');
  }
}

function Say(str: string, times: number) {
  console.log(str.repeat(times));
}

function SayStuff() {
  console.log('Stuff!');
}

/*
 * This file contains the controller bindings for the input system.
 * Each controller instance has its own set of profiles that set the bindings for the buttons and axes.
 * The outermost array corresponds to the controller index, and each inner array contains the binding profiles for that controller.
 *
 * The keys in each binding object correspond to the button names, and the values can be:
 * - A string representing a publisher name:
 *       The input system will create a publisher for that topic and publish the button state.
 * - A function to be called
 *       The input system will call this function when the button is pressed and released.
 * - An object with a function and optional arguments
 *       The input system will call the function with the provided arguments when the button is pressed and released.
 */
export const controllerInstanceProfiles: { [input: string]: ControllerBind }[][] = [
  [
    {
      aButton: makeFunction({
        function: toggleInterval,
        args: [() => console.log('Interval running'), 1000],
      }),
      bButton: makeFunction({ function: Say, args: ['Controller', 3] }),
      xButton: 'gripLinearOpen',
      yButton: 'gripLinearClose',
      leftBumperButton: 'left_wrist_ccw',
      rightBumperButton: 'right_wrist_ccw',
      leftTriggerButton: 'left_wrist_cw',
      rightTriggerButton: 'right_wrist_cw',
      backButton: 'turntable_ccw',
      startButton: 'turntable_cw',
      leftJoystickButton: '',
      rightJoystickButton: '',
      dpadUPButton: 'elbow_up',
      dpadDOWNButton: 'elbow_down',
      dpadLEFTButton: 'shoulder_down',
      dpadRIGHTButton: 'shoulder_up',
      leftJoyXAxis: '',
      leftJoyYAxis: 'move_left_drivebase_side_message',
      rightJoyXAxis: '',
      rightJoyYAxis: 'move_right_drivebase_side_message',
    },
  ],
  [
    {
      aButton: SayStuff,
      bButton: makeFunction({ function: Say, args: ['Controller', 6] }),
      xButton: 'gripLinearOpen',
      yButton: 'gripLinearClose',
      leftBumperButton: 'left_wrist_ccw',
      rightBumperButton: 'right_wrist_ccw',
      leftTriggerButton: 'left_wrist_cw',
      rightTriggerButton: 'right_wrist_cw',
      backButton: 'turntable_ccw',
      startButton: 'turntable_cw',
      leftJoystickButton: '',
      rightJoystickButton: '',
      dpadUPButton: 'elbow_up',
      dpadDOWNButton: 'elbow_down',
      dpadLEFTButton: 'shoulder_down',
      dpadRIGHTButton: 'shoulder_up',
      leftJoyXAxis: '',
      leftJoyYAxis: 'move_left_drivebase_side_message',
      rightJoyXAxis: '',
      rightJoyYAxis: 'move_right_drivebase_side_message',
    },
  ],
];
