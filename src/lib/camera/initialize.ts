import type { TopicType } from '@/store/rosTypes';
import { useRoslibStore } from '@/store/useRoslib';

function setUpCamera(startI: number, endI: number) {
  // name: `/video_frames${i}`,
  const cameraTopicType: TopicType = 'sensor_msgs/msg/CompressedImage';
  const roslib = useRoslibStore();

  // Error: Cannot redeclare block-scoped variable 'cameraSubs'
  const cameraSubs = [];
  for (let i = startI; i <= endI; i++) {
    const cameraTopicName = `/video_frames{i}`;
    const [data, subscribe, unsubscribe, isOn] = roslib.createSubscriber({
      topicName: cameraTopicName,
      topicType: cameraTopicType,
    });
    // Error: Argument of type '(Ref<boolean, boolean> | Ref<string | undefined, string | undefined> | ((options: { callback?: ((message: StdMsg<string>) => void) | undefined; defaultValue?: string | undefined; isDebugging?: boolean | undefined; }) => void))[]' is not assignable to parameter of type 'never'.
    cameraSubs.push([data, subscribe, unsubscribe, isOn]);
  }

  // WHAT IT WOULD LOOK LIKE instead if uses classses
  const cameraSubs: Subscriber[] = [];
  for (let i = startI; i <= endI; i++) {
    const cameraTopicName = `/video_frames{i}`;
    const cameraSub: Subscriber = roslib.createSubscriber({
      topicName: cameraTopicName,
      topicType: cameraTopicType,
    });
    cameraSubs.push(cameraSub);
  }
}
