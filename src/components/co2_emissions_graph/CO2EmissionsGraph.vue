<script setup lang="ts">
import { useCO2Store } from '@/store/CO2Store';
import { onActivated, onDeactivated, ref } from 'vue';
import Plotly from 'plotly.js-dist-min';

const CO2 = useCO2Store();

const chart = ref(null);
const running = ref(false);

const data: number[] = [];
const maxWindowWidth: number = 10;

// Inititalize the graph and start the subscriber
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
        text: 'CO2_EMISSIONS',
        font: { color: 'white', weight: 'bold' },
      },
      paper_bgcolor: '#252527',
      plot_bgcolor: '#252527',
      font: { color: 'white' },
      xaxis: {
        title: { text: 'Seconds' },
        dtick: 1,
        range: [0, maxWindowWidth],
      },
      yaxis: {
        title: { text: 'CO2 Emissions' },
        range: [0, 10],
        gridcolor: 'rgba(255,255,255,0.25)',
        gridwidth: 1.5,
        zerolinecolor: 'rgba(255,255,255,0.9)',
        dtick: 1,
      },
    },
    { responsive: true },
  );

  start();
});

// Stop the subscriber
onDeactivated(stop);

/**
 * Starts the subscriber with a callback function to update the data
 * and the graph.
 */
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
}

/**
 * Stop the subscriber
 */
function stop() {
  if (!running.value) return;
  running.value = false;

  CO2.CO2Sub.stop();
}
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
