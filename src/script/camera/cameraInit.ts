// // import cameraSub from '@/roslib/cameraSub';
// import { cameraSub1 } from '@/roslib/cameraSub';
// import type { CompressedImage } from '@/types';
// import ROSLIB, { Ros } from 'roslib';
// import { ref } from 'vue';
// import type { Ref } from 'vue';
// //in order to have reactive behavior, store the ros data in a ref
// let compressedImages = ref<String[]>();
// //Since we are going to return exampleData anyway, use typeof
// export default function cameraInit(
//   ros: ROSLIB.Ros,
//   start: number,
//   end: number,
// ): typeof compressedImages {
//   for (let i = start; i <= end; i++) {
//     const cameraData = cameraSub1(ros, i);
//     console.log('cameraInit', cameraData);
//     cameraData;
//     if (!cameraData) {
//       continue;
//     }
//   }
//   return compressedImages;
// }
