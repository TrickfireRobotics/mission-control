<script setup lang="ts">
import { shallowRef, watch } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, GLTFModel } from '@tresjs/cientos';
import type { Object3D } from 'three';

const modelRef = shallowRef<Object3D>();

watch(modelRef, (model) => {
  if (!model) return;
  console.log('Model is rendered');
});
</script>
<template>
  <div id="arm">
    <TresCanvas shadows alpha>
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :intensity="2" :position="[1, 1, 1]" />
      <TresPerspectiveCamera :position="[1, 1, 1]" />
      <OrbitControls :enable-damping="false" :enable-pan="false" />
      <Suspense>
        <GLTFModel ref="modelRef" path="newarm.glb" draco :rotation="[0, 0, 0]" />
      </Suspense>
    </TresCanvas>
  </div>
</template>
<style lang="scss" scoped>
#arm {
  height: 100%;
  width: 100%;
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
}
</style>
