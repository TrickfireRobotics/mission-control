<!-- LEGACY CODE NOT USED ANYMORE -->
<script setup lang="ts">
import type { MotorData } from '../../types';

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
  background-color: #cccccc;
}
</style>
