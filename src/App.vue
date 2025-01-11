<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import { useRoslibStore } from './store/useRoslib';
import { onBeforeUnmount, onMounted } from 'vue';
import gamepadInit from '@/lib/controller/gamepad';
const rosjs = useRoslibStore();
// All global subscribers & publishers that do not belong in a component put in here.
onMounted(() => {
  // TODO: use environment variables to launch the different ports
  // Create ros object to communicate over your Rosbridge connection
  // local host development
  rosjs.init('ws://localhost:9090');
  // Connects to the router
  // rosjs.init('ws://192.168.0.145:9090');

  // Connects to rover
  // rosjs.init('ws://10.0.0.10:9090');

  gamepadInit();
  rosjs.heartbeatPub(true, 1000);
});

onBeforeUnmount(() => {
  // Stop the websocket when the app unloads.
  rosjs.stop.value = true;
});
</script>

<template>
  <div id="app">
    <Navbar />
    <main id="main-content">
      <router-view v-slot="{ Component }">
        <KeepAlive>
          <component :is="Component"></component>
        </KeepAlive>
      </router-view>
    </main>
  </div>
</template>

<style lang="scss">
@forward './assets/global';
#app {
  display: flex;
  flex-direction: column;
}
#main {
  flex: 1;
}
</style>
