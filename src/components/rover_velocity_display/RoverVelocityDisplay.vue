<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
import { CanBusID, useTelemetryData } from '@/lib/roslibUtils/telemetry';
import { computed } from 'vue';

// Voltage: 0-36 for old drive motors (0-48 for new drive motors), 0-48 for arm motors.
const MAX_VOLTAGE = 36;
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
</script>
<template>
  <div>
    <table>
      <tbody>
        <tr>
          <th class="barColumn">
            <div class="barcontainer">
              <div id="frontLeftMotorBar" class="bar"></div>
            </div>
            <p id="frontLeftMotor">{{ formatMotorValue(telemetry.frontLeftDrive.value) }}</p>

            <div class="barcontainer">
              <div id="midLeftMotorBar" class="bar"></div>
            </div>
            <p id="midLeftMotor">{{ formatMotorValue(telemetry.midLeftDrive.value) }}</p>

            <div class="barcontainer">
              <div id="backLeftMotorBar" class="bar"></div>
            </div>
            <p id="backLeftMotor">{{ formatMotorValue(telemetry.backLeftDrive.value) }}</p>
          </th>
          <th>
            <img src="@/assets/TransparentRoverVelocityModel.svg" draggable="false" />
          </th>
          <th class="barColumn">
            <div class="barcontainer">
              <div id="frontRightMotorBar" class="bar"></div>
            </div>
            <p id="frontRightMotor">{{ formatMotorValue(telemetry.frontRightDrive.value) }}</p>

            <div class="barcontainer">
              <div id="midRightMotorBar" class="bar"></div>
            </div>
            <p id="midRightMotor">{{ formatMotorValue(telemetry.midRightDrive.value) }}</p>

            <div class="barcontainer">
              <div id="backRightMotorBar" class="bar"></div>
            </div>
            <p id="backRightMotor">{{ formatMotorValue(telemetry.backRightDrive.value) }}</p>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<!-- Should have lang="scss" and "scoped" to enable superpower of SCSS and make styles do not accidentally interact with other components styles-->
<style lang="scss" scoped>
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
}
table {
  position: absolute;
  table-layout: fixed;
}
th.barColumn {
  width: 20%;
}
</style>
