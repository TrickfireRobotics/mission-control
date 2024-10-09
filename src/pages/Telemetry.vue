<!-- All information about rover like motor speed etc, position, potential record and export to csv -->
<script setup lang="ts">
  import GenericMotorTelemetry from '../components/telemetry/moteus/GenericMotorTelemetry.vue'
  import missionControlSub from '../roslib/missionControlSub'
  import {ref, onMounted, inject, defineExpose} from 'vue'
  import { Ros } from 'roslib';
  import { RobotInfo } from '../script/interface/robotInfo'

  let moteusMotors = [
    {
      displayName: "Front Left Drive Motor",
      canfdID : 25,
      controller: "Moteus r4.11"
    },
    {
      displayName: "Mid Left Drive Motor",
      canfdID : 24,
      controller: "Moteus r4.11"
    },
    {
      displayName: "Back Left Drive Motor",
      canfdID : 23,
      controller: "Moteus r4.11"
    },
    {
      displayName: "Front Right Drive Motor",
      canfdID : 22,
      controller: "Moteus r4.11"
    },
    {
      displayName: "Mid Right Drive Motor",
      canfdID : 21,
      controller: "Moteus r4.11"
    },
    {
      displayName: "Back Right Drive Motor",
      canfdID : 20,
      controller: "Moteus r4.11"
    },
    {
      displayName: "Arm Shoulder",
      canfdID : 1,
      controller: "Moteus n1"
    },
    {
      displayName: "Arm Elbow",
      canfdID : 2,
      controller: "Moteus r4.11"
    },
    {
      displayName: "Arm Left Wrist",
      canfdID : 3,
      controller: "Moteus r4.11"
    },
    {
      displayName: "Arm Right Wrist",
      canfdID : 4,
      controller: "Moteus r4.11"
    },
    {
      displayName: "Arm Turntable",
      canfdID : 5,
      controller: "Moteus r4.11"
    }
  ]

  let update_time_ms = ref(100)

  let recordingAll = ref(false)
  let isFinishedLoading = ref(false)

  const myChild = ref(null)

  let robotInfo;

  onMounted(() => initialize());

  let myRos = inject<Ros>('ros')

  function initialize(){
    if (myRos != null) {
      robotInfo = new RobotInfo(myRos);
    }

    isFinishedLoading.value = true;
  }

  function recordAllPressed(){
    if (myChild.value == null) {
      return;
    }

    for (let index = 0; index < myChild.value.length; index++) {
      myChild.value[index].recordButtonPressed()
    }

    recordingAll.value = !recordingAll.value;
  }

  function getMoteusStateProxy(param,dataCallback){
    return robotInfo.getMoteusMotorState(param,dataCallback)
  }



</script>
<template>
  <div>
    <div class="period-input-container">
        <button @click="
        recordAllPressed()
        " 
        v-bind:class="{'record-button-green': !recordingAll, 'record-button-red': recordingAll}">Record all</button>

    </div>
    <div class="period-input-container">
      <b class="period-text">Update Delay in ms</b>
      <input class="period-input" min="4" v-model="update_time_ms" type="number" title="Number of milliseconds between each time it polls for data. Affects recording as well"/>
    </div>
    <div class="page">

      <GenericMotorTelemetry
        class="telemetry-motor"
        v-for="(item) in moteusMotors"
        v-bind:displayName="item.displayName"
        v-bind:showAllFeatures="true"
        v-bind:update_ms="update_time_ms"
        v-bind:motorType="item.controller"
        ref="myChild"
        v-bind:dataSourceMethod="getMoteusStateProxy"
        v-bind:dataSourceParamater="item.canfdID"
        v-if="isFinishedLoading"
        >
      </GenericMotorTelemetry>
      

      <!-- Idk why, but in order to NOT showAllFeatures, do showAllFeatures="" <- writing anything besides an empty string does not work to make it "false" -->
      <!--MoteusMotorTelemetry ref="child1" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" moteusCANID="25" displayName="Front Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child2" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="24" displayName="Mid Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child3" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="23" displayName="Back Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child4" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="22" displayName="Front Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child5" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="21" displayName="Mid Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child6" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="20" displayName="Back Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child7" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="1" displayName="Shoulder Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child8" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="2" displayName="Elbow Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child9" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="3" displayName="Left Wrist Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child10" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="4" displayName="Right Wrist Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child11" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="5" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry-->

    </div>
    
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  margin: 5px;
  justify-content: center;
  
  
}

.period-input-container{
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

.record-button-red{
  background-color: rgb(255, 0, 0);
  color: white;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  margin-top: 5px;
}

.period-input{
  
  border-radius: 5px;
}

.period-text{
  margin-right: 5px;
}

.telemetry-motor{
  margin: 5px  
}
</style>
