<!-- Should have setup lang="ts" to enforce typescript-->
<!-- Any complex logic of state should be done in the store NOT here -->
<script setup lang="ts">
import { useExampleStore } from '@/store/useExample';
const example = useExampleStore();
</script>
<template>
  <div>
    <p>{{ example.data }}</p>
  </div>
</template>

<!-- Should have lang="scss" and "scoped" to make styles do not accidentally interact with other components styles-->
<style lang="scss" scoped></style>
