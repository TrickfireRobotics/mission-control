type APIIndexToFriendlyName = {
    [index: number]: string;
}

export const gamepadNames: APIIndexToFriendlyName = {
    0: 'aButton',
    1: 'bButton',
    2: 'xButton',
    3: 'yButton',
    4: 'leftBumperButton',
    5: 'rightBumperButton',
    6: 'leftTriggerButton',
    7: 'rightTriggerButton',
    8: 'backButton',
    9: 'startButton',
    10: 'leftJoystickButton',
    11: 'rightJoystickButton',
    12: 'dpadUPButton',
    13: 'dpadDOWNButton',
    14: 'dpadLEFTButton',
    15: 'dpadRIGHTButton'
};
  
export const joystickNames: indexToFriendlyName = {
    0: 'leftJoyXAxis',
    1: 'leftJoyYAxis',
    2: 'rightJoyXAxis',
    3: 'rightJoyYAxis'
};