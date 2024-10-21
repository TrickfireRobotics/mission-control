<script setup lang="ts">
import CameraFeed from './CameraFeed.vue';
import CameraFeedPreview from './CameraFeedPreview.vue';
import { ref } from 'vue';

const currentFeed = ref(1);

const switchCameraFeedTo = (cameraId: number) => {
  currentFeed.value = cameraId;
};
</script>

<template>
  <div id="camera-container">
    <h2>Camera</h2>
    <div class="container">
      <CameraFeed :current-feed="currentFeed" />
      <CameraFeedPreview @switch-camera-feed-to="switchCameraFeedTo" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
#camera-container {
  margin-right: 0.5rem;
  grid-area: camera;
  .container {
    padding: 0.5rem 0.25rem;
    display: grid;
    width: 100%;
    grid-template-areas: 'camera-feed camera-feed-preview';
    // grid-template-rows: 1fr;
    grid-template-columns: 2fr 1fr;
  }
}
</style>
