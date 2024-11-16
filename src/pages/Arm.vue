<!-- 3D model of the arm, camera arms, Any information related to the arm should be here  -->
<script setup lang="ts">
import { shallowRef, watch } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, GLTFModel } from '@tresjs/cientos';
import ArmModeSelection from '../components/arm/ArmModeSelection.vue';
import type THREE from 'three';

const modelRef = shallowRef<THREE.Object3D>();

watch(modelRef, (model) => {
  if (!model) return;

  // Move model so base is in the center
  model.position.set(0, 100, -100);

  // Make sure model faces up
  model.rotation.set(90, 0, 0);
});
</script>
<template>
  <div class="page">
    <ArmModeSelection></ArmModeSelection>
    <div class="model-container">
      <TresCanvas shadows alpha>
        <TresAmbientLight :intensity="1" />
        <TresDirectionalLight :intensity="2" :position="[3, 3, 3]" />
        <TresPerspectiveCamera />
        <OrbitControls :enable-damping="false" :enable-pan="false" />
        <Suspense>
          <GLTFModel ref="modelRef" path="arm.glb" draco />
        </Suspense>
      </TresCanvas>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
}

.model-container {
  height: 600px;
}
</style>
<!-- 3D model of the arm, camera arms, Any information related to the arm should be here
<script setup lang="ts">
import ArmModeSelection from '../components/arm/ArmModeSelection.vue';
</script>
<template>
  <div class="two-by-three-grid-page">
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <ArmModeSelection></ArmModeSelection>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped></style> -->
