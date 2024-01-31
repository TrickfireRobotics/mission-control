import ROSLIB, { Ros } from 'roslib';
import { inject } from 'vue';
export default function examplePub(ros: ROSLIB.Ros) {
  //guarantee ros is defined
  // use this instead want to handle case where ros is undefined
  // const ros = inject<Ros>('ros')

  let exampleTopic = new ROSLIB.Topic({
    ros,
    name: '/exampleData',
    messageType: 'std_msgs/String',
  });
  //subscribe to topic and prints out message
  exampleTopic.subscribe((message) => {
    console.log(message);
  });
}
