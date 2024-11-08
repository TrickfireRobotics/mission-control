<script setup lang="ts">
import ROSLIB from 'roslib';
import { ref, onMounted } from 'vue';

import { useRoslibStore } from '@/store/useRoslib';

onMounted(() => initialize());

const roslib = useRoslibStore();

let armModeService: ROSLIB.Service;

/**
 * disabled = 0
 * individual_motor_control_vel = 1
 * individual_motor_control_pos = 2
 * inverse_kinematics = 3
 */
let current_arm_mode = ref(-1); // Default is disabled
//let isLoaded = ref(false);

function initialize() {
  armModeService = new ROSLIB.Service({
    ros: roslib.ros,
    name: '/get_arm_mode',
    serviceType: 'ArmMode',
  });

  getCurrentArmMode();
}

function getCurrentArmMode() {
  var request = {
    //Dummy data for now
    input: 1,
  };

  armModeService.callService(request, function (result) {
    console.log('Result from service ' + result.current_mode);
    current_arm_mode.value = result.current_mode;
    //isLoaded.value = true
  });
}

function changeArmMode(targetMode: number) {
  console.log('Target mode wanted' + targetMode);
  const armModePublish = roslib.createPublisher({
    topicName: 'update_arm_mode',
    topicType: 'std_msgs/Int32',
  });
  armModePublish(targetMode);
  getCurrentArmMode();
}
</script>

<template>
  <div class="mode-button-container">
    <div class="mode-button-vertical">
      <div>
        <b class="mode-text">Arm Control Mode:</b>
      </div>
      <div>
        <!--button class="button-mode" @click="sendRequest">TEST</button-->
        <button
          :class="{
            'button--off': current_arm_mode !== 0,
            'button--on': current_arm_mode === 0,
          }"
          @click="changeArmMode(0)"
        >
          Disabled
        </button>
        <button
          :class="{
            'button--off': current_arm_mode !== 1,
            'button--on': current_arm_mode === 1,
          }"
          @click="changeArmMode(1)"
        >
          Individual Motor Control (Velocity)
        </button>
        <button
          :class="{
            'button--off': current_arm_mode !== 2,
            'button--on': current_arm_mode === 2,
          }"
          @click="changeArmMode(2)"
        >
          Individual Motor Control (Position)
        </button>
        <button
          :class="{
            'button--off': current_arm_mode !== 3,
            'button--on': current_arm_mode === 3,
          }"
          @click="changeArmMode(3)"
        >
          Inverse Kinematics
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mode-button-container {
  display: flex;
  justify-content: center;
}

.mode-text {
  display: flex;
  justify-content: center;
}

.mode-button-vertical {
  display: flex;
  flex-direction: column;
}
</style>
