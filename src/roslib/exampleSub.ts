import type { RosMessage } from '@/types';
import ROSLIB, { Ros } from 'roslib';
import { ref } from 'vue';
import type { Ref } from 'vue';
//in order to have reactive behavior, store the ros data in a ref
let exampleData = ref<string>();
//Since we are going to return exampleData anyway, use typeof
export default function exampleSub(ros: ROSLIB.Ros): typeof exampleData {
  let exampleTopic = new ROSLIB.Topic({
    ros,
    //topic name
    name: '/exampleData',
    //more message types at https://docs.ros.org/en/melodic/api/std_msgs/html/index-msg.html
    messageType: 'std_msgs/Int32',
  });
  const bob = ROSLIB.Message;
  //subscribe to topic and sets ref data
  exampleTopic.subscribe<string>((message) => {
    console.log(message.data);
  });
  //
  return exampleData;
}
