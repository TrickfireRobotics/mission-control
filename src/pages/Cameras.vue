<!-- Camera: Shows all the cameras, can select which cameras to show -->
<script setup lang="ts">
import CameraModule from '@/components/camera/CameraModule.vue';
import OccupancyGraph from '@/components/occupancy_graph/OccupancyGraph.vue';
</script>

<template>
  <div class="two-by-three-grid-page">
    <CameraModule :camera-id="0" camera-name="Front" />
    <OccupancyGraph />
    <CameraModule :camera-id="1" camera-name="Back" />
  </div>
</template>

<style lang="scss" scoped>
.occGraphDiv {
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
}
</style>
