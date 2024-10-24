<script lang="ts" setup>
import { ref, onMounted, render, h } from 'vue';
import TelemetryDataDisplay from '../telemetry/Test.vue';

const props = defineProps(['']);

onMounted(() => initialize());

const help = ref(null);

function initialize() {
  let testArray = [1, 2, 3, 4];
  createComponent();
}

function createComponent() {
  const vueComp = h(TelemetryDataDisplay);

  render();
}
</script>

<template>
  <div ref="help"></div>
</template>
