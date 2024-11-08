# Mission Control

The mission control is the human interface to communicate bidirectionally (Sends and receives information) with the rover. For example, sending joystick inputs to the rover or displaying the rover's camera feed in realtime. This is done through a websocket.

![image](https://github.com/user-attachments/assets/a93314da-d956-468a-8d9c-59329f747919)

## Design choices

We are using Vue for its reactivity and lightweightness along side Pinia, a global state management to handle the growing amount of state shared among components. We use Typescript to make the code more readable and more maintainable. Because ROS uses the publisher and subscriber paradigm, we use Roslibjs library to easily interact with ROS in TypesScript, allowing us to use publishers, subscribers, and services. The websocket and the protocol is through Rosbridge Suite

### Structure of Code:

- **components**: single file component vue files that contain logic and UI and styling. If the state does not need to be global, put it in the component. Pubs and Subs related to a component should be ran into them
- **store**: Put all global states here
  - Use Services for 1-time actions like turn-on-off the camera
  - Use Sub/Pub when data is continuous like video feed
- **App.vue**: Pubs and Subs that don't have a component should be ran here
- **lib**: [Vue Composables](https://vuejs.org/guide/reusability/composables), and any large amount of .ts files goes here
- **types.ts** Put all global types in here

## Resources & Library Documentation:

If unfamiliar with Vue and Typescript here are some resources:

- [Official Vue Tutorial](https://vuejs.org/tutorial/#step-1)
- [Typescript Documentation](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html) -
- There is not a lot of documentation/tutorial on RosBridge and Roslib library but here is a collection of resources:
  [RosBridge Protocol](https://github.com/RobotWebTools/rosbridge_suite/blob/ros1/ROSBRIDGE_PROTOCOL.md)
- Overview: [https://foxglove.dev/images/blog/using-rosbridge-with-ros2/hero.webp](https://foxglove.dev/images/blog/using-rosbridge-with-ros2/hero.webp)
- [Roslibjs source code]: https://github.com/RobotWebTools/roslibjs

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)

- [Vue DevTools Chrome Extension](https://devtools.vuejs.org/getting-started/installation): Can Inspect Components State and integrated with Pinia, allowing to see store's state

## Project Setup

1. Install Node.js version 22.11.0 (LTS) (Long-term support Updated 11/6/2024)
   - **Windows and macOS**:
   1. If different node version is already installed, delete it from your system or if using version manager, switch to it.
      - **Windows**: https://stackoverflow.com/questions/20711240/how-to-completely-remove-node-js-from-windows (Tested 11/6/2024)
   2. [Download version 22.11.0 (LTS)](https://nodejs.org/en/download/prebuilt-installer) and run the installer
   - **Linux**: [Follow Instructions to install 22.11.0 (LTS)](https://nodejs.org/en/download/package-manager) (Not tested)
2. Run `git clone https://github.com/TrickfireRobotics/mission-control.git` in terminal **(not in the URC Docker Container)**
3. Run `cd mission-control` to open the repository
4. Run `npm install` to install dependencies

### Launching

1. Run `npm run dev`
2. While running open another VSCode window to the URC repo in the docker environment
   - Run `./build.sh` and `./launch.sh` commands in the container terminal
3. If the Websocket circle becomes **green**, you are connected!
