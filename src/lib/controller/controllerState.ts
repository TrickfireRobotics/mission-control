import { createPublisher, type Publisher } from '../roslibUtils/createPublisher';
import { gamepadNames, joystickNames } from './controllerBindings';
import { useSettingsStore } from '@/store/settingsStore';
import { useControllerStore } from '@/store/controllerStore';

/* This stores controller data for each controller connected to the system.
 * A binding only publishes when its commanded value differs from what its topic
 * last carried, plus a periodic keepalive while an input is held, so holding a
 * stick or trigger steady doesn't flood the ROS network with identical messages.
 */

type BindingEntry = {
  name: string;
  type: 'digitalButton' | 'analogButton' | 'joystick';
  mode: 'drivebase' | 'arm';
  publisher: string;
  scale?: number;
  // friendly name of a button that negates this input while held. Triggers only read
  // 0..1, so the shoulder/elbow get their "other direction" from the same-side bumper.
  invertedBy?: string;
};

export class ControllerState {
  private static readonly KEEPALIVE_INTERVAL_MS = 200;
  // how long between the two Y presses counts as a "double tap"
  private static readonly MODE_TOGGLE_DOUBLE_TAP_WINDOW_MS = 600;
  private static readonly BUTTON_PRESS_THRESHOLD = 0.5;
  // analog triggers often idle a little above zero, and a resting trigger must not
  // creep the arm. Sticks use the user-configurable deadzone instead.
  private static readonly TRIGGER_DEADZONE = 0.06;

  //Key bindings
  bindingEntryToPublisher: Map<BindingEntry, Publisher<'std_msgs/Float32'>> = new Map();
  topicToPublisher: Map<string, Publisher<'std_msgs/Float32'>> = new Map();
  friendlyNameToCurrentValue: Map<string, number> = new Map();
  // last value actually published and when, keyed by topic name (not friendly name,
  // since the same stick/button can be bound to a different topic per mode)
  topicToLastPublished: Map<string, number> = new Map();
  topicToLastPublishTime: Map<string, number> = new Map();

  // Y button double-tap state, for toggling between drivebase and arm mode
  // without touching the UI
  private yButtonHeld = false;
  private modeToggleArmed = false;
  private modeToggleLastPressTime = 0;

  maxPublishRateHz: number | undefined = undefined;

  // When true, updateState() pushes its current values into the controller store for
  // the Controller tab's live display.
  private reportLiveValues: boolean;

  // Takes in a string that points to the binding JSON file
  constructor(jsonControllerBinding: string, maxPublishRateHz?: number, options?: { reportLiveValues?: boolean }) {
    this.maxPublishRateHz = maxPublishRateHz;
    this.reportLiveValues = options?.reportLiveValues ?? false;

    // Set up the current value map with friendly names of inputs
    for (const friendlyName of Object.values(gamepadNames).concat(Object.values(joystickNames))) {
      this.friendlyNameToCurrentValue.set(friendlyName, 0);
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
    const json: { bindings: BindingEntry[] } = JSON.parse(stringJson);

    // Fill bindingEntryToPublisher with entry and values.
    for (const entry of json.bindings) {
      // skip unmapped inputs instead of publishing to an empty topic name
      if (!entry.publisher) continue;

      let publisher = this.topicToPublisher.get(entry.publisher);
      if (publisher == null) {
        publisher = createPublisher({
          topicName: entry.publisher,
          topicType: 'std_msgs/Float32',
          maxRateHz: this.maxPublishRateHz,
        });
        this.topicToPublisher.set(entry.publisher, publisher);
      }

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
        this.friendlyNameToCurrentValue.set(friendlyName, buttonArray[i].value);
      }
    }

    const controller = useControllerStore();
    this.updateModeToggle();

    const { invertX, invertY, deadzone } = useSettingsStore().settings.controller;

    for (let i: number = 0; i < joystickArray.length; i++) {
      const friendlyName = joystickNames[i];
      const currentValue = this.friendlyNameToCurrentValue.get(friendlyName);
      if (currentValue != null) {
        // Axes 0 and 2 are X axes; axes 1 and 3 are Y axes
        const isXAxis = i === 0 || i === 2;
        const isYAxis = i === 1 || i === 3;

        let rawValue = joystickArray[i].valueOf();

        if (invertX && isXAxis) rawValue = -rawValue;
        if (invertY && isYAxis) rawValue = -rawValue;

        if (Math.abs(rawValue) < deadzone) rawValue = 0;

        this.friendlyNameToCurrentValue.set(friendlyName, rawValue);
      }
    }

    if (this.reportLiveValues) {
      controller.setLiveInputValues(this.friendlyNameToCurrentValue);
    }

    const topicCommands = new Map<
      string,
      { value: number; publisher: Publisher<'std_msgs/Float32'>; active: boolean }
    >();

    for (const [entry, publisher] of this.bindingEntryToPublisher) {
      const command = topicCommands.get(entry.publisher) ?? { value: 0, publisher, active: false };
      if (entry.mode === controller.gamePadMode && !controller.isTestTabFocused) {
        command.value += this.resolveBindingValue(entry);
        command.active = true;
      }
      topicCommands.set(entry.publisher, command);
    }

    const now = Date.now();
    for (const [topic, command] of topicCommands) {
      const currentValue = command.active ? Math.max(-1, Math.min(1, command.value)) : 0;
      const lastPublished = this.topicToLastPublished.get(topic) ?? 0;
      const lastPublishTime = this.topicToLastPublishTime.get(topic) ?? 0;

      // bindings for the inactive mode never publish, but if they were mid-motion when
      // the mode switched (or the Controller tab muted input), force one zero through
      // so the rover isn't left running blind
      if (!command.active) {
        if (lastPublished !== 0) {
          command.publisher.publish({ data: 0 }, { isDebugging: true, force: true });
          this.topicToLastPublished.set(topic, 0);
          this.topicToLastPublishTime.set(topic, now);
        }
        continue;
      }

      // compare against what the topic last actually carried rather than against the
      // previous poll's raw input: a trigger held steady while its invert bumper is
      // tapped changes the commanded value without any input delta
      const changed = currentValue !== lastPublished;

      // force-publish zero when transitioning to zero so the robot always receives a
      // stop command, even if the rate limiter would otherwise drop the call (e.g.
      // trigger released within the rate-limit window)
      const stoppingNow = currentValue === 0 && lastPublished !== 0;

      // a held, unchanging input stops publishing; resend periodically so the rover's
      // command timeout doesn't trip while a trigger/stick is just held
      const keepaliveDue = currentValue !== 0 && now - lastPublishTime >= ControllerState.KEEPALIVE_INTERVAL_MS;

      if (changed || keepaliveDue) {
        const published = command.publisher.publish({ data: currentValue }, { isDebugging: true, force: stoppingNow });
        // the rate limiter drops publishes silently, so only remember what it accepted,
        // otherwise a dropped change looks sent and isn't retried until the keepalive
        if (published) {
          this.topicToLastPublished.set(topic, currentValue);
          this.topicToLastPublishTime.set(topic, now);
        }
      }
    }
  }

  // The value a binding should publish: its input, zeroed inside the trigger deadzone
  // and negated while its invert button (if any) is held.
  private resolveBindingValue(entry: BindingEntry): number {
    let value = this.friendlyNameToCurrentValue.get(entry.name) ?? 0;

    if (entry.type === 'analogButton' && Math.abs(value) < ControllerState.TRIGGER_DEADZONE) {
      value = 0;
    }

    if (entry.invertedBy != null && this.isButtonPressed(entry.invertedBy)) {
      value = -value;
    }

    return value * (entry.scale ?? 1);
  }

  private isButtonPressed(friendlyName: string): boolean {
    return (this.friendlyNameToCurrentValue.get(friendlyName) ?? 0) > ControllerState.BUTTON_PRESS_THRESHOLD;
  }

  // Detects a double-tap of the Y button and toggles between drivebase and arm
  // mode. Requires press-release-press within the double-tap window, so holding
  // Y down doesn't repeatedly toggle.
  private updateModeToggle() {
    const yPressed = this.isButtonPressed('yButton');

    const now = Date.now();

    if (yPressed && !this.yButtonHeld) {
      this.yButtonHeld = true;

      if (
        this.modeToggleArmed &&
        now - this.modeToggleLastPressTime <= ControllerState.MODE_TOGGLE_DOUBLE_TAP_WINDOW_MS
      ) {
        useControllerStore().toggleGamePadMode();
        this.modeToggleArmed = false;
      } else {
        this.modeToggleArmed = true;
        this.modeToggleLastPressTime = now;
      }
    } else if (!yPressed && this.yButtonHeld) {
      this.yButtonHeld = false;
    }

    if (this.modeToggleArmed && now - this.modeToggleLastPressTime > ControllerState.MODE_TOGGLE_DOUBLE_TAP_WINDOW_MS) {
      this.modeToggleArmed = false;
    }
  }

  // Print the current state of the controller as seen by the browser
  printNumbers() {}
}
