<!--
Show a couple of cameras, basic telemetry, auto/teleop button, reconnect canfd bus button, allow basic info about motors (like power consumption?), battery power level, LATER- shows box of the map
-->

<script setup lang="ts">
import { inject } from 'vue';
import genericPub from '../roslib_custom/pub/genericPub';
import ROSLIB from 'roslib';

const test2 = inject<string>('test2');
const ros = inject<ROSLIB.Ros>('ros') as ROSLIB.Ros;

let str = 'test';
const bob = () => {
  str += '1';
  genericPub(ros, '/exampleData', 'std_msgs/String', str);
};
</script>
<template>
  <div class="two-by-three-grid-page">
    <p>yo:{{ test2 }}</p>
    <button @click="bob">YOOO</button>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped></style>
