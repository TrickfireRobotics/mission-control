import { hydrateOnVisible } from 'vue';
import { createPublisher } from '../roslibUtils/createPublisher';
import { gamepadNames, joystickNames } from './controllerBindings';

/* This stores controller data for each controller connected to the system.
 * Button data are always sent, no matter what.
 * Joystick/Triggers have to go above a certain threshold (deltaSenitivity)
 * in order to be sent in order to avoid flooding the ROS network with
 * cotroller data. Essentially, we look at the velocity of the joystick/trigger
 * and determine if it is fast enough to send data.
 */

export class ControllerState {
  // Same format as currentStateButtons
  deltaStateButtons = Array(16).fill(0);
  deltaSensitivity = 0;

  //Key bindings
  bindingEntryToPublisher = new Map();
  friendlyNameToCurrentValue: Map<string, number> = new Map();
  friendlyNameToDelta: Map<string, number> = new Map();

  // Takes in a string that points to the binding JSON file as well as the deltaSensitivity
  constructor(jsonControllerBinding: string, deltaSensitivity: number) {
    this.deltaSensitivity = deltaSensitivity;

    // Set up the current value and delta value maps with friendly names of inputs
    for (const friendlyName of Object.values(gamepadNames).concat(Object.values(joystickNames))) {
      this.friendlyNameToCurrentValue.set(friendlyName, 0);
      this.friendlyNameToDelta.set(friendlyName, 0);
    }

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
      length: number;
      bindings: {
        name: string;
        type: 'digitalButton' | 'analogButton' | 'joystick';
        publisher: string;
      }[];
    } = JSON.parse(stringJson);

    // Fill bindingEntryToPublisher with entry and values.
    for (const entry of json.bindings) {
      const publisher = createPublisher({
        topicName: entry.publisher,
        topicType: 'std_msgs/Float32',
      });

      this.bindingEntryToPublisher.set(entry, publisher);
    }
  }

  // Update the current and delta values of each element and publish to ROS
  updateState(gamepad: Gamepad) {
    const joystickArray = gamepad.axes;
    const buttonArray = gamepad.buttons;

    for (let i: number = 0; i < buttonArray.length; i++) {
      const friendlyName = gamepadNames[i];
      const currentValue = this.friendlyNameToCurrentValue.get(friendlyName);
      if (currentValue != null) {
        this.friendlyNameToDelta.set(friendlyName, currentValue - buttonArray[i].value);
        this.friendlyNameToCurrentValue.set(friendlyName, buttonArray[i].value);
      }
    }

    for (let i: number = 0; i < joystickArray.length; i++) {
      const friendlyName = joystickNames[i];
      const currentValue = this.friendlyNameToCurrentValue.get(friendlyName);
      if (currentValue != null) {
        this.friendlyNameToDelta.set(friendlyName, currentValue - joystickArray[i].valueOf());
        this.friendlyNameToCurrentValue.set(friendlyName, joystickArray[i].valueOf());
      }
    }

    for (const [entry, publisher] of this.bindingEntryToPublisher) {
      if (this.friendlyNameToDelta.get(entry.name)) {
        publisher.publish(
          { data: this.friendlyNameToCurrentValue.get(entry.name) },
          { isDebugging: true },
        );
      }
    }
  }

  // Print the current state of the controller as seen by the browser
  printNumbers() {}
}
