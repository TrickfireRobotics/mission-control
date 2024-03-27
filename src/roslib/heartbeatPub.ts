import ROSLIB from 'roslib';
import type { Ref } from 'vue';

//from my best understanding, the data passed in doesn't need to be in a ref as it is just going to publish it right away
//Aka does not need reactivity since it doesn't interact with the UI
export default function heartbeatPub(ros: ROSLIB.Ros, input: number, interval: number) {
  // Function to publish a heartbeat message
  let heartbeat_topic = new ROSLIB.Topic({
    ros,
    name: '/heartbeat',
    messageType: 'std_msgs/String'
  });

  let heartbeatData = new ROSLIB.Message({
    data: input.toString(),  // Convert number to string
  });
  
  setInterval(() => heartbeat_topic.publish(heartbeatData), interval);
  // console.log("Heartbeat message published"); uncomment if publisher debugging is needed
}