/**
 * The allowed input modes for an input binding.
 * -  `'Press'`: Action is triggered once when button is pressed (1).
 * -  `'PressRelease'`: Action is triggered once when the button is pressed (1) and again on release (0).
 * -  `'Hold'`: Action is triggered continuously when held down (1) and when released (0).
 */
export type InputMode = 'Press' | 'Release' | 'PressRelease' | 'Hold';

/**
 *  Common properties for input bindings.
 *  @property {InputMode} [inputMode='Press'] - The mode of input, defaults to 'Press' if not specified.
 *  @property {number} [delay] - The delay in milliseconds between action calls when the inputMode is 'Hold'.
 */
interface BindBasics {
  inputMode?: InputMode;
  delay?: number;
}

/**
 * Input binding that triggers a function when activated.
 * @property {(output?: number, inputName?: string) => void} - Function to call when the input is activated. Receives optional ouput signal (0 or 1) and the input name.
 * @property {never} [publisher] - Not allowed if a function is specified.
 */
interface BindFunction extends BindBasics {
  function: (output?: number, inputName?: string) => void;
  publisher?: never;
}

/**
 * Input binding that triggers a publisher when activated.
 * @property {string} publisher - Topic name to publish to when the input is activated. Publishes output signal (0 or 1).
 * @property {boolean} [isDebugging] - Optional property. If true, logs output signal to the console when activated.
 * @property {never} [function] - Not allowed if a publisher is specified
 */
interface BindPublisher extends BindBasics {
  publisher: string;
  isDebugging?: boolean;
  function?: never;
}

/**
 * Input binding for when neither a publisher nor function is specified.
 */
interface BindNeither extends BindBasics {
  publisher?: never;
  function?: never;
}

/**
 * Input binding that can trigger a publisher, function, or neither (but not both).
 */
export type InputBind = BindFunction | BindPublisher | BindNeither;

/**
 * Collection of keyboard bindings for each key that create a swappable profile.
 * @example
 *    const profile: KeyboardProfile = {
 *        a: {inputMode: 'Press', publisher: 'Hello', isDebugging: true},
 *        b: {inputMode: 'Hold', function: (output) => console.log(x), delay: 500}
 *    }
 * @see {@link InputBind}
 */
export type KeyboardProfile = { [input: string]: InputBind };

/**
 * An extended {@link InputBind} that includes an optional deltaSensitivity specification for controllers.
 */
export type ControllerBind = InputBind & {deltaSensitivity?: number};

/**
 * Collection of controller bindings for each button and joystick axis that create a swappable profile.
 * @example
 *    const profile: ControllerProfile = {
 *       a: {inputMode: 'Press', publisher: 'Hello', isDebugging: true},
 *       x: {inputMode: 'Hold', function: (output) => console.log(x), delay: 500, deltaSensitivity: 0.2}
 *    }
 */
export type ControllerProfile = {[input: string]: ControllerBind};
