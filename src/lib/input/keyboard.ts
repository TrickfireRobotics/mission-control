import { createPublisher } from '../roslibUtils/createPublisher';
import { onKeyDown, onKeyPressed, onKeyUp } from '@vueuse/core';

import { keyboardBindings } from './input_bindings/keyboardBindings';
import type { KeyboardProfile } from './input_bindings/bindingTypes';

export class Keyboard {
  activeProfileIndex: number = 0;
  activeProfileObject: KeyboardProfile = {};
  active: boolean = true;

  constructor() {
    this.setProfile();
  }

  /**
   * Set the active binding profile for the keyboard.
   *
   * @param profileIndex - The zero-index (starting at 0) of the profile to be set. This is an
   *                       optional parameter and will set the active profile to the profile
   *                       at index 0 if not included.
   * @param profileObj - A KeyboardProfile object to set the active profile to. This is an optional
   *                     parameter and will take precedance over profileIndex if included.
   */
  setProfile(profileIndex?: number, profileObj?: KeyboardProfile) {
    if (profileObj == null) {
      // If the profileIndex is not provided or is invalid, default to the first profile
      this.activeProfileIndex = 0;
      if (
        profileIndex != undefined &&
        profileIndex >= 0 &&
        profileIndex < keyboardBindings.length
      ) {
        if (profileIndex >= 0 && profileIndex < keyboardBindings.length) {
          this.activeProfileIndex = profileIndex;
        } else {
          console.warn(
            `Index ${profileIndex} is out of bounds for keyboard bindings. Using default binding.`,
          );
        }
      }

      this.activeProfileObject = keyboardBindings[this.activeProfileIndex];
    } else {
      this.activeProfileObject = profileObj;
    }

    for (const [eventName, bind] of Object.entries(this.activeProfileObject)) {
      let activateFunction;
      let deactivateFunction;

      // Create acivate and deactivate functions that trigger with on and off input respectively.
      if (bind.publisher) {
        const publisher = createPublisher({
          topicName: bind.publisher,
          topicType: 'std_msgs/Float32',
        });

        activateFunction = () => {
          if (this.active) {
            publisher.publish({ data: 1 }, { isDebugging: bind.isDebugging || false });
          }
        };
        deactivateFunction = () => {
          if (this.active) {
            publisher.publish({ data: 0 }, { isDebugging: bind.isDebugging || false });
          }
        };
      } else if (bind.function) {
        activateFunction = () => {
          if (this.active) {
            bind.function(1);
          }
        };
        deactivateFunction = () => {
          if (this.active) {
            bind.function(0);
          }
        };
      } else {
        onKeyPressed(eventName, () => {
          console.warn(`${eventName} does not have a publisher or function specified`);
        });
        continue;
      }

      // Set up event listeners for the specified inputMode.
      if (bind.inputMode == null || bind.inputMode == 'Press') {
        onKeyDown(eventName, () => activateFunction(), { dedupe: true });
      } else if (bind.inputMode == 'PressRelease') {
        onKeyDown(eventName, () => activateFunction(), { dedupe: true });

        onKeyUp(eventName, () => deactivateFunction());
      } else {
        let intervalID: number | null = null;

        onKeyDown(eventName, () => {
          if (!intervalID) {
            intervalID = setInterval(() => activateFunction(), bind.delay || 1000);
            activateFunction();
          }
        });

        onKeyUp(eventName, () => {
          if (intervalID) {
            clearInterval(intervalID);
            deactivateFunction();
            intervalID = null;
          }
        });
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
