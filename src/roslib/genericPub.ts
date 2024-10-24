import ROSLIB from 'roslib';

//from my best understanding, the data passed in doesn't need to be in a ref as it is just going to publish it right away
//Aka does not need reactivity since it doesn't interact with the UI
export default function examplePub(
  ros: ROSLIB.Ros,
  input,
  passedName: string,
  messageType: string,
) {
  const exampleTopic = new ROSLIB.Topic({
    ros,
    name: passedName,
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
