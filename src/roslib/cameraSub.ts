import type { CompressedImage } from '@/types';
import ROSLIB, { Ros } from 'roslib';
import { ref } from 'vue';
import type { Ref } from 'vue';
//in order to have reactive behavior, store the ros data in a ref
let compressedImage = ref<String>();
//Since we are going to return exampleData anyway, use typeof
export default function cameraSub(ros: ROSLIB.Ros): typeof compressedImage {
  let exampleTopic = new ROSLIB.Topic({
    ros,
    //topic name
    name: '/video_frames',
    //https://docs.ros.org/en/melodic/api/sensor_msgs/html/msg/CompressedImage.html
    messageType: 'sensor_msgs/msg/CompressedImage',
  });
  //subscribe to topic and sets ref data
  exampleTopic.subscribe<CompressedImage>((message) => {
    console.log(message.data);
    console.log(message);
    compressedImage.value = 'data:image/jpg;base64,' + message.data;
  });
  return compressedImage;
}
