<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
import { useOccGraphStore } from '@/store/occGraphStore';
import { onActivated, onDeactivated, ref } from 'vue';
import Plotly from 'plotly.js-dist-min';

const occGraph = useOccGraphStore();
const occGraphDiv = ref<HTMLElement | null>(null);
function decodePointCloud2(msg) {
  const dv = new DataView(msg.data.buffer);
  const xField = msg.fields.find((f) => f.name === 'x');
  const yField = msg.fields.find((f) => f.name === 'y');
  const zField = msg.fields.find((f) => f.name === 'z');

  const total = msg.width * msg.height;

  const xs = [];
  const ys = [];
  const zs = [];

  for (let i = 0; i < total; i++) {
    const base = i * msg.point_step;

    const x = dv.getFloat32(base + xField.offset, true);
    const y = dv.getFloat32(base + yField.offset, true);
    const z = dv.getFloat32(base + zField.offset, true);

    // Filter invalid points
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
      continue;
    }

    // Filter near-camera noise (VERY important for stereo cameras)
    if (z < 0.1) {
      continue;
    }

    xs.push(x);
    ys.push(y);
    zs.push(z);
  }

  return { xs, ys, zs };
}

onActivated(() => {
  console.log('ACTIVATED');

  Plotly.newPlot(
    occGraphDiv.value,
    [
      {
        x: [],
        y: [],
        z: [],
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
  occGraph.occSub.start({
    callback: (msg) => {
      const div = occGraphDiv.value;
      if (!div) return;

      console.log('SIZE:', div.clientWidth, div.clientHeight);
      console.log('DIV:', occGraphDiv.value);

      const camera = div._fullLayout?.scene?.camera;

      const { xs, ys, zs } = decodePointCloud2(msg);

      Plotly.update(
        div,
        {
          x: [xs],
          y: [ys],
          z: [zs],
        },
        [0],
      );
    },
  });
});

onDeactivated(() => {
  console.log('DEACTIVATED');
  occGraph.occSub.stop();
});
</script>
<template>
  <div ref="occGraphDiv" class="occGraphDiv"></div>
</template>

<!-- Should have lang="scss" and "scoped" to enable superpower of SCSS and make styles do not accidentally interact with other components styles-->
<style lang="scss" scoped>
.occGraphDiv {
  padding: 0;
}
</style>
