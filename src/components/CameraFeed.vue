<script setup lang="ts">
interface Props {
  currentFeed: number
}
const props = defineProps<Props>()
</script>

<template>
  <div>
    <h2>{{ props.currentFeed }}</h2>
  </div>
</template>
<style lang="scss" scoped>
div {
  background-color: white;
  aspect-ratio: 4 / 3;
  width: 100%;
  grid-area: camera-feed;
}
</style>
