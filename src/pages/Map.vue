<script setup lang="ts">
import InteractiveMap from '@/components/map/InteractiveMap.vue';
import CompassComponent from '@/components/compass/CompassComponent.vue';
</script>

<template>
  <div class="two-by-three-grid-page">
    <InteractiveMap />
    <CompassComponent />
    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped>
#map {
  height: 100%;
  width: 100%;
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
}
</style>
