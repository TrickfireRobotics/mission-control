<!-- Camera: Shows all the cameras, can select which cameras to show -->
<script setup lang="ts">
import CameraModule from '@/components/camera/CameraModule.vue';
</script>

<template>
  <div class="two-by-three-grid-page">
    <CameraModule :camera-id="0" camera-name="Front" />
    <CameraModule :camera-id="1" camera-name="Back" />
  </div>
</template>

<style lang="scss" scoped></style>
