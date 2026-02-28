<!--
Show a couple of cameras, basic telemetry, auto/teleop button, reconnect canfd bus button, allow basic info about motors (like power consumption?), battery power level, LATER- shows box of the map
-->
<script setup lang="ts">
import RoverVelocityDisplay from '@/components/rover_velocity_display/RoverVelocityDisplay.vue';
import ArmModel from '@/components/arm/ArmModel.vue';
import ArmModeSelection from '@/components/arm/ArmModeSelection.vue';
import InteractiveMap from '@/components/map/InteractiveMap.vue';
import CameraModule from '@/components/camera/CameraModule.vue';
</script>
<template>
  <div class="two-by-three-grid-page">
    <CameraModule />
    <CameraModule />
    <Suspense>
      <ArmModel />
    </Suspense>
    <InteractiveMap />
    <ArmModeSelection />
  </div>
</template>

<style lang="scss" scoped></style>
