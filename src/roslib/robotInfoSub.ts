const motorTopics = [
  'front_left_drive_motor_velocity_from_can',
  'mid_left_drive_motor_velocity',
  'back_left_drive_motor_velocity',
  'front_right_drive_motor_velocity',
  'mid_right_drive_motor_velocity',
  'back_right_drive_motor_velocity',
  'front_left_drive_motor_torque',
  'mid_left_drive_motor_torque',
  'back_left_drive_motor_torque',
  'front_right_drive_motor_torque',
  'mid_right_drive_motor_torque',
  'back_right_drive_motor_torque',
  'front_left_drive_motor_temperature',
  'mid_left_drive_motor_temperature',
  'back_left_drive_motor_temperature',
  'front_right_drive_motor_temperature',
  'mid_right_drive_motor_temperature',
  'back_right_drive_motor_temperature',
];

import ROSLIB, { Ros } from 'roslib';
import { ref } from 'vue';
import type { Ref } from 'vue';
//in order to have reactive behavior, store the ros data in a ref
// let exampleData = ref<number>();
//Since we are going to return exampleData anyway, use typeof
export default function robotInfoSub(ros: ROSLIB.Ros) {
  motorTopics.forEach((topicName) => {
    let exampleTopic = new ROSLIB.Topic({
      ros,
      //topic name
      name: topicName,
      //more message types at https://docs.ros.org/en/melodic/api/std_msgs/html/index-msg.html
      messageType: 'std_msgs/Float32',
    });
    //subscribe to topic and sets ref data
    exampleTopic.subscribe<number>((message) => {
      console.log(message.data);
      // exampleData.value = message.data;
    });
  });
  // return exampleData;
}
