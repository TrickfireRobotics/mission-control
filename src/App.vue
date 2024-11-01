<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Gamepad from './components/controller/Gamepad.vue';
import { useRoslibStore } from './store/useRoslib';
import { onMounted } from 'vue';
const rosjs = useRoslibStore();
// Put all subs & pubs that have to be run at the start here
onMounted(() => {
  // TODO: use environment variables to launch the different ports
  // Create ros object to communicate over your Rosbridge connection
  // local host development
  rosjs.init('ws://localhost:9090');
  // gamepadInit();

  // Connects to the router
  // rosjs.init('ws://192.168.0.145:9090');

  // Connects to rover
  // rosjs.init('ws://10.0.0.10:9090');
  rosjs.heartbeatPub(true, 1000);
});
</script>

<template>
  <div id="app">
    <!-- All event listeners that use the DOM like gamepad, keyboard inputs should be a Logical component to use lifecycle methods -->
    <Gamepad />
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
@forward './assets/global';
#app {
  display: flex;
  flex-direction: column;
}
#main-content {
  flex: 1;
  // overflow-y: auto;
}
</style>
