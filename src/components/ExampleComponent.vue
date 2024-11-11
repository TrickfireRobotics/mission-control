<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
import { ref } from 'vue';
import { useExampleStore } from '@/store/useExample';
import { onActivated, onDeactivated } from 'vue';

//if needed, define props like this. If not, delete this
const props = defineProps({});
const example = useExampleStore();

onActivated(() => {
  example.subscribeExample({});
});
// Cleanup Auto unsubscribes when not loaded to save pan width
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
  <div>
    <h1>Example Data: {{ example.exampleData }}</h1>
    <button @click="example.examplePublish(example.exampleData + '!')">Add !</button>
    <button @click="example.unsubscribeExample">Unsub</button>
    <button @click="example.subscribeExample">sub</button>
    <button
      :class="{
        'button-toggle--off': !example.isSubOnExample,
        'button-toggle--on': example.isSubOnExample,
      }"
      @click="onAndOffHandler"
    >
      Example Subscriber Status:
      {{ example.isSubOnExample ? 'On' : 'Off' }}
    </button>
  </div>
</template>

<!-- Should have lang="scss" and "scoped" to enable superpower of SCSS and make styles do not accidentally interact with other components styles-->
<style lang="scss" scoped></style>
