<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
import { CanBusID, useTelemetryData } from '@/lib/roslibUtils/telemetry';
import { useRoslibStore } from '@/store/roslibStore';
import { computed, watch } from 'vue';

// Voltage:
// - 0-36 for Moteus
// - 0-48 for RMDx8
const MAX_VOLTAGE = 48;
const telemetry = useTelemetryData(
  [
    CanBusID.BackLeftDrive,
    CanBusID.BackRightDrive,
    CanBusID.FrontLeftDrive,
    CanBusID.FrontRightDrive,
    CanBusID.MidLeftDrive,
    CanBusID.MidRightDrive,
  ],
  (data) => data.input_voltage,
  0,
);

const frontLeftMotorVelocity = computed(() => {
  return getPercentage(telemetry.frontLeftDrive.value);
});
const midLeftMotorVelocity = computed(() => {
  return getPercentage(telemetry.midLeftDrive.value);
});
const backLeftMotorVelocity = computed(() => {
  return getPercentage(telemetry.backLeftDrive.value);
});
const frontRightMotorVelocity = computed(() => {
  return getPercentage(telemetry.frontRightDrive.value);
});
const midRightMotorVelocity = computed(() => {
  return getPercentage(telemetry.midRightDrive.value);
});
const backRightMotorVelocity = computed(() => {
  return getPercentage(telemetry.backRightDrive.value);
});

function getPercentage(input: number | null | undefined) {
  if (!input) {
    return '0%';
  }
  return (input / MAX_VOLTAGE) * 100 + '%';
}

function formatMotorValue(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '0.00';
  }
  return value.toFixed(2);
}

// Reset all motor values to zero when the rover disconnects
const roslib = useRoslibStore();
watch(
  () => roslib.isWebSocketConnected,
  (connected) => {
    if (!connected) {
      telemetry.frontLeftDrive.value = 0;
      telemetry.midLeftDrive.value = 0;
      telemetry.backLeftDrive.value = 0;
      telemetry.frontRightDrive.value = 0;
      telemetry.midRightDrive.value = 0;
      telemetry.backRightDrive.value = 0;
    }
  },
);
</script>
<template>
  <div>
    <div class="diagram-header">
      <div class="diagram-header-content">
        <span class="diagram-title">Drive Motor Input Voltage</span>
        <span class="diagram-unit">(max {{ MAX_VOLTAGE }} V)</span>
      </div>
    </div>
    <table>
      <tbody>
        <tr>
          <th class="barColumn">
            <div class="barcontainer">
              <div id="frontLeftMotorBar" class="bar"></div>
            </div>
            <p id="frontLeftMotor">
              {{ formatMotorValue(telemetry.frontLeftDrive.value) }}<span class="unit"></span>
            </p>

            <div class="barcontainer">
              <div id="midLeftMotorBar" class="bar"></div>
            </div>
            <p id="midLeftMotor">
              {{ formatMotorValue(telemetry.midLeftDrive.value) }}<span class="unit"></span>
            </p>

            <div class="barcontainer">
              <div id="backLeftMotorBar" class="bar"></div>
            </div>
            <p id="backLeftMotor">
              {{ formatMotorValue(telemetry.backLeftDrive.value) }}<span class="unit"></span>
            </p>
          </th>
          <th>
            <img src="@/assets/TransparentRoverVelocityModel.svg" draggable="false" />
          </th>
          <th class="barColumn">
            <div class="barcontainer">
              <div id="frontRightMotorBar" class="bar"></div>
            </div>
            <p id="frontRightMotor">
              {{ formatMotorValue(telemetry.frontRightDrive.value) }}<span class="unit"></span>
            </p>

            <div class="barcontainer">
              <div id="midRightMotorBar" class="bar"></div>
            </div>
            <p id="midRightMotor">
              {{ formatMotorValue(telemetry.midRightDrive.value) }}<span class="unit"></span>
            </p>

            <div class="barcontainer">
              <div id="backRightMotorBar" class="bar"></div>
            </div>
            <p id="backRightMotor">
              {{ formatMotorValue(telemetry.backRightDrive.value) }}<span class="unit"></span>
            </p>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<!-- Should have lang="scss" and "scoped" to enable superpower of SCSS and make styles do not accidentally interact with other components styles-->
<style lang="scss" scoped>
.diagram-header {
  position: absolute;
  top: 1rem;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.diagram-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.diagram-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--white);
}

.diagram-unit {
  font-family: 'Overpass', monospace;
  font-size: 0.65rem;
  color: var(--dark-white);
  opacity: 0.6;
}

div img {
  display: block;
  margin-right: auto;
  margin-left: auto;
  width: 80%;
  height: auto;
}
div {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  overflow-x: auto;
  background-color: var(--component-background);
  position: relative;
}
.barcontainer {
  background-color: var(--light-grey);
  position: relative;
  margin-left: 20px; // Was 50px
  max-width: 18px;
  width: 18px;
  // height: 55px;
  height: 50px; // Was 56px
  border-radius: 5px;
  margin-top: 15px;
  margin-right: auto;
  margin-left: auto;
  display: block;
}
.bar {
  background-color: var(--error);
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  animation: grow 1.5s ease-out forwards;
  transform-origin: bottom;
  border-radius: 5px;

  &#frontLeftMotorBar {
    height: v-bind(frontLeftMotorVelocity);
  }
  &#midLeftMotorBar {
    height: v-bind(midLeftMotorVelocity);
  }
  &#backLeftMotorBar {
    height: v-bind(backLeftMotorVelocity);
  }
  &#frontRightMotorBar {
    height: v-bind(frontRightMotorVelocity);
  }
  &#midRightMotorBar {
    height: v-bind(midRightMotorVelocity);
  }
  &#backRightMotorBar {
    height: v-bind(backRightMotorVelocity);
  }
}
@keyframes grow {
  from {
    transform: scaleY(0);
  }
}
p {
  text-align: center;
  margin-right: auto;
  margin-left: auto;
  display: block;
  font-variant-numeric: tabular-nums;
  font-family: 'Overpass', monospace;
  width: 3.5rem;
  min-height: 1.2em;

  .unit {
    font-size: 0.65em;
    opacity: 0.55;
    margin-left: 1px;
  }
}
table {
  position: absolute;
  table-layout: fixed;
}
th.barColumn {
  width: 20%;
}
</style>
