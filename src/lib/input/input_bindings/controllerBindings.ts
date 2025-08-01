import { type ControllerProfile } from './bindingTypes';

/**
 * An array of controller binding profiles for each instance of a connected controller. For each controller instance
 * there is a collection of binding profiles that maps button and joystick names to their respective actions and input modes.
 * The first profile is active by default and profiles can be swapped during runtime with {@link Controller.initControllerInput}.
 *
 * Each button in a profile maps to a {@link InputBind} object, which can specify the following parameters:
 *  - `function`: a function to call when the key is activated. Receives an optional output signal (0 or 1) and button name.
 *  - `publisher`: a topic name publish to when the key is activated. Publishes an output signal (0 or 1).
 *  - `isDebugging`: (optional, with publisher) if true, logs output to the console.
 *  - `inputMode`: determines when the action is triggered and with what output. Possible values:
 *     - `'Press'`: triggers the action once with output 1 when the button is pressed (default).
 *     - `'Release'`: triggers the action with output 0 when the button is released.
 *     - `'PressRelease'`: triggers the action with output 1 when pressed, and again with output 0 when released.
 *     - `'Hold'`: triggers the action continuously with output 1 while held, and with output 0 when released.
 *  - `delay`: (optional, with inputMode: 'Hold') time in ms between repeated actions, 1000 by default.
 *
 * Note: Only `function` or `publisher` may be specified for a key, not both.
 *
 * @example
 * // Example: Add a button that publishes to 'topic_name' when pressed and logs ouput.
 * {
 *    a: {inputMode: 'Press', publisher: 'topic_name', isDebugging: true}
 * }
 * @example
 * // Example: Add a button that logs output to the console when held with a delay of 500 ms.
 * {
 *    b: {inputMode: 'Hold', function: (output, button) => console.log(output, button), delay: 500}
 * }
 *
 * @see {@link InputBind}
 * @see {@link ControllerProfile}
 * @see {@link Controller}
 * @see {@link Controller.initControllerInput}
 */

export const controllerInstanceProfiles: ControllerProfile[][] = [
    [
        {
            aButton: { inputMode: 'Hold', function: (x, button) => console.log(`Getting ${x} from ${button}`) },
            bButton: { inputMode: 'PressRelease', publisher: 'Hello', isDebugging: true},
            xButton: { inputMode: 'Press', function: (x) => console.log(`Getting ${x}`)},
            yButton: { inputMode: 'Release', function: x => console.log(`Getting ${x}`)},
            leftBumperButton: {},
            rightBumperButton: {},
            leftTriggerButton: {},
            rightTriggerButton: {},
            backButton: {},
            startButton: {},
            leftJoystickButton: {},
            rightJoystickButton: {},
            dpadUPButton: {},
            dpadDOWNButton: {},
            dpadLEFTButton: {},
            dpadRIGHTButton: {},
            leftJoyXAxis: { inputMode: 'Press', function: (x) => console.log(`Getting ${x}`)},
            leftJoyYAxis: { inputMode: 'Hold', function: (x) => console.log(`Getting ${x}`)},
            rightJoyXAxis: { inputMode: 'PressRelease', function: (x) => console.log(`Getting ${x}`)},
            rightJoyYAxis: {},
        },
    ],
    [
        {
            aButton: {},
            bButton: {},
            xButton: {},
            yButton: {},
            leftBumperButton: {},
            rightBumperButton: {},
            leftTriggerButton: {},
            rightTriggerButton: {},
            backButton: {},
            startButton: {},
            leftJoystickButton: {},
            rightJoystickButton: {},
            dpadUPButton: {},
            dpadDOWNButton: {},
            dpadLEFTButton: {},
            dpadRIGHTButton: {},
            leftJoyXAxis: {},
            leftJoyYAxis: {},
            rightJoyXAxis: {},
            rightJoyYAxis: {},
        },
    ],
];
