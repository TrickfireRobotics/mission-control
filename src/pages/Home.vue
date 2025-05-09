<!--
Show a couple of cameras, basic telemetry, auto/teleop button, reconnect canfd bus button, allow basic info about motors (like power consumption?), battery power level, LATER- shows box of the map
-->
<script setup lang="ts">
import ArmModeSelection from '@/components/arm/ArmModeSelection.vue';
import CameraModule from '@/components/camera/CameraModule.vue';
</script>
<script setup lang="ts">
  import RoverVelocityDisplay from '@/components/rover_velocity_display/RoverVelocityDisplay.vue';
</script>
<template>
  <div class="two-by-three-grid-page">
    <CameraModule :camera-id="0" camera-name="Front" />
    <CameraModule :camera-id="1" camera-name="Back" />
    <ArmModeSelection />
  </div>
</template>

<style lang="scss" scoped></style>
