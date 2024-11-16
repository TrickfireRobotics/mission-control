<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
import { useExampleStore } from '@/store/useExample';
import { onActivated, onDeactivated } from 'vue';

//if needed, define props like this. If not, delete this
const props = defineProps({});
const example = useExampleStore();

onActivated(() => {
  example.helloWorldSub.start();
});
// Cleanup Auto unsubscribes when not loaded to save bandwidth
onDeactivated(() => {
  example.helloWorldSub.stop();
});
const onAndOffHandler = () => {
  if (example.helloWorldSub.isOn) {
    example.helloWorldSub.stop();
  } else {
    example.helloWorldSub.start();
  }
};
</script>
<template>
  <div>
    <h1>Example Data: {{ example.helloWorldSub.msg?.data }}</h1>
    <button @click="example.helloWorldPub.publish({ data: example.helloWorldSub.msg?.data + '!' })">
      Add !
    </button>
    <button @click="example.helloWorldSub.stop()">Unsub</button>
    <button @click="example.helloWorldSub.start()">sub</button>
    <button
      :class="{
        'button-toggle--off': !example.helloWorldSub.isOn,
        'button-toggle--on': example.helloWorldSub.isOn,
      }"
      @click="onAndOffHandler"
    >
      Example Subscriber Status:
      {{ example.helloWorldSub.isOn ? 'On' : 'Off' }}
    </button>
  </div>
</template>

<!-- Should have lang="scss" and "scoped" to enable superpower of SCSS and make styles do not accidentally interact with other components styles-->
<style lang="scss" scoped></style>
