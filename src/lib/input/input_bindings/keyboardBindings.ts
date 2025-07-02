import { type KeyboardProfile, type KeyboardBind } from './bindingTypes';
import { Keyboard } from '../keyboard';

/**
 * An array of keyboard binding profiles, each mapping key names to their respective actions and input modes.
 * The first profile is active by default and profiles can be swapped using {@link Keyboard.setProfile}.
 *
 * Each key in a profile maps to a {@link KeyboardBind} object, which can specify the following parameters:
 *  - `function`: a function to call when the key is activated. Receives an optional output signal (0 or 1).
 *  - `publisher`: a topic name publish to when the key is activated. Publishes an output signal (0 or 1).
 *  - `isDebugging`: (optional, with publisher) if true, logs output to the console.
 *  - `inputMode`: determines when the action is triggered and with what output. Possible values:
 *     - `'Press'`: triggers the action once with output 1 when the key is pressed (default).
 *     - `'PressRelease'`: triggers the action with output 1 when pressed, and again with output 0 when released.
 *     - `'Hold'`: triggers the action continuously with output 1 while held, and with output 0 when released.
 *  - `delay`: (optional, with inputMode: 'Hold') time in ms between repeated actions, 1000 by default.
 *
 * Note: Only `function` or `publisher` may be specified for a key, not both.
 *
 * @example
 * // Example: Add a key that publishes to 'topic_name' when pressed and logs ouput.
 * {
 *    a: {inputMode: 'Press', publisher: 'topic_name', isDebugging: true}
 * }
 * @example
 * // Example: Add a key that logs output to the console when held with a delay of 500 ms.
 * {
 *    b: {inputMode: 'Hold', function: (output) => console.log(output), delay: 500}
 * }
 *
 * @see {@link KeyboardBind}
 * @see {@link KeyboardProfile}
 * @see {@link Keyboard}
 * @see {@link Keyboard.setProfile}
 */
export const keyboardBindings: KeyboardProfile[] = [
  {
    a: { inputMode: 'PressRelease', function: (x) => console.log(`Getting ${x}`) },
    b: { inputMode: 'Hold', publisher: 'Hello' },
    c: { inputMode: 'Hold' },
    d: {},
    e: {},
    f: {},
    g: {},
    h: {},
    i: {},
    j: {},
    k: {},
    l: {},
    m: {},
    n: {},
    o: {},
    p: {},
    q: {},
    r: {},
    s: {},
    t: {},
    u: {},
    v: {},
    w: {},
    x: {},
    y: {},
    z: {},
    0: {},
    1: { inputMode: 'Press', function: (x) => console.log(`Getting ${x} pressed.`) },
    2: {
      inputMode: 'PressRelease',
      function: (x) => console.log(`Getting ${x} pressed and released.`),
    },
    3: { inputMode: 'Hold', function: (x) => console.log(`Getting ${x} held.`) },
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
    Enter: {},
    Escape: {},
    Backspace: {},
    Tab: {},
    Shift: {},
    Control: {},
    Alt: {},
    CapsLock: {},
    ArrowUp: {},
    ArrowDown: {},
    ArrowLeft: {},
    ArrowRight: {},
    ' ': {},
  },
  {
    a: {},
    b: {},
    c: {},
    d: {},
    e: {},
    f: {},
    g: {},
    h: {},
    i: {},
    j: {},
    k: {},
    l: {},
    m: {},
    n: {},
    o: {},
    p: {},
    q: {},
    r: {},
    s: {},
    t: {},
    u: {},
    v: {},
    w: {},
    x: {},
    y: {},
    z: {},
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
    6: {},
    7: {},
    8: {},
    9: {},
    Enter: {},
    Escape: {},
    Backspace: {},
    Tab: {},
    Shift: {},
    Control: {},
    Alt: {},
    CapsLock: {},
    ArrowUp: {},
    ArrowDown: {},
    ArrowLeft: {},
    ArrowRight: {},
    ' ': {},
  },
];
