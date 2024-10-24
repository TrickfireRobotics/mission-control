<!-- Experimental page to test modules -->
<script setup lang="ts">
import CameraModule from '../components/CameraModule.vue';
</script>
<template>
  <div id="page4">
    <CameraModule v-for="(e, index) in 6" key="index" :index="index"></CameraModule>
  </div>
</template>

<style lang="scss">
#page4 {
  // display: grid;
  // width: 100vw;
  // height: calc(100vh - var(--nav-bar-size));
  // // grid-template-rows: 1fr 1fr;
  // // grid-template-columns: 1fr 1fr 1fr;
  // grid-template-columns: repeat(3, minmax(0, 1fr));

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  padding: 2px;
  width: 100%;
  // height: 100%;
  height: calc(100vh - var(--nav-bar-size));
  box-sizing: border-box;

  // display: grid;
  // grid-template-columns: repeat(3, 1fr);
  // gap: 5px;
}
.wrapper {
  display: inline-block;
}
</style>
