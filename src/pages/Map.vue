<script setup lang="ts">
import InteractiveMap from '@/components/map/InteractiveMap.vue';
</script>

<template>
  <div class="two-by-three-grid-page">
    <InteractiveMap />
  </div>
</template>

<style lang="scss" scoped>
#map {
    grid-column: 1 / span 2;
  grid-row: 1 / span 2;
}
</style>
