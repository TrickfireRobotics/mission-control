import ROSLIB from 'roslib';
import { inject } from 'vue';

export default function genericPub<T>(
  ros: ROSLIB.Ros,
  topicName: string,
  messageType: messageType,
  input: T,
) {
  // const ros = inject<ROSLIB.Ros>('ros') as ROSLIB.Ros;
  const topic = new ROSLIB.Topic({
    ros,
    name: topicName,
    messageType: messageType,
  });
  console.log(topicName, messageType);
  // Function to publish a heartbeat message
  const data = new ROSLIB.Message({
    data: input,
  });
  //publishes data under topic
  console.log('publishing data', data);
  topic.publish(data);
}
