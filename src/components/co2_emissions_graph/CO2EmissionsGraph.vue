<script setup lang="ts">
import { useCO2Store } from '@/store/CO2Store';
import { onActivated, onDeactivated, ref } from 'vue';
import Plotly from 'plotly.js-dist-min';

const CO2 = useCO2Store();

const chart = ref(null);
const running = ref(false);

const data: number[] = [];
const times: Float32Array = [];
const maxWindowWidth: number = 10;

// Inititalize the graph and start the subscriber
onActivated(() => {
  if (running.value) return;
  running.value = true;

  CO2.CO2Sub.start({
    callback: (message) => {
      data.push(message);
      times.push(new Date());

      const data_update = {
        y: [data],
        x: [times],
      };

      Plotly.react(
        chart.value,
        data_update,
        {
          xaxis: {
            title: { text: 'seconds' },
            range: [
              Math.max(0, data.length - maxWindowWidth),
              Math.max(data.length, maxWindowWidth),
            ],
            dtick: 1,
          },
        },
        {
          responsive: true,
        },
      );

      Plotly.Fx.hover(chart.value, [
        {
          curveNumber: 0,
          pointNumber: data.length - 1,
        },
      ]);
    },
  });
});

// Stop the subscriber
onDeactivated(() => {
  if (!running.value) return;
  running.value = false;

  CO2.CO2Sub.stop();
});
</script>
<template>
  <div class="co_emissions">
    <div ref="chart" class="chart_container"></div>

    <div class="control_panel">
      <button class="start" :disabled="running" @click="start">Start</button>
      <button class="stop" :disabled="!running" @click="stop">Stop</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.co_emissions {
  position: relative;
}
.chart_container {
  width: 100%;
  height: 100%;
}
.control_panel {
  position: absolute;
  top: 1rem;

  border-radius: 6px;
  display: flex;
  gap: 8px;

  button {
    background: #1e90ff;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }

    &.start {
      background-color: var(--correct);
    }

    &.stop {
      background-color: var(--error);
    }
  }
}
</style>
