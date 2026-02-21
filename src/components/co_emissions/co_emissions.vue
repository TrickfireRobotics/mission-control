<script setup lang="ts">
import { useExampleStore } from '@/store/exampleStore';
import { onActivated, onDeactivated } from 'vue';
import { plot } from 'plot';
import '@plotex/render-dom';

//if needed, define props like this. If not, delete this
// const props = defineProps({});
//const example = useExampleStore();

onActivated(() => {
  //example.helloWorldSub.start();
});
// Cleanup Auto unsubscribes when not loaded to save bandwidth
onDeactivated(() => {
  //example.helloWorldSub.stop();
});
</script>
<template>
  <div ref="chart"></div>
</template>

<!-- Should have lang="scss" and "scoped" to enable superpower of SCSS and make styles do not accidentally interact with other components styles-->
<style lang="scss" scoped></style>
