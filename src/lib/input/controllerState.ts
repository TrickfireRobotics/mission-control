import { createPublisher, type Publisher } from '../roslibUtils/createPublisher';
import {
  type inputType,
  controllerIndexButtonMap,
  controllerIndexJoystickMap,
} from './controllerBindings';
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
      action: Publisher<'std_msgs/Float32'> | Function | {function: Function, args?: any[]};
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

    this.initControllerInput(controllerBindings);
  }

  initControllerInput(controllerBindings: { [friendlyName: string]: controllerBind }) {
    for (const [eventName, action] of Object.entries(controllerBindings)) {
      if (action === '') continue;
      
      const baseInput = {
        type: 'digitalButton' as inputType,
        currentValue: 0,
        deltaValue: 0,
      }
    
      switch (typeof action) {
        // If a publisher name is supplied
        case 'string': {
          const publisher = createPublisher({
            topicName: action,
            topicType: 'std_msgs/Float32',
          });
    
          this.inputStore[eventName] = {...baseInput, action: publisher};
          break;
        }
        // If a function is supplied
        case 'function': {
          this.inputStore[eventName] = {...baseInput, action};
        }
        // If arguments or delta sensitivity are supplied with a function or publisher
        case 'object': {
          if ('function' in action) {
            this.inputStore[eventName] = {...baseInput, action: {function: action.function, args: action.args || []}};
          } else if ('publisher' in action) {
            const publisher = createPublisher({
              topicName: action.publisher,
              topicType: 'std_msgs/Float32',
            });
    
            this.inputStore[eventName] = {...baseInput, action: publisher}
          }
    
          if ('deltaSensitivity' in action) this.inputStore[eventName].deltaSensitivity = action.deltaSensitivity;
          
          break;
        }
        default: {
          console.log(`Error: Invalid action "${action}" supplied for event "${eventName}"`);
        }
      }
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
        const action = inputEntry.action;
        if ('publish' in action)
        {
          action.publish({ data: inputEntry.currentValue }, { isDebugging: true });
        }
        else if (typeof action === 'function')
        {
          action();
        }
        else 
        {
          action.function(...(action.args || []));
        }
      }
    }
  }
}