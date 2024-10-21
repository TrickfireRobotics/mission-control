import ROSLIB from 'roslib';
import type { Ref } from 'vue';

export default function cameraControl(ros: ROSLIB.Ros, cameraNumber: string, cameraState: boolean) {
  let cameraControl = new ROSLIB.Topic({
    ros,
    //topic name
    name: '/camera_control',
    //more message types at https://docs.ros.org/en/melodic/api/std_msgs/html/index-msg.html
    messageType: 'std_msgs/Json',
  });
  // Function to publish a heartbeat message
  let data = new ROSLIB.Message({
    cameraNumber: cameraNumber,
    cameraState: cameraState,
  });
  //publishes data under topic
  cameraControl.publish(data);
}
