<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
import { useOccGraphStore } from '@/store/occGraphStore';
import { onActivated, onDeactivated, ref } from 'vue';
import ROSLIB from 'roslib';
import Plotly from 'plotly.js-dist-min';

const occGraph = useOccGraphStore();
const occGraphDiv = ref<HTMLElement | null>(null);
let subscriber: ROSLIB.Topic | null = null;

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

onActivated(() => {
  occGraph.occSub.start((msg) => {
    Plotly.react(
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
        margin: { l: 0, r: 0, t: 0, b: 0 },
        paper_bgcolor: '#252527',
        plot_bgcolor: '#252527',
        scene: {
          bgcolor: '#252527',
          xaxis: { color: 'white' },
          yaxis: { color: 'white' },
          zaxis: { color: 'white' },
        },
      },
    );
  });
});

onDeactivated(() => {
  occGraph.occSub.stop();
});
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
