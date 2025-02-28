<!-- Should have " setup lang="ts" " in script tag for proper Composition and enforce typescript-->
<script setup lang="ts">
  import RoverTelemetry from '@/assets/TransparentRoverVelocityModel.svg';
  import { type MoteusMotorState, useTelemetry } from '@/lib/roslibUtils/telemetry';
  import { mergeProps, ref, type Ref } from 'vue';
  import { onMounted } from 'vue';
  import { GenericMotorTelemetryProps } from '../telemetry/moteus/GenericMotorTelemetry.vue';
 
  const frontLeftMotor:Ref<string> = ref("100000%");
  const midLeftMotor:Ref<string> = ref("50%");
  const backLeftMotor:Ref<string> = ref("75%");
  const frontRightMotor:Ref<string> = ref("15%");
  const midRightMotor:Ref<string> = ref("80%");
  const backRightMotor:Ref<string> = ref("90%");
  const telemetry = useTelemetry();
  const props = defineProps<GenericMotorTelemetryProps>();

  onMounted(() => { 
    telemetry.start(dataCallback);
  });

  function dataCallback(result: MoteusMotorState[]) {
    
  }

  function updateMotor(can_id: number, percentageData: Ref<string>, result: MoteusMotorState[]) {
    const motor = result.find((motor) => motor.can_id === props.dataSourceParameter);

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
          <p id="frontLeftMotor">{{frontLeftMotor}}</p>

          <div class="barcontainer">
            <div id="midLeftMotorBar" class="bar"></div>
          </div>
          <p id="midLeftMotor">{{midLeftMotor}}</p>

          <div class="barcontainer">
            <div id="backLeftMotorBar" class="bar"></div>
          </div>
          <p id="backLeftMotor">{{backLeftMotor}}</p>
        </th>
        <th>
          <img src="@/assets/TransparentRoverVelocityModel.svg" draggable="false">
        </th>
        <th class="barColumn">
          <div class="barcontainer">
            <div id="frontRightMotorBar" class="bar"></div>
          </div>
          <p id="frontRightMotor">{{frontRightMotor}}</p>

          <div class="barcontainer">
            <div id="midRightMotorBar" class="bar"></div>
          </div>
          <p id="midRightMotor">{{midRightMotor}}</p>

          <div class="barcontainer">
            <div id="backRightMotorBar" class="bar"></div>
          </div>
          <p id="backRightMotor">{{backRightMotor}}</p>
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
    height: 55px;
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
      height: v-bind(frontLeftMotor);
    }
    &#midLeftMotorBar {
      height: v-bind(midLeftMotor);
    }
    &#backLeftMotorBar {
      height: v-bind(backLeftMotor);
    }
    &#frontRightMotorBar {
      height: v-bind(frontRightMotor);
    }
    &#midRightMotorBar {
      height: v-bind(midRightMotor);
    }
    &#backRightMotorBar {
      height: v-bind(backRightMotor);
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
