<!-- All information about rover like motor speed etc, position, potential record and export to csv -->
<script setup lang="ts">
import GenericMotorTelemetry from '../components/telemetry/moteus/GenericMotorTelemetry.vue';
import { ref, onMounted, watch } from 'vue';
import RobotInfo from '@/lib/interface/robotInfo';
import { useRoslibStore } from '@/store/useRoslib';

let moteusMotors = [
  {
    displayName: 'Front Left Drive Motor',
    canfdID: 25,
    controller: 'Moteus r4.11',
  },
  {
    displayName: 'Mid Left Drive Motor',
    canfdID: 24,
    controller: 'Moteus r4.11',
  },
  {
    displayName: 'Back Left Drive Motor',
    canfdID: 23,
    controller: 'Moteus r4.11',
  },
  {
    displayName: 'Front Right Drive Motor',
    canfdID: 22,
    controller: 'Moteus r4.11',
  },
  {
    displayName: 'Mid Right Drive Motor',
    canfdID: 21,
    controller: 'Moteus r4.11',
  },
  {
    displayName: 'Back Right Drive Motor',
    canfdID: 20,
    controller: 'Moteus r4.11',
  },
  {
    displayName: 'Arm Shoulder',
    canfdID: 1,
    controller: 'Moteus n1',
  },
  {
    displayName: 'Arm Elbow',
    canfdID: 2,
    controller: 'Moteus r4.11',
  },
  {
    displayName: 'Arm Left Wrist',
    canfdID: 3,
    controller: 'Moteus r4.11',
  },
  {
    displayName: 'Arm Right Wrist',
    canfdID: 4,
    controller: 'Moteus r4.11',
  },
  {
    displayName: 'Arm Turntable',
    canfdID: 5,
    controller: 'Moteus r4.11',
  },
];

let updateTimeMs = ref(100);

let recordingAll = ref(false);
let isFinishedLoading = ref(false);

const myChild = ref(null);

let robotInfo;

onMounted(() => initialize());

const roslib = useRoslibStore();

function initialize() {
  if (roslib.ros !== null) {
    robotInfo = new RobotInfo(roslib.ros);
  }

  isFinishedLoading.value = true;
}

watch(updateTimeMs, (newValue) => {
  updateTimeMs.value = newValue < 4 ? 4 : newValue;
});

function recordAllPressed() {
  if (myChild.value === null) {
    return;
  }

  for (let index = 0; index < myChild.value.length; index++) {
    myChild.value[index].recordButtonPressed();
  }

  recordingAll.value = !recordingAll.value;
}

function getMoteusStateProxy(param, dataCallback) {
  return robotInfo.getMoteusMotorState(param, dataCallback);
}
</script>
<template>
  <div class="two-by-three-grid-page">
    <div>
      <div class="period-input-container">
        <button
          :class="{ 'button-toggle--on': !recordingAll, 'button-toggle--off': recordingAll }"
          @click="recordAllPressed()"
        >
          Record all
        </button>
      </div>
      <div class="period-input-container">
        <b class="period-text">Update Delay in ms</b>
        <input
          v-model="updateTimeMs"
          class="period-input"
          min="4"
          type="number"
          title="Number of milliseconds between each time it polls for data. Affects recording as well"
        />
      </div>
    </div>

    <div class="page">
      <div v-if="isFinishedLoading">
        <GenericMotorTelemetry
          v-for="item in moteusMotors"
          :key="item.displayName"
          ref="myChild"
          class="telemetry-motor"
          :display-name="item.displayName"
          :show-all-features="true"
          :update-ms="updateTimeMs.toString()"
          :motor-type="item.controller"
          :data-source-method="getMoteusStateProxy"
          :data-source-paramater="item.canfdID.toString()"
        >
        </GenericMotorTelemetry>
      </div>
    </div>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
    <h1>Not yet Implemented</h1>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-wrap: wrap;
}
.period-input-container {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.period-input {
  border-radius: 5px;
}

.period-text {
  margin-right: 5px;
}

.telemetry-motor {
  margin: 5px;
}
</style>
