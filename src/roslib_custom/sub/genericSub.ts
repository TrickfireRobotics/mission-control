import ROSLIB from 'roslib';
import { ref } from 'vue';
import type { Ref } from 'vue';

//Since we are going to return exampleData anyway, use typeof
export default function exampleSub<T>(
  ros: ROSLIB.Ros,
  topicName: string,
  messageType: messageType,
  //in order to have reactive behavior, store the ros data in a ref
  data: Ref,
) {
  const exampleTopic = new ROSLIB.Topic<T>({
    ros,
    name: topicName,
    //more message types at https://docs.ros.org/en/melodic/api/std_msgs/html/index-msg.html
    messageType: messageType,
  });
  console.count('running in GenericSub');
  //subscribe to topic and sets ref data
  exampleTopic.subscribe((message) => {
    data.value = message.data;
    console.log(message);
    console.log(data);
  });
  // return data;
}
