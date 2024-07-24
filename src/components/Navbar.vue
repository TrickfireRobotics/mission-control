<script lang="ts" setup>
import rosInit from '@/roslib/rosInit';
import ROSLIB, { Ros } from 'roslib';
import { vModelCheckbox } from 'vue';
import { shallowReactive } from 'vue';
import { inject, onMounted, ref } from 'vue';

//guarantee ros is defined
// use this instead want to handle case where ros is undefined
const ros = inject<Ros | undefined>('ros');
const webSocketStatus = inject<boolean>('isWebSocketConnected', false);
const controllerConnectedStatus = inject<boolean>("isGamepadConnected", false);

//TODO FIX CODE
const latency = ref(-1);
const isButtonDisabled = ref(false);

const reconnectMoteusControllers = () => {
  if (isButtonDisabled.value || !ros) return;

  isButtonDisabled.value = true;

  console.log("Reconnecting moteus controllers");

  const topic = new ROSLIB.Topic({
    ros: ros,
    name: '/reconnectMoteusControllers',
    messageType: 'std_msgs/String'
  });

  setTimeout(function() {
    isButtonDisabled.value = false;
  }, 5000)
}

</script>
<template>
  <nav>
    <img id="logo" src="../assets/trickfire_logo_transparent.png" alt="Trickfire logo" />
    <h1>Mission Control</h1>
    <div class="container">
      <h4 id="status">WebSocket</h4>
      <div class="circle" :class="{ green: webSocketStatus, red: !webSocketStatus }"></div>
    </div>
    <div class="container">
      <h4 id="status">Robot Interface</h4>
      <div class="circle red"></div>
    </div>
    <div class="container">
      <h4 id="status">Camera Feed</h4>
      <div class="circle red"></div>
    </div>
    <div class="container">
      <h4 id="status">Controller Connected</h4>
      <div class="circle" :class="{ green: controllerConnectedStatus, red: !controllerConnectedStatus }"></div>
    </div>
    <div class="container">
      <h4>Ping</h4>
      <p>{{ `${latency}ms` }}</p>
    </div>
    <div class="container">
        <button @click="reconnectMoteusControllers" :disabled="isButtonDisabled">Reconnect Moteus Controllers</button>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  padding: 0rem 1rem;
  grid-area: nav;
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  background-color: #dfdfdf;
  height: 4rem;
  #logo {
    max-width: 100%;
    max-height: 100%;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .circle {
    border-radius: 50%;
    background-color: inherit;
    // border-radius: 50%;
    height: 18px;
    width: 20px;
    border: 2px black solid;
    border-radius: 50%;
  }
  .red {
    background-color: red;
  }
  .green {
    background-color: lime;
  }
}
</style>