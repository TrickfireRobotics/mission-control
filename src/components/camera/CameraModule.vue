<script setup lang="ts">
import { useSubscriber } from '@/lib/roslibUtils/createSubscriber';
import { onMounted, ref } from 'vue';
import type { CompressedImage } from '@/lib/roslibUtils/rosTypes';

export interface CameraModuleProps {
  cameraId: number;
  cameraName: string;
}
const props = defineProps<CameraModuleProps>();

const blackImage =
  'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';

const cameraSub = useSubscriber({
  topicName: `video_frames${props.cameraId}`,
  topicType: 'sensor_msgs/msg/CompressedImage',
});
const cameraSubURL = ref<string>(blackImage);

function cameraCallback(message: CompressedImage) {
  const blob = new Blob([message.data], { type: 'image/' + message.format });
  cameraSubURL.value = URL.createObjectURL(blob);
}

const onAndOffHandler = () => {
  if (cameraSub.isOn.value) {
    cameraSub.stop();
  } else {
    cameraSub.start({ callback: cameraCallback });
  }
};

onMounted(() => {
  cameraSub.start({ callback: cameraCallback });
});
</script>

<template>
  <div>
    <h3 class="camera-name">{{ props.cameraName }}</h3>
    <h3 class="camera-fps">FPS:</h3>
    <img :alt="cameraName" :src="cameraSubURL" />
    <button
      :class="{
        'button-toggle--off': !cameraSub.isOn.value,
        'button-toggle--on': cameraSub.isOn.value,
      }"
      @click="onAndOffHandler"
    >
      {{ cameraSub.isOn.value ? 'On' : 'Off' }}
    </button>
  </div>
</template>
<style lang="scss" scoped>
div {
  background-color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  height: 100%;
  box-sizing: border-box;

  .camera-name {
    position: absolute;
    left: 50%;
  }
  h3 {
    top: 0;
  }
  .camera-fps {
    position: absolute;
    right: 2rem;
  }
}
img {
  width: 100%;
  height: 90%;
}
</style>
