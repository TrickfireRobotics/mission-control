<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import { provide } from 'vue';
import rosInit from './roslib_custom/rosInit';
import heartbeatPub from './roslib_custom/pub/heartbeatPub';
import genericPub from './roslib_custom/pub/genericPub';
import exampleSub from './roslib_custom/sub/exampleSub';
import genericSub from './roslib_custom/sub/genericSub';
import getControllerStatus from './script/controller/controllerEvents';
import cameraSub from './roslib_custom/sub/cameraSub';
import { ref } from 'vue';

// Starts Controller
//import startControllerCode from './script/controller/controllerEvents';

// Create ros object to communicate over your Rosbridge connection
// local host development
const { ros, isWebSocketConnected } = rosInit('ws://localhost:9090');

// Connects to the router
//const { ros, isWebSocketConnected } = rosInit('ws://192.168.0.145:9090');

// Connects to rover
// const { ros, isWebSocketConnected } = rosInit('ws://10.0.0.10:9090');

const isGamepadConnected = getControllerStatus(ros);
const cameras = cameraSub(ros, 0, 1);
provide('isWebSocketConnected', isWebSocketConnected);
provide('ros', ros);
provide('isGamepadConnected', isGamepadConnected);
provide('cameras', cameras);

// ros: ROSLIB.Ros,
// input: T,
// topicName: string,
// messageType: messageType,

genericPub(ros, '/exampleData', 'std_msgs/String', 'test');
const test = ref<string>();
genericSub<string>(ros, '/exampleData', 'std_msgs/String', test);
const test2 = exampleSub(ros);
console.log(test);
console.log('Hello');
console.log(test2);
provide('test2', test2);

// heartbeatPub(ros, true, 1000); // 1s
</script>

<template>
  <div id="app">
    <Navbar />
    <div id="main-content">
      <router-view v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component"></component>
        </KeepAlive>
      </router-view>
    </div>
  </div>
</template>

<style lang="scss">
@import './assets/global';
#app {
  display: flex;
  flex-direction: column;
}
#main-content {
  flex: 1;
  // overflow-y: auto;
}
</style>
