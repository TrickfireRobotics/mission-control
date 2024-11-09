<!-- Experimental page to test modules -->
<!-- Eventually will be a debugger like listing all of the topicName, topicTypes -->
<script setup lang="ts">
import { useExampleStore } from '../store/useExample';
import { onActivated, onDeactivated } from 'vue';
import ExampleComponent from '@/components/ExampleComponent.vue';
const example = useExampleStore();

onActivated(() => {
  example.subscribeExample({});
});

onDeactivated(() => {
  example.unsubscribeExample();
});
const onAndOffHandler = () => {
  if (example.isSubOnExample) {
    example.unsubscribeExample();
  } else {
    example.subscribeExample({});
  }
};
</script>
<template>
  <div class="two-by-three-grid-page">
    <ExampleComponent />
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped></style>
