# Getting Started

Welcome to the mission control subteam! We hope that you will stick around and learn quite a bit of things about frontend and networking! However, before you can do that, you should review the resources given in this document to familiarize yourself.

## What's the mission control?

The mission control is the human interface to communicate bidirectionally (Sends and receives information) with the rover. For example, sending joystick inputs to the rover or displaying the rover's camera feed in realtime.

## Difference between urc-2023 and mission-control GitHub Repository

The urc-2023 repo is the code that is ran on the rover itself. Due to the code being very hardware specifics, the docker container you run on your computer ensures standardization with the rover. Think of the rover as the "server"

The mission-control repo is completely separate from the urc-2023 as it is webpage-based, meaning the code is ran in the browser, and with modern browsers standardization of features, docker container is not needed. Think of the mission control as the "client"

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)

- [Vue DevTools Chrome Extension](https://devtools.vuejs.org/getting-started/installation): Can Inspect Components State and integrated with Pinia, allowing to see store's state

## Libraries/Tools/Technologies that We Utilize

In this particular codebase, we use the following libraries/tools/technologies. Please familiarize yourself with the concepts below:

- Vue [Official Tutorial](https://vuejs.org/tutorial/#step-1) (We specifically use Vue 3 Composition API Single File Component)
  - Prop drilling
  - Reactiveness (when to use refs vs not)
  - Lifecycle Hooks
    - Read about Keep Alive onActivate() and onDeactivated() hooks vs onMounted() and onUnmounted() hooks
- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html)
  - Difference between Primitives and object types and their respective naming convention
- [Pinia](https://pinia.vuejs.org/) (Global state management store)
  - How to create a store
  - How to use a store
- ROS2 (Robot Operating System)
  - high level understanding of:
    - Subscribers and Publisher paradigm
    - Topics, messageTypes
  - Please refer to the [urc-2023 documentation](https://github.com/TrickfireRobotics/urc-2023) for more information about Ros
- HTML/SCSS
- [Roslibjs Source Code](https://github.com/RobotWebTools/roslibjs)
- Node Package Manager (NPM)
  - Difference between dependency and Dev-dependency and when installing packages, which one to install too.

## So... what should I do now?

Please look at the [mission-control github issues](https://github.com/TrickfireRobotics/mission-control/issues) and look for **_Good First Issue_**. Some issues might only require only a fraction of the concepts above like UI related ones.

If you got here this far. I really appreciate you reading the documentation :)

-Adam Chhor, creator of the mission control repository
