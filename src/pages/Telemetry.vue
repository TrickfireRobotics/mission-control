<!-- All information about rover like motor speed etc, position, potential record and export to csv -->
<script setup lang="ts">
import GenericMotorTelemetry from '@/components/telemetry/moteus/GenericMotorTelemetry.vue';
import { ref, onMounted, watch, useTemplateRef } from 'vue';
import { RobotInfo } from '@/lib/interface/robotInfo';
import { useRoslibStore } from '@/store/roslibStore';

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

const myChild = useTemplateRef<(typeof GenericMotorTelemetry)[]>('myChild');

let robotInfo: RobotInfo;

const roslib = useRoslibStore();

onMounted(() => {
  robotInfo = new RobotInfo(roslib.ros);

  isFinishedLoading.value = true;
})

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

function getMoteusStateProxy(
  param: number,
  dataCallback: (result: { json_payload: string }) => void,
) {
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
        <b class="period-text">Update Delay in ms (doesn't work - FIXME)</b>
        <input
          v-model="updateTimeMs"
          class="period-input"
          min="4"
          type="number"
          title="Number of milliseconds between each time it polls for data. Affects recording as well"
        />
      </div>
    </div>

    <div class="page" v-if="isFinishedLoading">
        <GenericMotorTelemetry
          v-for="item in moteusMotors"
          :key="item.displayName"
          ref="myChild"
          class="telemetry-motor"
          :display-name="item.displayName"
          :show-all-features="true"
          :update-ms="updateTimeMs"
          :motor-type="item.controller"
          :data-source-method="getMoteusStateProxy"
          :data-source-parameter="item.canfdID"
        >
        </GenericMotorTelemetry>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
  grid-template: auto / 1fr 1fr;
  gap: 0.75em;
  padding: 0.75em;
  box-sizing: border-box;
  overflow-y: scroll;
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
}
</style>
