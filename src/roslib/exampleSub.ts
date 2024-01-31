import ROSLIB from 'roslib';
import { Ref, inject, ref } from 'vue';
//in order to have reactive behavior, store the ros data in a ref
let exampleData = ref<string>();
//Ref
export default function exampleSub(ros: ROSLIB.Ros): Ref<string | undefined> {
  //guarantee ros is defined
  // use this instead want to handle case where ros is undefined
  // const ros = inject<Ros>('ros')

  let exampleTopic = new ROSLIB.Topic({
    ros,
    name: '/exampleData',
    messageType: 'std_msgs/String',
  });
  // Function to publish a heartbeat message
  let data = new ROSLIB.Message({
    data: 'Hello World!',
  });
  exampleTopic.publish(data);
  return exampleData;
}
