<script setup lang="ts">
// import type { CompressedImage } from '@/types';
import { ref, computed, inject } from 'vue';

interface Props {
  index: number;
  // compressedImageArray: string[];
}
const props = defineProps<Props>();

const testRef =
  'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==';
// const props = defineProps<Props>();
const compressedImageArray = inject('cameras') as string[];
// const compressedImages: any[] =
console.log(props.index);

// var imagedata = "data:image/jpg;base64," + message.data;

// const compressedImage: any =
const compressedImage3 = {};
//   'https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg';
// const compressedImage2 = computed(() => {
//   return 'data:image/jpg;base64,' + testRef.value;
// });
const cameraName = 'hello';
const isCameraOn = ref<boolean>(true);
</script>

<template>
  <div>
    <h3 id="camera-name">{{ cameraName }}</h3>
    <h3 id="FPS">FPS:</h3>
    <img :src="compressedImageArray[props.index]" />
    <button :class="{ green: isCameraOn, red: !isCameraOn }">hello</button>
    <!-- <img
      src="data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q=="
    /> -->
    <!-- <h1>Hello</h1> -->
  </div>
</template>
<style lang="scss" scoped>
// div {
//   background-color: white;
//   aspect-ratio: 4 / 3;
//   width: 100%;
//   // height: 100px;
//   grid-area: camera-feed;
// }
div {
  // min-height: 100px;
  // min-width: 33%;
  // height: 100%;
  // width: 100%;
  background-color: black;
  display: flex;
  justify-content: center;
  position: relative;
  height: 100%;
  box-sizing: border-box;
  // box-sizing: border-box;
  #camera-name {
    position: absolute;
  }
  #FPS {
    position: absolute;
    right: 2rem;
    // text-align: right;
  }
}
img {
  width: 100%;
  height: 100%;
}
</style>
