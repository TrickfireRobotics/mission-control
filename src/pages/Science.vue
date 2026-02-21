<!-- Anything related to life detection, science stuff should be here -->
<script setup lang="ts">
import Co_emissions from '@/components/co_emissions/co_emissions.vue';
</script>
<template>
  <div class="two-by-three-grid-page">
    <Co_emissions />
  </div>
</template>

<style lang="scss" scoped>
.co_emissions {
  grid-column: 1 / span 2;
  grid-row: 1 / span 2;
}
</style>
