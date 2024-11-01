<!-- Experimental page to test modules -->
<script setup lang="ts">
import { useExampleStore } from '../store/useExample';

const example = useExampleStore();
</script>
<template>
  <div class="two-by-three-grid-page">
    <p>Example Data ={{ example.data }}</p>
    <button @click="example.publishExampleData">Add !</button>
    <button @click="example.unsubscribe">Unsubscribe</button>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped></style>
