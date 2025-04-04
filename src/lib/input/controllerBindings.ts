export type inputType = 'digitalButton' | 'analogButton' | 'joystick';
type controllerIndexMap = {
  [index: number]: {
    name: string;
    type: inputType;
  };
};

export const controllerIndexButtonMap: controllerIndexMap = {
  0: { name: 'aButton', type: 'digitalButton' },
  1: { name: 'bButton', type: 'digitalButton' },
  2: { name: 'xButton', type: 'digitalButton' },
  3: { name: 'yButton', type: 'digitalButton' },
  4: { name: 'leftBumperButton', type: 'digitalButton' },
  5: { name: 'rightBumperButton', type: 'digitalButton' },
  6: { name: 'leftTriggerButton', type: 'digitalButton' },
  7: { name: 'rightTriggerButton', type: 'digitalButton' },
  8: { name: 'backButton', type: 'digitalButton' },
  9: { name: 'startButton', type: 'digitalButton' },
  10: { name: 'leftJoystickButton', type: 'analogButton' },
  11: { name: 'rightJoystickButton', type: 'analogButton' },
  12: { name: 'dpadUPButton', type: 'digitalButton' },
  13: { name: 'dpadDOWNButton', type: 'digitalButton' },
  14: { name: 'dpadLEFTButton', type: 'digitalButton' },
  15: { name: 'dpadRIGHTButton', type: 'digitalButton' },
};

export const controllerIndexJoystickMap: controllerIndexMap = {
  0: { name: 'leftJoyXAxis', type: 'joystick' },
  1: { name: 'leftJoyYAxis', type: 'joystick' },
  2: { name: 'rightJoyXAxis', type: 'joystick' },
  3: { name: 'rightJoyYAxis', type: 'joystick' },
};
