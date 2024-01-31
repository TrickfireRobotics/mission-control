import ROSLIB, { Ros } from 'roslib'
import { inject } from 'vue'
export default function examplePub(ros: ROSLIB.Ros) {
  //guarantee ros is defined
  // use this instead want to handle case where ros is undefined
  // const ros = inject<Ros>('ros')

  let exampleTopic = new ROSLIB.Topic({
    ros,
    name: '/exampleData',
    messageType: 'std_msgs/String'
  })
  // Function to publish a heartbeat message
  let data = new ROSLIB.Message({
    data: '1'
  })
  exampleTopic.publish(data)
}
