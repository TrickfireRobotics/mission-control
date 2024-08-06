<script lang="ts" setup>
import ROSLIB, { Ros } from 'roslib';
import { inject, onMounted, ref } from 'vue';
import NavbarTabs from './NavbarTabs.vue';
import HomeVariantOutlineIcon from 'vue-material-design-icons/HomeVariantOutline.vue';

//guarantee ros is defined
// use this instead want to handle case where ros is undefined
// const ros = inject<Ros>('ros')
const webSocketStatus = inject<boolean>('isWebSocketConnected', false);
const controllerConnectedStatus = inject<boolean>('isGamepadConnected', false);
//TODO FIX CODE
const latency = ref(-1);
</script>
<template>
  <nav>
    <img id="logo" src="../assets/trickfire_logo_transparent.png" alt="Trickfire logo" />
    <h1>Mission Control</h1>
    <li class="container navbar-tab current-page">
      <h4>Home</h4>
      <img src="../assets/home_icon.svg" alt="" />
    </li>
    <li class="container navbar-tab">
      <h4>Map</h4>
      <img src="../assets/map_icon.svg" alt="" />
    </li>
    <li class="container navbar-tab">
      <h4>Autonomous</h4>
      <img src="../assets/explore_icon.svg" alt="" />
    </li>
    <li class="container navbar-tab">
      <h4>Setting</h4>
      <img src="../assets/setting_icon.svg" alt="" />
    </li>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <!-- <NavbarTabs text="Testing" :icon="HomeVariantOutlineIcon" /> -->
    <div class="container">
      <h4 id="status">WebSocket</h4>
      <div class="circle" :class="{ green: webSocketStatus, red: !webSocketStatus }"></div>
    </div>
    <div class="container">
      <h4 id="status">Robot Interface</h4>
      <div class="circle" :class="{ green: webSocketStatus, red: !webSocketStatus }"></div>
    </div>
    <div class="container">
      <h4 id="status">Camera Feed</h4>
      <div class="circle" :class="{ green: webSocketStatus, red: !webSocketStatus }"></div>
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
  .current-page {
    background-color: var(--light-grey);
  }
  .navbar-tab {
    height: 100%;
    margin: 0;
    padding: 0 0.3rem;
  }
  #logo {
    max-width: 100%;
    max-height: 100%;
  }
  .navbar-tab img {
    height: 30px;
    width: 30px;
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
