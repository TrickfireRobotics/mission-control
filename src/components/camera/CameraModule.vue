<script setup lang="ts">
import type { Subscriber } from '@/lib/roslibUtils/createSubscriber';

export interface CameraModuleProps {
  cameraSub: Subscriber<'sensor_msgs/msg/CompressedImage', true>;
  cameraName: string;
  cameraUrl: string;
}
const props = defineProps<CameraModuleProps>();

const onAndOffHandler = () => {
  if (props.cameraSub.isOn.value) {
    props.cameraSub.stop();
  } else {
    props.cameraSub.start();
  }
};
</script>

<template>
  <div>
    <h3 class="camera-name">{{ props.cameraName }}</h3>
    <h3 class="camera-fps">FPS:</h3>
    <img :alt="cameraName" :src="props.cameraUrl" />
    <button
      :class="{
        'button-toggle--off': !props.cameraSub.isOn.value,
        'button-toggle--on': props.cameraSub.isOn.value,
      }"
      @click="onAndOffHandler"
    >
      {{ props.cameraSub.isOn.value ? 'On' : 'Off' }}
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
