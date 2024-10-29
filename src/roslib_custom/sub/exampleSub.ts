import ROSLIB, { Ros } from 'roslib';
import { ref } from 'vue';
import type { Ref } from 'vue';
//in order to have reactive behavior, store the ros data in a ref
const exampleData = ref<string>();
//Since we are going to return exampleData anyway, use typeof
export default function exampleSub(ros: ROSLIB.Ros): typeof exampleData {
  const exampleTopic = new ROSLIB.Topic({
    ros,
    //topic name
    name: '/exampleData',
    //more message types at https://docs.ros.org/en/melodic/api/std_msgs/html/index-msg.html
    messageType: 'std_msgs/String',
  });
  console.log('inside example Sub');
  //subscribe to topic and sets ref data
  exampleTopic.subscribe<string>((message) => {
    console.log(message);
    console.log(message.data);
    exampleData.value = message.data;
  });
  return exampleData;
}
