export type inputType = 'digitalButton' | 'analogButton' | 'joystick';
type inputTypeMap = {
  [inputName: string]: inputType;
};

export const gamepadButtonTypeMap: inputTypeMap = {
  aButton: 'digitalButton',
  bButton: 'digitalButton',
  xButton: 'digitalButton',
  yButton: 'digitalButton',
  leftBumperButton: 'digitalButton',
  rightBumperButton: 'digitalButton',
  leftTriggerButton: 'digitalButton',
  rightTriggerButton: 'digitalButton',
  backButton: 'digitalButton',
  startButton: 'digitalButton',
  leftJoystickButton: 'analogButton',
  rightJoystickButton: 'analogButton',
  dpadUPButton: 'digitalButton',
  dpadDOWNButton: 'digitalButton',
  dpadLEFTButton: 'digitalButton',
  dpadRIGHTButton: 'digitalButton',
};

export const gamepadJoystickTypeMap: inputTypeMap = {
  leftJoyXAxis: 'joystick',
  leftJoyYAxis: 'joystick',
  rightJoyXAxis: 'joystick',
  rightJoyYAxis: 'joystick',
};
