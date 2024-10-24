import type { CompressedImage } from '@/types';
import ROSLIB, { Ros } from 'roslib';
import { reactive } from 'vue';
import type { Ref } from 'vue';

const compressedImage = reactive(['', '']);
export default function cameraSub(
  ros: ROSLIB.Ros,
  startI: number,
  endI: number,
): typeof compressedImage {
  for (let i = startI; i <= endI; i++) {
    const cameraTopic = new ROSLIB.Topic({
      ros,
      //topic name
      name: `/video_frames${i}`,
      //https://docs.ros.org/en/melodic/api/sensor_msgs/html/msg/CompressedImage.html
      messageType: 'sensor_msgs/msg/CompressedImage',
      compression: 'cbor',
    });
    // console.log(cameraTopic);
    cameraTopic.subscribe<CompressedImage>((message) => {
      const base64 = btoa(
        Array(message.data.length)
          .fill('')
          .map((_, i) => String.fromCharCode(message.data[i]))
          .join(''),
      );
      compressedImage[i] = 'data:image/jpg;base64,' + base64;
    });
  }
  return compressedImage;
}

// import type { CompressedImage } from '@/types';
// import ROSLIB, { Ros } from 'roslib';
// import { ref } from 'vue';
// import type { Ref } from 'vue';
// //in order to have reactive behavior, store the ros data in a ref

// const defaultCompressedImageValue = { '1': 'testing', '2': 'testing' };
// // let compressedImage = ref<String>();
// let compressedImage = ref( '0': 'testing', '1': 'testing' });
// //Since we are going to return exampleData anyway, use typeof
// // export function cameraSub(
// //   ros: ROSLIB.Ros,
// //   startI: number = 0,
// //   endI: number = 1,
// // ): typeof compressedImage {
// //   for (let i = startI; i <= endI; i++) {
// //     let exampleTopic = new ROSLIB.Topic({
// //       ros,
// //       //topic name
// //       name: `/video_frames${i}`,
// //       //https://docs.ros.org/en/melodic/api/sensor_msgs/html/msg/CompressedImage.html
// //       messageType: 'sensor_msgs/msg/CompressedImage',
// //     });
// //     //subscribe to topic and sets ref data
// //     exampleTopic.subscribe<CompressedImage>((message) => {
// //       // console.log(index, message.data);
// //       // console.log(index, message);
// //       compressedImage.value[i] = 'data:image/jpg;base64,' + message.data;
// //       return 'data:image/jpg;base64,' + message.data;
// //     });
// //   }
// //   return compressedImage;
// // }
// export function cameraSub1(ros: ROSLIB.Ros, index: number): typeof compressedImage {
//   let exampleTopic2 = new ROSLIB.Topic({
//     ros,
//     //topic name
//     name: `/video_frames${index}`,
//     //https://docs.ros.org/en/melodic/api/sensor_msgs/html/msg/CompressedImage.html
//     messageType: 'sensor_msgs/msg/CompressedImage',
//   });
//   console.log(exampleTopic2);
//   //subscribe to topic and sets ref data
//   exampleTopic2.subscribe<CompressedImage>((message) => {
//     // console.log(index, message.data);
//     // console.log(index, message);
//     if (index === 0) {
//       //@ts-ignore
//       compressedImage.value['0'] = 'data:image/jpg;base64,' + message.data;
//       console.log('ADAM ', compressedImage.value['0']);
//     } else {
//       compressedImage.value['1'] = 'data:image/jpg;base64,' + message.data;
//       // console.log('ADAM ', compressedImage.value['1']);
//     }
//     // console.log(compressedImage.value['0']);
//     // compressedImage.value[index.toString()] = 'data:image/jpg;base64,' + message.data;
//     // return 'data:image/jpg;base64,' + message.data;
//   });
//   return compressedImage;
// }
