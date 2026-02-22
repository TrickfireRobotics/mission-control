<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
import { useOccGraphStore } from '@/store/occGraphStore';
import { onActivated, onDeactivated, ref } from 'vue';
import Plotly from 'plotly.js-dist-min';

const occGraph = useOccGraphStore();
const occGraphDiv = ref(null);

function decodePointCloud2(msg) {
  const dv = new DataView(msg.data.buffer);
  const xField = msg.fields.find((f) => f.name === 'x');
  const yField = msg.fields.find((f) => f.name === 'y');
  const zField = msg.fields.find((f) => f.name === 'z');

  const xs = [],
    ys = [],
    zs = [];

  for (let i = 0; i < msg.width; i++) {
    const base = i * msg.point_step;
    xs.push(dv.getFloat32(base + xField.offset, true));
    ys.push(dv.getFloat32(base + yField.offset, true));
    zs.push(dv.getFloat32(base + zField.offset, true));
  }

  return { xs, ys, zs };
}

function generateDemoPointCloud(numPoints = 5000) {
  const fields = [
    { name: 'x', offset: 0, datatype: 7, count: 1 },
    { name: 'y', offset: 4, datatype: 7, count: 1 },
    { name: 'z', offset: 8, datatype: 7, count: 1 },
  ];

  const point_step = 12; // 3 floats × 4 bytes
  const data = new Uint8Array(numPoints * point_step);
  const dv = new DataView(data.buffer);

  for (let i = 0; i < numPoints; i++) {
    const base = i * point_step;

    // Example: random sphere
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI;
    const r = 1.0;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    dv.setFloat32(base + 0, x, true);
    dv.setFloat32(base + 4, y, true);
    dv.setFloat32(base + 8, z, true);
  }

  return {
    header: { frame_id: 'demo' },
    height: 1,
    width: numPoints,
    fields,
    is_bigendian: false,
    point_step,
    row_step: numPoints * point_step,
    data,
    is_dense: true,
  };
}

onActivated(() => {
  const demoMsg = generateDemoPointCloud(5000);
  const { xs, ys, zs } = decodePointCloud2(demoMsg);

  Plotly.newPlot(
    occGraphDiv.value,
    [
      {
        x: xs,
        y: ys,
        z: zs,
        mode: 'markers',
        type: 'scatter3d',
        marker: { size: 2 },
      },
    ],
    {
      margin: { t: 0 },
    },
  );
});
// Cleanup Auto unsubscribes when not loaded to save bandwidth
onDeactivated(() => {});
const onAndOffHandler = () => {
  if (example.helloWorldSub.isOn) {
    example.helloWorldSub.stop();
  } else {
    example.helloWorldSub.start();
  }
};
</script>
<template>
  <div class="occGraphDiv" ref="occGraphDiv"></div>
</template>

<!-- Should have lang="scss" and "scoped" to enable superpower of SCSS and make styles do not accidentally interact with other components styles-->
<style lang="scss" scoped>
.occGraphDiv {
  padding: 0;
}
</style>
