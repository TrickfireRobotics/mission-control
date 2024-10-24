# Mission Control

The mission control is the human interface to communicate bidirectionally (Sends and receives information) with the rover. For example, sending joystick inputs to the rover or displaying the rover's camera feed in realtime. This is done through a websocket.

![image](https://github.com/user-attachments/assets/a93314da-d956-468a-8d9c-59329f747919)

## Design choices

We are using Vue for its reactivity and lightweightness. We use Typescript to make the code more readable and more maintainable. Because ROS uses the publisher and subscriber paradigm, we use Roslibjs library to easily interact with the ROS in JavaScript, allowing us to use publisher and subscriber. We only use patch-package npm package because the ROSLIB@Type package has an error.

### Structure of Code:

- **components**: single file component vue files that contain logic and UI and styling
- **roslib**: Put all roslib logic in here
  - Use Services for 1-time actions like turn-on-off the camera
  - Use Sub/Pub when data is continuous like video feed
- **App.vue**: Put all global state Ros data in here
- **Scripts**: Any large amount of Typescript goes here
- **types.ts** Put all global types in here

## Resources & Library Documentation:

If unfamiliar with Vue and Typescript here are some resources:

- [Vue Tutorial](https://vuejs.org/tutorial/#step-1)
- [Typescript Documentation](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)
  <br/> There is not a lot of documentation/tutorial on RosBridge and Roslib library but here is a collection of resources
- Overview: [https://foxglove.dev/images/blog/using-rosbridge-with-ros2/hero.webp](https://foxglove.dev/images/blog/using-rosbridge-with-ros2/hero.webp)
- Roslibjs npm package: https://www.npmjs.com/package/roslib
- React Example using Roslibjs: https://github.com/RobotWebTools/roslibjs/blob/develop/examples/react-example/src/component_examples/example_functions.jsx

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Project Setup

1. Install Latest Node.js version (Currently working with v18.18.1)
   - **Windows and macOS**: Download the latest version and run the installer
   - **Linux**: Run `sudo apt install nodejs` (Not tested yet)
2. Run `git clone https://github.com/TrickfireRobotics/mission-control.git` in terminal **(not in the URC Docker Container)**
3. Run `cd mission-control` to open the repository
4. Run `npm install` to install dependencies

### Launching

1. Run `npm run dev`
2. Open `http://localhost:5173/` in web browser (Chrome)
3. While running open another VSCode window to URC repo in the docker environment
   - Run `./build.sh` and `./launch.sh` commands in the container terminal
4. Reload the mission control page
5. If the Websocket circle becomes **green**, you are connected!
