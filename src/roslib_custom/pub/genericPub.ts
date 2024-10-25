import ROSLIB from 'roslib';

export default function genericPub<T>(
  ros: ROSLIB.Ros,
  input : T,
  topicName: string,
  messageType: messageType,
) {
  const exampleTopic = new ROSLIB.Topic({
    ros,
    name: topicName,
    messageType: messageType,
    compression: 'cbor',
  });
  // Function to publish a heartbeat message
  const data = new ROSLIB.Message({
    data: input,
  });
  //publishes data under topic
  exampleTopic.publish(data);
}
