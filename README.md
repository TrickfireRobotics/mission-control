# Mission Control

The mission control is the human interface to communicate bidirectionally (sends and receives information) with the rover. For example, sending joystick inputs to the rover or displaying the rover's camera feed in realtime. This is done through a websocket server that is ran on the rover.

![image](https://github.com/user-attachments/assets/a93314da-d956-468a-8d9c-59329f747919)

### `Getting Started`

For an introduction on mission control, please refer to the [Getting Started Guide](./docs/getting_started.md).

For a code-level overview, check out the [Code Overview](./docs/code_overview.md).

### Installation

To develop code for the mission control, please follow the setup below:

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
3. If the Websocket icon becomes **green**, you are connected!
