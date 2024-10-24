import ROSLIB from 'roslib';
import type { Ref } from 'vue';

//from my best understanding, the data passed in doesn't need to be in a ref as it is just going to publish it right away
//Aka does not need reactivity since it doesn't interact with the UI
export default function examplePub(ros: ROSLIB.Ros, exampleInput: number) {
  let exampleTopic = new ROSLIB.Topic({
    ros,
    //topic name
    name: '/exampleData',
    //more message types at https://docs.ros.org/en/melodic/api/std_msgs/html/index-msg.html
    messageType: 'std_msgs/Int32',
    compression: "cbor",
  });
  // Function to publish a heartbeat message
  let data = new ROSLIB.Message({
    data: exampleInput,
  });
  //publishes data under topic
  exampleTopic.publish(data);
}
