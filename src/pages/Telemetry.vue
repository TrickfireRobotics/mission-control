<!-- All information about rover like motor speed etc, position, potential record and export to csv -->
<script setup lang="ts">
import GenericMotorTelemetry from '../components/telemetry/moteus/GenericMotorTelemetry.vue';
import { ref, onMounted, inject, watch } from 'vue';
import { Ros } from 'roslib';
import { RobotInfo } from '@/script/interface/robotInfo';

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

let update_time_ms = ref(100);

let recordingAll = ref(false);
let isFinishedLoading = ref(false);

const myChild = ref(null);

let robotInfo;

onMounted(() => initialize());

let myRos = inject<Ros>('ros');

function initialize() {
  if (myRos !== null) {
    robotInfo = new RobotInfo(myRos);
  }

  isFinishedLoading.value = true;
}

watch(update_time_ms, (newValue) => {
  update_time_ms.value = newValue < 4 ? 4 : newValue;
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
          :class="{ 'record-button-green': !recordingAll, 'record-button-red': recordingAll }"
          @click="recordAllPressed()"
        >
          Record all
        </button>
      </div>
      <div class="period-input-container">
        <b class="period-text">Update Delay in ms</b>
        <input
          v-model="update_time_ms"
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
          :update_ms="update_time_ms"
          :motor-type="item.controller"
          :data-source-method="getMoteusStateProxy"
          :data-source-paramater="item.canfdID"
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
  // padding: 5px;
  // margin: 5px;
  // justify-content: center;
}

.period-input-container {
  display: flex;
  justify-content: center;
  margin: 10px;
}

.record-button-green {
  background-color: rgb(48, 182, 48);
  color: white;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  margin-top: 5px;
}

.record-button-red {
  background-color: rgb(255, 0, 0);
  color: white;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  margin-top: 5px;
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
