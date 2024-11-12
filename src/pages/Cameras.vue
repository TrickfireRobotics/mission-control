<!-- Camera: Shows all the cameras, can select which cameras to show -->
<script setup lang="ts">
import CameraModule from '@/components/camera/cameraModule.vue';
import createSubscriber from '@/lib/roslibUtils/createSubscriber';
import type { StdMsg } from '@/lib/roslibUtils/rosTypes';
import { computed, onMounted } from 'vue';

const cameraOne = createSubscriber({
  topicName: `video_frames1`,
  topicType: 'sensor_msgs/msg/CompressedImage',
  startingDefaultValue:
    'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==',
});
const blackImage =
  'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';

const cameraTwo = createSubscriber({
  topicName: `video_frames1`,
  topicType: 'sensor_msgs/msg/CompressedImage',
  startingDefaultValue:
    'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==',
});
const callbackOne = (message: StdMsg<string>) => {
  console.log(message);
  cameraOne.data.value = 'data:image/jpg;base64' + message.data;
};
const callbackTwo = (message: StdMsg<string>) => {
  console.log(message);
  cameraTwo.data.value = 'data:image/jpg;base64' + message.data;
};
onMounted(() => {
  cameraOne.start({ callback: callbackOne });
  cameraTwo.start({ callback: callbackTwo });
  console.log(cameraOne.data);
  console.log('HELLOS');
  // cameraTwo.start();
});
const dataToCamera = computed(() => {
  if (!cameraOne.data.value) {
    return blackImage;
  } else {
    return 'data:image/jpg;base64' + cameraOne.data.value;
  }
});
</script>

<template>
  <div class="two-by-three-grid-page">
    <CameraModule :camera-sub="cameraOne" camera-name="Front" />
    <CameraModule :camera-sub="cameraTwo" camera-name="Back" />
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped></style>
