<script setup lang="ts">
const emit = defineEmits<{ (e: 'switchCameraFeedTo', id: number): void }>();
function clickHandler(id: number) {
  emit('switchCameraFeedTo', id);
}
</script>
<template>
  <div id="container">
    <ol>
      <li @click="clickHandler(1)">1</li>
      <li @click="clickHandler(2)">2</li>
      <li @click="clickHandler(3)">3</li>
      <li @click="clickHandler(4)">4</li>
    </ol>
    <div></div>
  </div>
</template>
<style lang="scss" scoped>
#container {
  margin-left: 0.5rem;
  grid-area: camera-feed-preview;
  ol {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    li {
      height: 150px;
      // aspect-ratio: 4 /3;
      background-color: white;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: orange;
      }
    }
  }
}
</style>
