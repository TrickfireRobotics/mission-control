import { createPublisher } from '../roslibUtils/createPublisher';
import { onKeyDown, onKeyUp } from '@vueuse/core';

import KeyboardBindings from './input_bindings/keyboardBindings';
import type { KeyboardBind } from './input_bindings/bindingTypes';

export default class Keyboard {
  activeProfileIndex: number = 0;
  activeProfileObject: { [inputName: string]: KeyboardBind } = {};

  constructor() {
    this.setKeyboardProfile(0);
  }

  setKeyboardProfile(profileIndex?: number) {
    // If the profileIndex is not provided or is invalid, default to the first profile
    this.activeProfileIndex = 0;
    if (profileIndex != undefined && profileIndex >= 0 && profileIndex < KeyboardBindings.length) {
      if (profileIndex >= 0 && profileIndex < KeyboardBindings.length) {
        this.activeProfileIndex = profileIndex;
      } else {
        console.warn(
          `Index ${profileIndex} is out of bounds for keyboard bindings. Using default binding.`,
        );
      }
    }
    this.activeProfileObject = KeyboardBindings[this.activeProfileIndex];

    for (const [eventName, action] of Object.entries(this.activeProfileObject)) {
      switch (typeof action) {
        // If a publisher name is supplied
        case 'string': {
          if (action === '') break;

          const publisher = createPublisher({
            topicName: action,
            topicType: 'std_msgs/Float32',
          });

          onKeyDown(eventName, () => {
            publisher.publish({ data: 1 }, { isDebugging: true });
          });
          onKeyUp(eventName, () => {
            publisher.publish({ data: 0 }, { isDebugging: true });
          });
          break;
        }
        // If a function is supplied
        case 'function': {
          onKeyDown(eventName, () => action());
          break;
        }
        // If arguments are supplied with a function or publisher
        case 'object': {
          onKeyDown(eventName, () => action.function(...(action.args || [])));
          break;
        }
        default: {
          console.log(`Error: Invalid action "${action}" supplied for event "${eventName}"`);
        }
      }
    }
  }
}
