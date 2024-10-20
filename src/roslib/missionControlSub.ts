import ROSLIB, { Ros } from 'roslib';
import { ref } from 'vue';
import type { Ref } from 'vue';
//in order to have reactive behavior, store the ros data in a ref
let missionControlData = ref<String>();
//Since we are going to return exampleData anyway, use typeof
export default function missionControlSub(ros: ROSLIB.Ros): typeof missionControlData {
  let exampleTopic = new ROSLIB.Topic({
    ros,
    //topic name
    name: '/mission_control_updater',
    //more message types at https://docs.ros.org/en/melodic/api/std_msgs/html/index-msg.html
    messageType: 'std_msgs/String',
    compression: "cbor",
  });

  //subscribe to topic and sets ref data
  exampleTopic.subscribe<String>((message) => {
    missionControlData.value = message.data;
  });

  return missionControlData;
}
