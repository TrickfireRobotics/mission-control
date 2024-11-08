<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
// Any complex logic of state should be done in the store NOT here
import { useExampleStore } from '@/store/useExample';
const example = useExampleStore();
</script>
<template>
  <div>
    <p>{{ example.exampleData }}</p>
  </div>
</template>

<!-- Should have lang="scss" and "scoped" to enable superpower of SCSS and make styles do not accidentally interact with other components styles-->
<style lang="scss" scoped></style>
