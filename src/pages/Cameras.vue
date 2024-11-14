<!-- Camera: Shows all the cameras, can select which cameras to show -->
<script setup lang="ts">
import CameraModule from '@/components/camera/CameraModule.vue';
import createSubscriber from '@/lib/roslibUtils/createSubscriber';
import type { CompressedImage } from '@/lib/roslibUtils/rosTypes';
import { onMounted, type Ref, ref } from 'vue';

const blackImage =
  'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';

const cameraOne = createSubscriber({
  topicName: `video_frames0`,
  topicType: 'sensor_msgs/msg/CompressedImage',
});
const cameraOneURL = ref<string>(blackImage);

const cameraTwo = createSubscriber({
  topicName: `video_frames1`,
  topicType: 'sensor_msgs/msg/CompressedImage',
});
const cameraTwoURL = ref<string>(blackImage);

const createCalback = (cameraURL: Ref<string>) => (message: CompressedImage) => {
  const blob = new Blob([message.data], { type: 'image/' + message.format });
  cameraURL.value = URL.createObjectURL(blob);
};

onMounted(() => {
  cameraOne.start({ callback: createCalback(cameraOneURL) });
  cameraTwo.start({ callback: createCalback(cameraTwoURL) });
});
</script>

<template>
  <div class="two-by-three-grid-page">
    <CameraModule :camera-sub="cameraOne" :camera-url="cameraOneURL" camera-name="Front" />
    <CameraModule :camera-sub="cameraTwo" :camera-url="cameraTwoURL" camera-name="Back" />
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped></style>
