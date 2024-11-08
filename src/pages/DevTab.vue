<!-- Experimental page to test modules -->
<script setup lang="ts">
import { useExampleStore } from '../store/useExample';
import { onActivated, onDeactivated } from 'vue';
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
    <h1>Example Data: {{ example.exampleData }}</h1>
    <button @click="example.examplePublish(example.exampleData + '!')">Add !</button>
    <button @click="example.unsubscribeExample">Unsub</button>
    <button @click="example.subscribeExample">sub</button>
    <button
      :class="{ 'button--off': !example.isSubOnExample, 'button--on': example.isSubOnExample }"
      @click="onAndOffHandler"
    >
      Example Subscriber Status:
      {{ example.isSubOnExample ? 'On' : 'Off' }}
    </button>
    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped></style>
