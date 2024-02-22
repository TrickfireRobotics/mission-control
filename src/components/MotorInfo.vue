<script setup lang="ts">
import { defineComponent } from 'vue';
import type { MotorData } from '.././types';

interface Props {
  motorData: MotorData;
}
const props = defineProps<Props>();
</script>
<template>
  <ul>
    <li>ID: {{ motorData.id }}</li>
    <li>Velocity: {{ motorData.velocity }}</li>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  display: flex;
  height: 100px;
  flex-direction: column;
  flex: 50%;
  // max-width: 50%;
  // border: 2px solid black;
  background-color: white;
}
</style>
