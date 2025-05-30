<!-- 3D model of the arm, camera arms, Any information related to the arm should be here  -->
<script setup lang="ts">
import ArmModeSelection from '../components/arm/ArmModeSelection.vue';
import ArmModel from '../components/arm/ArmModel.vue';
</script>
<template>
  <div class="two-by-three-grid-page">
    <ArmModeSelection />
    <Suspense>
      <ArmModel />
    </Suspense>
  </div>
</template>

<style lang="scss" scoped>
#arm {
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
}
</style>
