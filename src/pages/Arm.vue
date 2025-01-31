<!-- 3D model of the arm, camera arms, Any information related to the arm should be here  -->
<script setup lang="ts">
import { shallowRef } from 'vue';
import ArmModeSelection from '../components/arm/ArmModeSelection.vue';
import ArmModel from '../components/arm/ArmModel.vue';
import type { Object3D } from 'three';

const modelRef = shallowRef<Object3D>();
</script>
<template>
  <div class="two-by-three-grid-page">
    <ArmModeSelection />
    <Suspense>
      <ArmModel />
    </Suspense>

    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped></style>
