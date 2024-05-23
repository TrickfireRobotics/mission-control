<script setup lang="ts">
import type { CompressedImage } from '@/types';
import CameraFeed from './CameraFeed.vue';
import CameraFeedPreview from './CameraFeedPreview.vue';
import { ref, inject } from 'vue';

const currentFeed = ref(0);

const compressedImageArrayDefaultValue = Array(4).fill(
  'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==',
);
const compressedImageArray = compressedImageArrayDefaultValue as string[];
const compressedImageArray1 = inject('camera0') as string;
console.log(compressedImageArray);
const switchCameraFeedTo = (cameraId: number) => {
  currentFeed.value = cameraId;
};
</script>

<template>
  <div id="camera-container">
    <h2>Camera</h2>
    <div class="container">
      <CameraFeed :currentFeed="currentFeed" :compressedImageArray="compressedImageArray" />
      <CameraFeedPreview
        @switch-camera-feed-to="switchCameraFeedTo"
        :compressedImageArray="compressedImageArray"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
#camera-container {
  background-color: #dfdfdf;
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
