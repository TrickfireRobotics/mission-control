function Say(str: string, times: number) {
  console.log(str.repeat(times));
}

function SayStuff() {
  console.log('Stuff!');
}

export type keyboardBind =
  | string
  | Function
  | {
      function: Function;
      args?: any[];
    };

export type controllerBind =
  | keyboardBind
  | { publisher: string; deltaSensitivity?: number }
  | { function: Function; args?: any[]; deltaSensitivity?: number};

export const KeyboardBindings: { [friendlyName: string]: keyboardBind } = {
  a: 'gripRotOpen',
  b: '',
  c: '',
  d: '',
  e: '',
  f: '',
  g: '',
  h: '',
  i: '',
  j: '',
  k: '',
  l: '',
  m: '',
  n: '',
  o: '',
  p: '',
  q: '',
  r: '',
  s: '',
  t: '',
  u: '',
  v: '',
  w: '',
  x: '',
  y: '',
  z: '',
  '0': SayStuff,
  '1': SayStuff,
  '2': { function: SayStuff },
  '3': { function: Say, args: ['Hello', 3] },
  '4': '',
  '5': '',
  '6': '',
  '7': '',
  '8': '',
  '9': '',
  Enter: '',
  Escape: '',
  Backspace: '',
  Tab: '',
  Shift: '',
  Control: '',
  Alt: '',
  CapsLock: '',
  ArrowUp: '',
  ArrowDown: '',
  ArrowLeft: 'move_left_drivebase_side_message',
  ArrowRight: 'move_right_drivebase_side_message',
  ' ': '',
};

export const ControllerBindings: { [friendlyName: string]: controllerBind } = {
  aButton: SayStuff,
  bButton: {function: Say, args: ['Controller', 3]},
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
};
