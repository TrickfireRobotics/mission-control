<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import MotorGrid from './components/MotorGrid.vue';
import CameraContainer from './components/CameraContainer.vue';
import { provide, reactive, ref } from 'vue';
import rosInit from './roslib/rosInit';
import examplePub from './roslib/examplePub';
import exampleSub from './roslib/exampleSub';
import heartbeatPub from './roslib/heartbeatPub';
import getControllerStatus from './script/controller/controllerEvents';
import cameraSub from './roslib/cameraSub';
import type { Ref } from 'vue';

//import startControllerCode from './script/controller/controllerEvents';
const webSocketStatus = ref(false);
const test = ref<number>(10001);

// Create ros object to communicate over your Rosbridge connection
// local host development
 const { ros, isWebSocketConnected } = rosInit('ws://localhost:9090');

// Connects to the router
//const { ros, isWebSocketConnected } = rosInit('ws://192.168.0.145:9090');

// Connects to rover
// const { ros, isWebSocketConnected } = rosInit('ws://10.0.0.10:9090');

const isGamepadConnected = getControllerStatus(ros);
const cameras = cameraSub(ros, 0, 1);
console.log(ros);
provide('isWebSocketConnected', isWebSocketConnected);
provide('ros', ros);
provide('isGamepadConnected', isGamepadConnected);
provide('cameras', cameras);
examplePub(ros, test.value);

heartbeatPub(ros, true, 1000); // 1s

const exampleData = exampleSub(ros);
</script>

<template>
  <Navbar />
  <router-view v-slot="{ Component }">
    <KeepAlive>
      <component :is="Component"></component>
    </KeepAlive>
  </router-view>
</template>

<style lang="scss">
@import './assets/global';
</style>
