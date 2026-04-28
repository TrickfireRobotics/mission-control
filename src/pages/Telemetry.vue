<script setup lang="ts">
import GenericMotorTelemetry from '@/components/telemetry/moteus/GenericMotorTelemetry.vue';
import { ref, onMounted, watch, useTemplateRef } from 'vue';
import { RobotInfo } from '@/lib/interface/robotInfo';
import { useRoslibStore } from '@/store/roslibStore';
import { drivetrainMotors, armMotors } from '@/lib/motorConfig';

const updateTimeMs = ref(100);
const recordingAll = ref(false);
const isFinishedLoading = ref(false);

const myChild = useTemplateRef<(typeof GenericMotorTelemetry)[]>('myChild');

let robotInfo: RobotInfo;
const roslib = useRoslibStore();

onMounted(() => {
  robotInfo = new RobotInfo(roslib.ros);
  isFinishedLoading.value = true;
});

watch(updateTimeMs, (newValue) => {
  updateTimeMs.value = newValue < 4 ? 4 : newValue;
});

function recordAllPressed() {
  if (myChild.value === null) return;
  for (const child of myChild.value) {
    child.recordButtonPressed();
  }
  recordingAll.value = !recordingAll.value;
}

function getMotorStateProxy(
  param: number,
  dataCallback: (result: { json_payload: string }) => void,
) {
  return robotInfo.getMoteusMotorState(param, dataCallback);
}
</script>

<template>
  <div class="telemetry-page">
    <!-- ── Top control bar ── -->
    <header class="telemetry-header">
      <h2 class="telemetry-title">Telemetry</h2>

      <div class="telemetry-controls">
        <label class="control-group">
          <span class="control-label">Poll Interval</span>
          <div class="control-input-wrap">
            <input
              v-model="updateTimeMs"
              class="poll-input"
              min="4"
              type="number"
              title="Milliseconds between each poll. Also affects recording."
            />
            <span class="control-unit">ms</span>
          </div>
        </label>

        <button
          :class="{ 'button-toggle--on': !recordingAll, 'button-toggle--off': recordingAll }"
          @click="recordAllPressed()"
        >
          {{ recordingAll ? 'Stop All' : 'Record All' }}
        </button>
      </div>
    </header>

    <!-- ── Motor groups ── -->
    <div v-if="isFinishedLoading" class="telemetry-body">
      <section class="motor-group">
        <div class="group-header">
          <span class="group-label">Drivetrain</span>
          <span class="group-count">{{ drivetrainMotors.length }} motors</span>
        </div>
        <div class="motor-grid">
          <GenericMotorTelemetry
            v-for="item in drivetrainMotors"
            :key="item.displayName"
            ref="myChild"
            :display-name="item.displayName"
            :show-all-features="true"
            :update-ms="updateTimeMs"
            :motor-type="item.controller"
            :data-source-method="getMotorStateProxy"
            :data-source-parameter="item.canfdID"
          />
        </div>
      </section>

      <section class="motor-group">
        <div class="group-header">
          <span class="group-label">Arm</span>
          <span class="group-count">{{ armMotors.length }} motors</span>
        </div>
        <div class="motor-grid">
          <GenericMotorTelemetry
            v-for="item in armMotors"
            :key="item.displayName"
            ref="myChild"
            :display-name="item.displayName"
            :show-all-features="true"
            :update-ms="updateTimeMs"
            :motor-type="item.controller"
            :data-source-method="getMotorStateProxy"
            :data-source-parameter="item.canfdID"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// ── Page shell ──────────────────────────────────────────────────────────────
.telemetry-page {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: calc(100vh - var(--nav-bar-size));
  overflow: hidden;
  background: var(--app-background);
}

// ── Header ──────────────────────────────────────────────────────────────────
.telemetry-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.25rem;
  background: var(--component-background);
  border-bottom: 1px solid var(--light-grey);
  border-top: 2px solid var(--tf-green-mid);
  flex-shrink: 0;
  gap: 1rem;
}

.telemetry-title {
  font-size: 1rem;
  margin: 0;
}

.telemetry-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--dark-white);
  white-space: nowrap;
}

.control-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.poll-input {
  width: 68px;
}

.control-unit {
  font-size: 0.78rem;
  color: var(--dark-white);
  opacity: 0.55;
}

// ── Scrollable body ──────────────────────────────────────────────────────────
.telemetry-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

// ── Motor groups ─────────────────────────────────────────────────────────────
.motor-group {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.group-header {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--light-grey);
}

.group-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--tf-green);
}

.group-count {
  font-size: 0.72rem;
  color: var(--dark-white);
  opacity: 0.45;
}

.motor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 0.75rem;
}
</style>
