<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import MotorGrid from './components/MotorGrid.vue'
import CameraContainer from './components/CameraContainer.vue'
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
  grid-template-areas:
    'nav nav nav'
    'camera camera motor-grid'
    'Something Something Something';
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
