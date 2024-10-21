import ROSLIB from 'roslib';

export default function controllerPub(ros: ROSLIB.Ros, pubName: string, input: number) {
  if (pubName != '/' && pubName != '') {
    const controllerTopic = new ROSLIB.Topic({
      ros,
      //topic name
      name: pubName,
      //more message types at https://docs.ros.org/en/melodic/api/std_msgs/html/index-msg.html
      messageType: 'std_msgs/Float32',
    });
    // Function to publish a heartbeat message
    const data = new ROSLIB.Message({
      data: input,
    });
    //publishes data under topic
    controllerTopic.publish(data);
  }
}
