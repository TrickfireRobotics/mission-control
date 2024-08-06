# trickfire-robotics-mission-control

The mission control is a way to communicate bidirectionally (Send and receive information) from a laptop to the rover. Example, sending joystick inputs to the rover. It uses rosbridge_server which is part of the rosbridge_suit library which establishes a WebSocket connection between them.

![ROSbridge and ROS diagram](https://foxglove.dev/images/blog/using-rosbridge-with-ros2/hero.webp)

## Design choices
Because the coding paradigm that ROS uses is the publisher and subscriber model, we have to use the roslibjs library so javascript can use publisher and subscriber. 

## Library Documentation:
There is not a lot of documentation/tutorial on each library but here is a collection of resources
- Overview: [https://foxglove.dev/images/blog/using-rosbridge-with-ros2/hero.webp](https://foxglove.dev/images/blog/using-rosbridge-with-ros2/hero.webp)
- Roslibjs npm package: https://www.npmjs.com/package/roslib
- React Example using Roslibjs: https://github.com/RobotWebTools/roslibjs/blob/develop/examples/react-example/src/component_examples/example_functions.jsx

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup
Git clone this repository normally **(not in the URC Docker Container)**
1. Install npm packages
```sh
npm install
```

2. Compile and Hot-Reload for Development
```sh
npm run dev
```
3. open up the localhost window
4. In another VSCode window, open the urc repo in the docker environment
-Run these commands in the container terminal
```sh
./build.sh
./launch.sh
```
5. Reload mission control page
6. If the Websocket circle becomes **green**, you are connected!

### Create static html for deployment
```sh
npm run build
```
