/**
 * The allowed input modes for an input binding.
 * -  `'Press'`: Action is triggered once when button is pressed (1).
 * -  `'PressRelease'`: Action is triggered once when the button is pressed (1) and again on release (0).
 * -  `'Hold'`: Action is triggered continuously when held down (1) and when released (0).
 */
export type InputMode = 'Press' | 'PressRelease' | 'Hold';

/**
 *  Common properties for keyboard bindings.
 *  @property {InputMode} [inputMode='Press'] - The mode of input, defaults to 'Press' if not specified.
 *  @property {number} [delay] - The delay in milliseconds between action calls when the inputMode is 'Hold'.
 */
interface KeyboardBasics {
  inputMode?: InputMode;
  delay?: number;
}

/**
 * Keyboard binding that triggers a function when activated.
 * @property {(output?: number) => void} - Function to call when the key is pressed. Receives optional ouput signal (0 or 1).
 * @property {never} [publisher] - Not allowed if a function is specified.
 */
interface KeyboardFunction extends KeyboardBasics {
  function: (output?: number) => void;
  publisher?: never;
}

/**
 * Keyboard binding that triggers a publisher when activated.
 * @property {string} publisher - Topic name to publish to when the key is pressed. Publishes output signal (0 or 1).
 * @property {boolean} [isDebugging] - Optional property. If true, logs output to the console when pressed.
 * @property {never} [function] - Not allowed if a publisher is specified
 */
interface KeyboardPublisher extends KeyboardBasics {
  publisher: string;
  isDebugging?: boolean;
  function?: never;
}

/**
 * Keyboard binding for when neither a publisher nor function is specified.
 */
interface KeyboardNeither extends KeyboardBasics {
  publisher?: never;
  function?: never;
}

/**
 * Keyboard binding that can trigger a publisher, function, or neither (but not both).
 */
export type KeyboardBind = KeyboardFunction | KeyboardPublisher | KeyboardNeither;

/**
 * Collection of keyboard bindings for each key that create a profile that can be swapped.
 * @example
 *    const profile: KeyboardProfile = {
 *        a: {inputMode: 'Press', publisher: 'Hello', isDebugging: true},
 *        b: {inputMode: 'Hold', function: (output) => console.log(x), delay: 500}
 *    }
 * @see {@link KeyboardBind}
 */
export type KeyboardProfile = { [input: string]: KeyboardBind };

export type ControllerBind = KeyboardBind | { publisher: string; deltaSensitivity?: number };
