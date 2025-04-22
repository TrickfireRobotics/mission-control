import { createPublisher, type Publisher } from '../roslibUtils/createPublisher';
import {
  type inputType,
  controllerIndexButtonMap,
  controllerIndexJoystickMap,
} from './controllerBindings';
import { onKeyDown, onKeyPressed } from '@vueuse/core';
import { type controllerBind } from './InputBindings';

/* This stores controller data for each controller connected to the system.
 * Button data are always sent, no matter what.
 * Joystick/Triggers have to go above a certain threshold (deltaSenitivity)
 * in order to be sent in order to avoid flooding the ROS network with
 * cotroller data. Essentially, we look at the velocity of the joystick/trigger
 * and determine if it is fast enough to send data.
 */

export class ControllerState {
  // Same format as currentStateButtons
  deltaSensitivity = 0;

  //Key bindings
  inputStore: {
    [input: string]: {
      action: Publisher<'std_msgs/Float32'> | Function;
      type: inputType;
      currentValue: number;
      deltaValue: number;
      deltaSensitivity?: number;
    };
  } = {};

  // Takes in a string that points to the binding JSON file as well as the deltaSensitivity
  constructor(
    controllerBindings: { [friendlyName: string]: controllerBind },
    deltaSensitivity: number,
  ) {
    this.deltaSensitivity = deltaSensitivity;

    for (const [eventName, action] of Object.entries(controllerBindings)) {
      switch (typeof action) {
        // If a publisher name is supplied
        case 'string': {
          if (action === '') break;

          const publisher = createPublisher({
            topicName: action,
            topicType: 'std_msgs/Float32',
          });

          this.inputStore[eventName] = {
            action: publisher,
            type: 'digitalButton',
            currentValue: 0,
            deltaValue: 0,
          };

          break;
        }
        // If a function is supplied
        case 'function': {
          this.inputStore[eventName] = {
            action,
            type: 'digitalButton',
            currentValue: 0,
            deltaValue: 0,
          };
          break;
        }
        // If arguments are supplied with a function or publisher
        case 'object': {
          this.inputStore[eventName] = {
            action: () => {},
            type: 'digitalButton',
            currentValue: 0,
            deltaValue: 0,
          };

          if ('function' in action) {
            this.inputStore[eventName].action = action.function;
          } else if ('publisher' in action) {
            const publisher = createPublisher({
              topicName: action.publisher,
              topicType: 'std_msgs/Float32',
            });

            this.inputStore[eventName].action = publisher;
          }
          break;
        }
        default: {
          console.log(`Error: Invalid action "${action}" supplied for event "${eventName}"`);
        }
      }
      console.log(this.inputStore);
    }
  }

  // Update the current and delta values of each element and publish to ROS
  updateState(gamepad: Gamepad) {
    const joystickArray = gamepad.axes;
    const buttonArray = gamepad.buttons;

    for (let i: number = 0; i < buttonArray.length; i++) {
      const currentInput = this.inputStore[controllerIndexButtonMap[i]?.name];

      if (currentInput) {
        currentInput.type = controllerIndexButtonMap[i].type;
        currentInput.deltaValue = Math.abs(currentInput.currentValue - buttonArray[i].value);
        currentInput.currentValue = buttonArray[i].value;
      }
    }

    for (let i: number = 0; i < joystickArray.length; i++) {
      const currentInput = this.inputStore[controllerIndexJoystickMap[i]?.name];

      if (currentInput) {
        currentInput.type = controllerIndexJoystickMap[i].type;
        currentInput.deltaValue = Math.abs(currentInput.currentValue - joystickArray[i].valueOf());
        currentInput.currentValue = joystickArray[i].valueOf();
      }
    }

    for (const inputEntry of Object.values(this.inputStore)) {
      if (inputEntry.deltaValue > this.deltaSensitivity) {
        // inputEntry.action.publish({ data: inputEntry.currentValue }, { isDebugging: true });
      }
    }
  }
}
