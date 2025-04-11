<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import { useRoslibStore } from '@/store/roslibStore';
import { onBeforeUnmount, onMounted } from 'vue';
import { gamepadInit } from '@/lib/controller/gamepad';
import { useFavicon } from '@vueuse/core';
import { computed } from 'vue';
const rosjs = useRoslibStore();

// All global subscribers & publishers that do not belong in a component put in here.
onMounted(() => {
  // Create a new connection if the current one is stopped.
  // This mostly exists for debug mode.
  if (rosjs.stop) {
    rosjs.$reset();
  }

  gamepadInit();
});

onBeforeUnmount(() => {
  // Stop the websocket when the app unloads.
  rosjs.stop = true;
});

// changes favicon based on if web socket is connected or not
const favicon = computed(() =>
  rosjs.isWebSocketConnected ? 'connected-favicon.ico' : 'favicon.ico',
);

useFavicon(favicon);
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
