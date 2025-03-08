<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, useGLTF } from '@tresjs/cientos';
import { Bone } from 'three';
import { CanBusID, useTelemetryData } from '@/lib/roslibUtils/telemetry';

const { scene } = await useGLTF('newarm.glb');

const wrist = scene.getObjectByName('Wrist') as Bone;
const shoulder = scene.getObjectByName('Shoulder') as Bone;
const elbow = scene.getObjectByName('Elbow') as Bone;
const turntable = scene.getObjectByName('Turntable') as Bone;

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

//default rotations on the 3d model
const wristDefault = degreesToRadians(12.69);
const shoulderDefault = degreesToRadians(-72.88);
const elbowDefault = degreesToRadians(153.65);
const turntableDefault = degreesToRadians(-37.76);

useTelemetryData(
  [CanBusID.ArmShoulder, CanBusID.ArmElbow, CanBusID.ArmTurntable],
  (data) => data.position,
  null,
  {
    armShoulder: (position) => {
      // Multiply the telemetry fraction by 2π to get the incoming additional radians.
      const additionalShoulderRotation = position * -2 * Math.PI;
      // The final rotation equals the default plus the telemetry offset.
      const shoulderRotation = shoulderDefault + additionalShoulderRotation;
      shoulder.rotation.x = shoulderRotation;
    },
    armElbow: (position) => {
      const additionalElbowRotation = position * 2 * Math.PI;
      const elbowRotation = elbowDefault + additionalElbowRotation;
      elbow.rotation.x = elbowRotation;
    },
    armTurntable: (position) => {
      const additionalTurntableRotation = position * 2 * Math.PI;
      const turntableRotation = turntableDefault + additionalTurntableRotation;
      turntable.rotation.x = turntableRotation;
    },
  },
);
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
