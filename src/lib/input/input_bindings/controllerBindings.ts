import { createPublisher } from '@/lib/roslibUtils/createPublisher';
import { type ControllerBind, makeFunction } from './bindingTypes';

let intervalId: ReturnType<typeof setInterval> | null = null;

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
      aButton: holdDown('gripRotOpen', 500),
      bButton: holdDown('gripRotClose', 500),
      xButton: holdDown('gripLinearOpen', 500),
      yButton: holdDown('gripLinearClose', 500),
      leftBumperButton: holdDown('left_wrist_ccw', 500),
      rightBumperButton: holdDown('right_wrist_ccw', 500),
      leftTriggerButton: holdDown('left_wrist_cw', 500),
      rightTriggerButton: holdDown('right_wrist_cw', 500),
      backButton: holdDown('turntable_ccw', 500),
      startButton: holdDown('turntable_cw', 500),
      leftJoystickButton: '',
      rightJoystickButton: '',
      dpadUPButton: holdDown('elbow_up', 500),
      dpadDOWNButton: holdDown('elbow_down', 500),
      dpadLEFTButton: holdDown('shoulder_down', 500),
      dpadRIGHTButton: holdDown('shoulder_up', 500),
      leftJoyXAxis: '',
      leftJoyYAxis: holdDown('move_left_drivebase_side_message', 500),
      rightJoyXAxis: '',
      rightJoyYAxis: holdDown('move_right_drivebase_side_message', 500),
    },
  ],
  [
    {
      aButton: SayStuff,
      bButton: makeFunction({ function: Say, args: ['Controller', 6] }),
      xButton: holdDown('gripLinearOpen', 500),
      yButton: holdDown('gripLinearClose', 500),
      leftBumperButton: holdDown('left_wrist_ccw', 500),
      rightBumperButton: holdDown('right_wrist_ccw', 500),
      leftTriggerButton: holdDown('left_wrist_cw', 500),
      rightTriggerButton: holdDown('right_wrist_cw', 500),
      backButton: holdDown('turntable_ccw', 500),
      startButton: holdDown('turntable_cw', 500),
      leftJoystickButton: '',
      rightJoystickButton: '',
      dpadUPButton: holdDown('elbow_up', 500),
      dpadDOWNButton: holdDown('elbow_down', 500),
      dpadLEFTButton: holdDown('shoulder_down', 500),
      dpadRIGHTButton: holdDown('shoulder_up', 500),
      leftJoyXAxis: '',
      leftJoyYAxis: holdDown('move_left_drivebase_side_message', 500),
      rightJoyXAxis: '',
      rightJoyYAxis: holdDown('move_right_drivebase_side_message', 500),
    },
  ],
];

function holdDown(publisherName: string, interval: number) {
  let intervalId: ReturnType<typeof setInterval> | null = null;

  return function toggle() {
    const publisher = createPublisher({
      topicName: publisherName,
      topicType: 'std_msgs/Float32',
    });

    if (intervalId === null) {
      intervalId = setInterval(() => {
        publisher.publish({ data: 1 }, { isDebugging: true });
      }, interval);
    } else {
      publisher.publish({ data: 0 }, { isDebugging: true });
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}
