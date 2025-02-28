<script setup lang="ts">
import { onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, GLTFModel, useGLTF } from '@tresjs/cientos';
import { Bone, Object3D, Vector3 } from 'three';
import { type MoteusMotorState, useTelemetry } from '@/lib/roslibUtils/telemetry';

const { scene } = await useGLTF('newarm.glb');

//TODO: - add remaining bones
//      - connect data to bones
const shoulder = scene.getObjectByName('Shoulder') as Bone;
const elbow = scene.getObjectByName('Elbow') as Bone;

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

//default rotations on the 3d model
const shoulderDefault = degreesToRadians(-72.88);
const elbowDefault = degreesToRadians(153.65);

const telemetry = useTelemetry();

function telemetryCallback(result: MoteusMotorState[]) {
  // Find the telemetry data for each motor using the canfdID.
  const shoulderMotor = result.find((motor) => motor.can_id === 1);
  const elbowMotor = result.find((motor) => motor.can_id === 2);

  // If we have a valid telemetry position, update the bone rotation.
  if (shoulderMotor?.position != null) {
    // Multiply the telemetry fraction by 2π to get the incoming additional radians.
    const additionalShoulderRotation = shoulderMotor.position * 2 * Math.PI;
    // The final rotation equals the default plus the telemetry offset.
    const shoulderRotation = shoulderDefault + additionalShoulderRotation;
    shoulder.rotation.x = shoulderRotation;
  }

  if (elbowMotor?.position != null) {
    const additionalElbowRotation = elbowMotor.position * 2 * Math.PI;
    const elbowRotation = elbowDefault + additionalElbowRotation;
    elbow.rotation.x = elbowRotation;
  }
}

onActivated(() => {
  telemetry.start(telemetryCallback);
});

onDeactivated(() => {
  telemetry.stop();
});
</script>
<template>
  <div id="arm">
    <TresCanvas shadows alpha>
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :intensity="3" :position="[1, 1, 1]" />
      <TresPerspectiveCamera :position="[1.2, 0, 0]" />
      <OrbitControls :enable-damping="false" :enable-pan="false" />
      <primitive :object="scene" />
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
