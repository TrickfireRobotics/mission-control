<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
  import RoverTelemetry from '@/assets/TransparentRoverVelocityModel.svg';
  import { CanBusID, type MoteusMotorState, useTelemetryData } from '@/lib/roslibUtils/telemetry';
  import { mergeProps, ref, type Ref, computed } from 'vue';
  import { onMounted } from 'vue';
import GenericMotorTelemetry from '../telemetry/moteus/GenericMotorTelemetry.vue';
 
  // Voltage: 0-36 for old drive motors (0-48 for new drive motors), 0-48 for arm motors.
  const MAX_VOLTAGE = 36;
  const telemetry = useTelemetryData([CanBusID.BackLeftDrive, CanBusID.BackRightDrive, CanBusID.FrontLeftDrive, CanBusID.FrontRightDrive, CanBusID.MidLeftDrive, CanBusID.MidRightDrive], (data) => data.input_voltage, 0);
    
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
    if(!input) {
      return "0%";
    }
    return ((input / MAX_VOLTAGE) * 100) + "%";
  }

</script>
<template>
  <div>
    <table>
      <tr>
        <th class="barColumn">
          <div class="barcontainer">
            <div id="frontLeftMotorBar" class="bar"></div>
          </div>
          <p id="frontLeftMotor">{{ telemetry.frontLeftDrive.value }}</p>

          <div class="barcontainer">
            <div id="midLeftMotorBar" class="bar"></div>
          </div>
          <p id="midLeftMotor">{{ telemetry.midLeftDrive.value }}</p>

          <div class="barcontainer">
            <div id="backLeftMotorBar" class="bar"></div>
          </div>
          <p id="backLeftMotor">{{ telemetry.backLeftDrive.value }}</p>
        </th>
        <th>
          <img src="@/assets/TransparentRoverVelocityModel.svg" draggable="false">
        </th>
        <th class="barColumn">
          <div class="barcontainer">
            <div id="frontRightMotorBar" class="bar"></div>
          </div>
          <p id="frontRightMotor">{{ telemetry.frontRightDrive.value }}</p>

          <div class="barcontainer">
            <div id="midRightMotorBar" class="bar"></div>
          </div>
          <p id="midRightMotor">{{ telemetry.midRightDrive.value }}</p>

          <div class="barcontainer">
            <div id="backRightMotorBar" class="bar"></div>
          </div>
          <p id="backRightMotor">{{ telemetry.backRightDrive.value }}</p>
        </th>
      </tr>
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
  }
  .barcontainer {
    background-color: var(--light-grey);
    position: relative;
    margin-left: 50px;
    max-width: 18px;
    width: 18px;
    // height: 55px;
    height: 56px;
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
  }
  table {
    position: absolute;
    table-layout: fixed;
  }
  th.barColumn {
    width: 20%;
  }
</style>
