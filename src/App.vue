<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import MotorGrid from './components/MotorGrid.vue';
import CameraContainer from './components/CameraContainer.vue';
import { provide, ref } from 'vue';
import rosInit from './roslib/rosInit';
import examplePub from './roslib/examplePub';
const webSocketStatus = ref(false);

// provide('ros', { webSocketStatus })
// Create ros object to communicate over your Rosbridge connection
const { ros, isWebSocketConnected } = rosInit('ws://localhost:9090');
console.log(ros);
provide('isWebSocketConnected', isWebSocketConnected);
provide('ros', ros);
examplePub(ros);
ros.getTopics((topic) => {
  console.log(topic);
});
</script>
<template>
  <div id="page">
    <Navbar />
    <CameraContainer />
    <MotorGrid />
  </div>
</template>

<style lang="scss">
*,
::before,
::after {
  margin: 0;
  padding: 0;
  list-style-type: none;
  box-sizing: border-box;
  // border-collapse: separate;
}
#page {
  display: grid;
  width: 100%;
  // height: 100vh;
  gap: 0.5rem;
  grid-template-areas:
    'nav nav nav'
    'camera camera motor-grid'
    'Something Something Something';
  // grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
