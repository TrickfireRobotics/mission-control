<!-- Simulation-only arm joint control: sliders that drive the Gazebo sim's
     joint_trajectory_controller directly. Mirrors arm_bringup's old Python
     joint_gui.py tool rather than the real rover's arm mode/service stack,
     since the sim doesn't run that stack. -->
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { createPublisher } from '@/lib/roslibUtils/createPublisher';
import { useSubscriber } from '@/lib/roslibUtils/createSubscriber';

// the sim's four arm joints (see arm_control.urdf.xacro) - the chassis's
// wheel joints ride on the same /joint_states topic but are `continuous`,
// not `revolute`, so they're left out here and simply ignored below
const JOINT_NAMES = ['shoulder_1', 'elbow_1', 'wrist_1', 'wrist_2'] as const;
const JOINT_LIMIT = 3.14;
const TRAJECTORY_TOPIC = '/joint_trajectory_controller/joint_trajectory';
const DEFAULT_DURATION_S = 2;

const target = reactive<Record<string, number>>(Object.fromEntries(JOINT_NAMES.map((n) => [n, 0])));
const current = reactive<Record<string, number>>(Object.fromEntries(JOINT_NAMES.map((n) => [n, 0])));
const duration = ref(DEFAULT_DURATION_S);

const trajectoryPublisher = createPublisher({
  topicName: TRAJECTORY_TOPIC,
  topicType: 'trajectory_msgs/msg/JointTrajectory',
});

const jointStateSubscriber = useSubscriber({
  topicName: '/joint_states',
  topicType: 'sensor_msgs/msg/JointState',
});
jointStateSubscriber.start({
  callback: (msg) => {
    msg.name.forEach((name, i) => {
      if (name in current) current[name] = msg.position[i];
    });
  },
});

function send() {
  const sec = Math.floor(duration.value);
  trajectoryPublisher.publish({
    joint_names: [...JOINT_NAMES],
    points: [
      {
        positions: JOINT_NAMES.map((name) => target[name]),
        time_from_start: { sec, nanosec: Math.round((duration.value - sec) * 1e9) },
      },
    ],
  });
}

function sync() {
  JOINT_NAMES.forEach((name) => (target[name] = current[name]));
}

function reset() {
  JOINT_NAMES.forEach((name) => (target[name] = 0));
}
</script>

<template>
  <div class="arm-sim-control">
    <h2 class="title">Arm Joint Control (Sim)</h2>

    <div v-for="name in JOINT_NAMES" :key="name" class="joint-row">
      <label :for="name">{{ name }}</label>
      <input :id="name" v-model.number="target[name]" type="range" :min="-JOINT_LIMIT" :max="JOINT_LIMIT" step="0.01" />
      <span class="target-value">{{ target[name].toFixed(2) }}</span>
      <span class="current-value">cur {{ current[name].toFixed(2) }}</span>
    </div>

    <div class="duration-row">
      <label for="duration">Duration (s)</label>
      <input id="duration" v-model.number="duration" type="number" min="0.1" max="10" step="0.1" />
    </div>

    <div class="buttons">
      <button @click="send">Send</button>
      <button @click="sync">Sync</button>
      <button @click="reset">Reset</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.arm-sim-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title {
  text-align: center;
}

.joint-row {
  display: grid;
  grid-template-columns: 5rem 1fr 3rem 4rem;
  align-items: center;
  gap: 0.5rem;

  input[type='range'] {
    width: 100%;
  }

  .target-value,
  .current-value {
    font-variant-numeric: tabular-nums;
    text-align: right;
    color: var(--white);
    opacity: 0.8;
  }
}

.duration-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.25rem;

  input {
    width: 4rem;
  }
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
</style>
