<!--
Show a couple of cameras, basic telemetry, auto/teleop button, reconnect canfd bus button, allow basic info about motors (like power consumption?), battery power level, LATER- shows box of the map
-->
<script setup lang="ts">
import MotorGrid from '../components/MotorGrid.vue';
import CameraContainer from '../components/CameraContainer.vue';
</script>
<template>
  <div id="page">
    <CameraContainer />
    <MotorGrid />
  </div>
</template>

<style lang="scss" scoped>
#page {
  display: grid;
  width: 100%;
  grid-template-areas:
    // 'nav nav nav'
    'camera camera motor-grid';
  // grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
}
</style>
