<script setup lang="ts">
import type { CompressedImage } from '@/types';

import { ref, computed, inject } from 'vue';

interface Props {
  currentFeed: number;
  compressedImageArray: string[];
}
// const testRef = ref(

// );
const testRef = ref(
  'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==',
);
const props = defineProps<Props>();
const compressedImageArray = inject('cameras') as string[];
// const compressedImages: any[] =

// var imagedata = "data:image/jpg;base64," + message.data;

// const compressedImage: any =
const compressedImage3 = {};
//   'https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg';
const compressedImage2 = computed(() => {
  return 'data:image/jpg;base64,' + testRef.value;
});
</script>

<template>
  <div>
    <img :src="compressedImageArray[props.currentFeed]" />
  </div>
</template>
<style lang="scss" scoped>
div {
  background-color: white;
  aspect-ratio: 4 / 3;
  width: 100%;
  // height: 100px;
  grid-area: camera-feed;
}
// img {
//   min-height: 100px;
//   min-width: 100px;
//   max-height: 800px;
//   max-width: 400px;
// }
</style>
