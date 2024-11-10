import type { TopicType } from "@/store/rosTypes";
import { useRoslibStore } from "@/store/useRoslib";

function setUpCamera(startI : number, endI : number) {
  // name: `/video_frames${i}`,
  const cameraTopicType : TopicType  = "sensor_msgs/msg/CompressedImage";
  const roslib = useRoslibStore()
  for (let i = startI; i <= endI; i++) {
    
    const cameraTopicName = `/video_frames{i}`;
    roslib.createPublisher({topicName : cameraTopicName, topicType : cameraTopicType })
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
}

