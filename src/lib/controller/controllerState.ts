import { createPublisher } from '../roslibUtils/createPublisher';
import { gamepadNames, joystickNames } from './controllerBindings';
import { useSettingsStore } from '@/store/settingsStore';

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
  // Tracks the last value that was actually published to ROS so we can
  // detect when we need to force-send a zero even if the rate limiter would
  // otherwise drop it (e.g. trigger released <100 ms after last command)
  friendlyNameToLastPublished: Map<string, number> = new Map();

  maxPublishRateHz: number | undefined = undefined;

  // Takes in a string that points to the binding JSON file as well as the deltaSensitivity
  constructor(jsonControllerBinding: string, deltaSensitivity: number, maxPublishRateHz?: number) {
    this.deltaSensitivity = deltaSensitivity;
    this.maxPublishRateHz = maxPublishRateHz;

    // Set up the current value and delta value maps with friendly names of inputs
    for (const friendlyName of Object.values(gamepadNames).concat(Object.values(joystickNames))) {
      this.friendlyNameToCurrentValue.set(friendlyName, 0);
      this.friendlyNameToDelta.set(friendlyName, 0);
      this.friendlyNameToLastPublished.set(friendlyName, 0);
    }

    fetch(jsonControllerBinding)
      .then((response) => response.json())
      .then((json) => this.readJSONFile(json));
  }

  readJSONFile(jsonInput: JSON) {
    // Convert the JSON to be read
    // Use glob import or static import in https://github.com/TrickfireRobotics/mission-control/pull/28#discussion_r1827239874
    // Look at comment on how to cast it https://github.com/TrickfireRobotics/mission-control/pull/28#discussion_r1834908954

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
        maxRateHz: this.maxPublishRateHz,
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

    const { tankDriveBlockHorizontal, invertX, invertY, deadzone } =
      useSettingsStore().settings.controller;

    for (let i: number = 0; i < joystickArray.length; i++) {
      const friendlyName = joystickNames[i];
      const currentValue = this.friendlyNameToCurrentValue.get(friendlyName);
      if (currentValue != null) {
        // Axes 0 and 2 are X axes; axes 1 and 3 are Y axes
        const isXAxis = i === 0 || i === 2;
        const isYAxis = i === 1 || i === 3;

        // When tank-drive blocking is on, treat X axes as always zero
        let rawValue = tankDriveBlockHorizontal && isXAxis ? 0 : joystickArray[i].valueOf();

        // Apply invert settings
        if (invertX && isXAxis) rawValue = -rawValue;
        if (invertY && isYAxis) rawValue = -rawValue;

        // Apply deadzone: clamp values near centre to exactly zero so we
        // don't spam the ROS network with tiny drift commands
        if (Math.abs(rawValue) < deadzone) rawValue = 0;

        this.friendlyNameToDelta.set(friendlyName, rawValue - currentValue);
        this.friendlyNameToCurrentValue.set(friendlyName, rawValue);
      }
    }

    for (const [entry, publisher] of this.bindingEntryToPublisher) {
      const currentValue = this.friendlyNameToCurrentValue.get(entry.name) ?? 0;
      const lastPublished = this.friendlyNameToLastPublished.get(entry.name) ?? 0;
      const delta = this.friendlyNameToDelta.get(entry.name);

      // Force-publish zero when transitioning to zero so the robot always
      // receives a stop command, even if the rate limiter would otherwise
      // drop the call (e.g. trigger released within the 100 ms rate window)
      const stoppingNow = currentValue === 0 && lastPublished !== 0;

      if (delta || stoppingNow) {
        publisher.publish({ data: currentValue }, { isDebugging: true, force: stoppingNow });
        this.friendlyNameToLastPublished.set(entry.name, currentValue);
      }
    }
  }

  // Print the current state of the controller as seen by the browser
  printNumbers() {}
}
