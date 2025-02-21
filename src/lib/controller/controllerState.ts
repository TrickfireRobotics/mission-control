import { createPublisher, type Publisher } from '../roslibUtils/createPublisher';
import { type inputType, gamepadButtonTypeMap, gamepadJoystickTypeMap } from './controllerBindings';
import { onKeyDown, onKeyPressed } from '@vueuse/core'

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
      publisher: Publisher<'std_msgs/Float32'>;
      type: inputType;
      currentValue: number;
      deltaValue: number;
      deltaSensitivity?: number;
    };
  } = {};

  // Takes in a string that points to the binding JSON file as well as the deltaSensitivity
  constructor(jsonControllerBinding: string, deltaSensitivity: number) {
    this.deltaSensitivity = deltaSensitivity;

    fetch(jsonControllerBinding)
      .then((response) => response.json())
      .then((json) => this.readJSONFile(json));
  }

  readJSONFile(jsonInput: JSON) {
    // Convert the JSON to be read
    // Use glob import or static import in https://github.com/TrickfireRobotics/mission-control/pull/28#discussion_r1827239874
    // Look at comment on how to cast it https://github.com/TrickfireRobotics/mission-control/pull/28#discussion_r1834908954
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const stringJson = JSON.stringify(jsonInput);
    const json: {
      [friendlyInput: string]: string | { type: inputType; deltaSensitivity: number };
    } = JSON.parse(stringJson);

    // Fill bindingEntryToPublisher with entry and values.
    for (const [inputName, inputEntry] of Object.entries(json)) {
      const publisher = createPublisher({
        topicName: inputName,
        topicType: 'std_msgs/Float32',
      });

      if (!gamepadButtonTypeMap.hasOwnProperty(inputName) && !gamepadJoystickTypeMap.hasOwnProperty(inputName)) {
        onKeyDown(inputName, () => publisher.publish({data: 1}, {isDebugging: true}));
      }
      else {
        this.inputStore[inputName] = {
          publisher: publisher,
          type: 'digitalButton',
          currentValue: 0,
          deltaValue: 0,
        };
  
        if (typeof inputEntry === 'object') {
          this.inputStore[inputName].deltaSensitivity = inputEntry.deltaSensitivity;
        }
      }
    }
  }

  // Update the current and delta values of each element and publish to ROS
  updateState(gamepad: Gamepad) {
    const joystickArray = gamepad.axes;
    const buttonArray = gamepad.buttons;

    for (let i: number = 0; i < buttonArray.length; i++) {
      const currentInput = this.inputStore[gamepadButtonTypeMap[i]];

      if (currentInput) {
        currentInput.deltaValue = currentInput.currentValue - buttonArray[i].value;
        currentInput.currentValue = buttonArray[i].value;
      }
    }

    for (let i: number = 0; i < joystickArray.length; i++) {
      const currentInput = this.inputStore[gamepadJoystickTypeMap[i]];

      if (currentInput) {
        currentInput.deltaValue = currentInput.currentValue - joystickArray[i].valueOf();
        currentInput.currentValue = joystickArray[i].valueOf();
      }
    }

    for (const inputEntry of Object.values(this.inputStore)) {
      if (inputEntry.deltaValue > (this.deltaSensitivity)) {
        inputEntry.publisher.publish({ data: inputEntry.currentValue }, { isDebugging: true });
      }
    }
  }
}
