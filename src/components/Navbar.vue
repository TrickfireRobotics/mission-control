<script lang="ts" setup>
import ROSLIB, { Ros } from 'roslib';
import { inject, onMounted, ref } from 'vue';
import NavbarTabs from './NavbarTabs.vue';
// import HomeVariantOutlineIcon from 'vue-material-design-icons/HomeVariantOutline.vue';

//guarantee ros is defined
// use this instead want to handle case where ros is undefined
// const ros = inject<Ros>('ros')
const webSocketStatus = inject<boolean>('isWebSocketConnected', false);
const controllerConnectedStatus = inject<boolean>('isGamepadConnected', false);
console.log(typeof HomeVariantOutlineIcon);
//TODO FIX CODE
const latency = ref(-1);
</script>
<template>
  <nav>
    <img id="logo" src="../assets/trickfire_logo_transparent.png" alt="Trickfire logo" />
    <h1>Mission Control</h1>
    <NavbarTabs text="Testing" :icon="HomeVariantOutlineIcon" />
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
      <div
        class="circle"
        :class="{ green: controllerConnectedStatus, red: !controllerConnectedStatus }"
      ></div>
    </div>
    <!-- <div class="container">
      <h4>Ping</h4>
      <p>{{ `${latency}ms` }}</p>
    </div> -->
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
  background-color: var(--black);
  height: 4rem;
  h1,
  h2,
  h3,
  h4,
  p {
    color: var(--white);
  }
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
    background-color: var(--error);
  }
  .green {
    background-color: var(--correct);
  }
}
</style>
