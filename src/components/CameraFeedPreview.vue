<script setup lang="ts">
import type { CompressedImage } from '@/types';
import { inject, ref } from 'vue';
import type { Ref } from 'vue';

interface Props {
  compressedImageArray: string[];
}

const emit = defineEmits<{ (e: 'switchCameraFeedTo', id: number): void }>();
function clickHandler(id: number) {
  emit('switchCameraFeedTo', id);
}
const compressedImageArray = inject('cameras') as string[];
</script>
<template>
  <div id="container">
    <ol>
      <!-- <li
        v-for="(compressedImage, index) in props.compressedImageArray"
        @click="clickHandler(index)"
      >
        <img :src="compressedImage" />
      </li> -->

      <li @click="clickHandler(0)">
        <img :src="compressedImageArray[0]" />
      </li>
      <li @click="clickHandler(1)">
        <img :src="compressedImageArray[1]" />
      </li>

      <!-- <li @click="clickHandler(1)">1</li>
      <li @click="clickHandler(2)">2</li>
      <li @click="clickHandler(3)">3</li> -->
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
    li,
    img {
      max-height: 150px;
      max-width: 500px;
      aspect-ratio: 4 /3;
      background-color: white;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: orange;
      }
    }
  }
  // ol {
  //   display: flex;
  //   flex-direction: column;
  //   gap: 0.5rem;
  //   li {
  //     // width: 100px;
  //     // aspect-ratio: 4 /3;
  //     background-color: white;
  //     text-align: center;
  //     cursor: pointer;
  //     &:hover {
  //       background-color: orange;
  //     }
  //     img {
  //       width: 100%;
  //       height: 100%;
  //       margin-bottom: 6rem;

  //       max-height: 800px;
  //       max-width: 400px;
  //     }
  //   }
  // }
}
</style>
