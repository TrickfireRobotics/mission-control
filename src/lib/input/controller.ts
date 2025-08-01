import { createPublisher } from '../roslibUtils/createPublisher';
import {
  type InputType,
  controllerIndexButtonMap,
  controllerIndexJoystickMap,
} from './controllerIndexBindings';
import { controllerInstanceProfiles } from './input_bindings/controllerBindings';
import type { ControllerBind, ControllerProfile, InputMode } from './input_bindings/bindingTypes';

/**
 * Represents an instance of a controller in the input system.
 * 
 * This class sets up an input store for each button and joystick based on the active controller profile from {@link controllerBindings}
 * The {@link updateState} method is to be called periodically to continually asses the state of the passed input
 * and based on the difference in state, or delta, perform the assigned action depending on the {@link InputMode}.
 * 
 * Profiles can be switched at runtime, and the controller can be activated and deactivated.
 * 
 * @property {number} deltaSensitivity - a general delta sensitivity used by the class when an input specific sensitivity is not assigned. 
 *                                       This value will default to 0.5.
 * @property {number} apiControllerIndex - the zero-index (starting at 0) used by the controller API to refer to this controller.
 * @property {number} activeProfileIndex - the zero-index (starting at 0) of the active controller input profile.
 * @property {[friendlyName: string]: ControllerBind} controllerProfiles - a list of controller input profiles to be used by this controller.
 * @property {boolean} active - whether the controller is active or not.
 * 
 * @property {object} inputStore - a store of each controller input and corresponding data used to gather and respond to input.
 * 
 * @class
 * @see {@link controllerInstanceProfiles}
 * @see {@link controllerProfiles}
 */
export class Controller {
  deltaSensitivity = 0.5;
  apiControllerIndex: number = 0;
  activeProfileIndex: number = 0;
  controllerProfiles: ControllerProfile[] = [];
  active: boolean = true;

  //Key bindings
  inputStore: {
    [input: string]: {
      action: () => void;
      inputMode: InputMode;
      type: InputType;
      currentValue: number;
      deltaValue: number;
      deltaSensitivity: number | undefined;
      delay: number | undefined;
      intervalID: number | null;
      wasActive: boolean;
    };
  } = {};

  /**
   * Creates a new Controller instance.
   * @param {Object[]} controllerProfiles - List of controller input profiles.
   * @param {number} apiControllerIndex - The API index for this controller.
   * @param {number} deltaSensitivity - Optional default delta sensitivity
   */
  constructor(
    controllerProfiles: { [inputName: string]: ControllerBind }[],
    apiControllerIndex: number,
    deltaSensitivity?: number,
  ) {
    this.controllerProfiles = controllerProfiles;
    this.apiControllerIndex = apiControllerIndex;
    if (deltaSensitivity != null) {
      this.deltaSensitivity = deltaSensitivity;
    }

    this.initControllerInput();
  }

  /**
   * Initializes the controller input store with the selected profile.
   * @param {number} [index=0] - Optional profile index to activate.
   * @param {ControllerProfile} [profileObj] - Optional profile object to set the controller to.
   */
  initControllerInput(index?: number, profileObj?: ControllerProfile) {
    let controllerProfile;
    if (profileObj == null) {
      if (index != undefined) {
        if (index >= 0 && index < this.controllerProfiles.length) {
          this.activeProfileIndex = index;
        } else {
          console.warn(
            `Index ${index} is out of bounds for controller bindings. Using default binding.`,
          );
        }
      }

      controllerProfile = this.controllerProfiles[this.activeProfileIndex];
    } else {
      controllerProfile = profileObj;
    }

    for (const [eventName, bind] of Object.entries(controllerProfile)) {

      let action;
      this.inputStore[eventName] = {
        action: () => {},
        inputMode: bind.inputMode ?? 'Press',
        type: 'digitalButton',
        currentValue: 0,
        deltaValue: 0,
        deltaSensitivity: bind.deltaSensitivity,
        delay: bind.delay ?? 500,
        intervalID: null,
        wasActive: false
      }

      if (bind.publisher) {
        const publisher = createPublisher({
          topicName: bind.publisher,
          topicType: 'std_msgs/Float32',
        });
        action = () => {
          if (this.active) {
            publisher.publish({ data: this.inputStore[eventName].currentValue }, { isDebugging: bind.isDebugging || false });
          }
        };
      } else if (bind.function) {
        action = () => {
          if (this.active) {
            bind.function(this.inputStore[eventName].currentValue, eventName);
          }
        };
      } else {
        action = () => {
          if (this.active) {
            console.warn(`${eventName} does not have a publisher or function specified`);
          }
        };
      }

      this.inputStore[eventName].action = action;
    }
  }

  /**
   * Updates the current and deltavalues of each input and triggers actions as needed.
   * Should be called periodically to continously record input.
   * @param {Gamepad} gamepad - The Gamepad object to read input from. 
   */
  updateState(gamepad: Gamepad) {
    const joystickArray = gamepad.axes;
    const buttonArray = gamepad.buttons;

    for (let i: number = 0; i < buttonArray.length; i++) {
      const currentInput = this.inputStore[controllerIndexButtonMap[i]?.name];

      if (currentInput) {
        currentInput.type = controllerIndexButtonMap[i].type;
        currentInput.deltaValue = buttonArray[i].value - currentInput.currentValue;
        currentInput.currentValue = buttonArray[i].value;
      }
    }

    for (let i: number = 0; i < joystickArray.length; i++) {
      const currentInput = this.inputStore[controllerIndexJoystickMap[i]?.name];

      if (currentInput) {
        currentInput.type = controllerIndexJoystickMap[i].type;
        currentInput.deltaValue = joystickArray[i].valueOf() - currentInput.currentValue;
        currentInput.currentValue = joystickArray[i].valueOf();
      }
    }

    for (const input of Object.values(this.inputStore)) {
      const threshold = input.deltaSensitivity ?? this.deltaSensitivity;
      const isJoystick = input.type === 'joystick';
      const measure = isJoystick ? Math.abs(input.currentValue) : input.deltaValue;

      switch (input.inputMode) {
        case "Press":
          if (isJoystick) {
            if (measure > threshold && !input.wasActive) {
              input.action();
              input.wasActive = true;
            } else if (measure <= threshold) {
              input.wasActive = false;
            }
          } else {
            if (input.deltaValue > threshold) {
              input.action();
            }
          }
          break;
        case "Release":
          if (isJoystick) {
            if (measure > threshold && !input.wasActive) {
              input.wasActive = true;
            } else if (measure <= threshold) {
              input.action();
              input.wasActive = false;
            }
          } else {
            if (input.deltaValue < 0) {
              input.action()
            }
          }
          break;

        case "PressRelease":
          if (isJoystick) {
            if (measure > threshold && !input.wasActive) {
              input.action();
              input.wasActive = true;
            } else if (measure <= threshold && input.wasActive) {
              input.action();
              input.wasActive = false;
            }
          } else {
            if (input.deltaValue !== 0) {
              input.action();
            }
          }
          break;

        case "Hold":
          if (isJoystick) {
            if (measure > threshold) {
              if (!input.intervalID) {
                input.intervalID = setInterval(() => input.action(), input.delay);
                input.action();
              }
            } else {
              if (input.intervalID) {
                clearInterval(input.intervalID);
                input.action();
                input.intervalID = null;
              }
            }
          } else {
            if (input.deltaValue > 0){
              if (!input.intervalID) {
                input.intervalID = setInterval(() => input.action(), input.delay);
                input.action()
              }
            }
            else if (input.deltaValue < 0){
              if (input.intervalID){
                clearInterval(input.intervalID);
                input.action()
                input.intervalID = null
              }
            }
          }
          break;
      }
    }
  }

  /**
   * Activates input for the keyboard.
   */
  activate() {
    this.active = true;
  }

  /**
   * Deactivates input for the keyboard.
   */
  deactivate() {
    this.active = false;
  }

  /**
   * Toggles activation for the keyboard.
   */
  toggleActive() {
    this.active = !this.active;
  }
}
