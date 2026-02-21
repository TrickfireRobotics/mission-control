<script setup lang="ts">
import { useCO2Store } from '@/store/CO2Store';
import { onActivated, onDeactivated, ref } from 'vue';
import Plotly from 'plotly.js-dist-min';

const CO2 = useCO2Store();

const chart = ref(null);
const running = ref(false);
const data: number[] = [];
const maxLength: number = 10;

let intervalID: number;

function start() {
  if (running.value) return;
  running.value = true;

  CO2.CO2Sub.start({
    callback: (message) => {
      data.push(message);

      const data_update = {
        y: [data],
      };

      Plotly.update(
        chart.value,
        data_update,
        {
          xaxis: {
            title: { text: 'seconds' },
            range: [Math.max(0, data.length - maxLength), Math.max(data.length, maxLength)],
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
}

function stop() {
  if (!running.value) return;
  running.value = false;

  CO2.CO2Sub.stop();

  clearInterval(intervalID);
}

onActivated(() => {
  Plotly.newPlot(
    chart.value,
    [
      {
        y: data,
        mode: 'lines',
        line: { color: '#30b630' },
      },
    ],
    {
      title: {
        text: 'CO_EMISSIONS',
        font: { color: 'white', weight: 'bold' },
      },
      paper_bgcolor: '#252527',
      plot_bgcolor: '#252527',
      font: { color: 'white' },
      xaxis: {
        title: { text: 'seconds' },
        dtick: 1,
        range: [0, maxLength],
      },
      yaxis: {
        title: { text: 'co_emissions' },
        range: [0, 10],
        gridcolor: 'rgba(255,255,255,0.25)',
        gridwidth: 1.5,
        zerolinecolor: 'rgba(255,255,255,0.9)', // bright white
        dtick: 1,
      },
    },
    { responsive: true },
  );

  start();
});

// Cleanup Auto unsubscribes when not loaded to save bandwidth
onDeactivated(stop);
</script>
<template>
  <div class="co_emissions">
    <div ref="chart" class="chart_container"></div>

    <div class="control_panel">
      <button class="start" @click="start" :disabled="running">Start</button>
      <button class="stop" @click="stop" :disabled="!running">Stop</button>
    </div>
  </div>
</template>

<!-- Should have lang="scss" and "scoped" to enable superpower of SCSS and make styles do not accidentally interact with other components styles-->
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
