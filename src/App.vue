<script>
// <script setup lang="ts">
import Navbar from './components/Navbar.vue'
import MotorGrid from './components/MotorGrid.vue'
export default {
  components: {
    Navbar,
    MotorGrid
  }
}
</script>
<template>
  <Navbar />
  <MotorGrid />
</template>

<style lang="scss">
*,
::before,
::after {
  margin: 0;
  padding: 0;
}
</style>
