<!-- All information about rover like motor speed etc, position, potential record and export to csv -->
<script setup lang="ts">
  import MoteusMotorTelemetry from '../components/MoteusMotorTelemetry.vue'
  import missionControlSub from '../roslib/missionControlSub'
  import {ref, onMounted, inject, defineExpose} from 'vue'
  import { Ros } from 'roslib';

  // We will pass one single subscriber to all the children in order to prevent
  // subscriber spam
  const ros = inject<Ros>('ros')
  let subscriberData : any = ref(null);
  let update_time_ms = ref(100)

  let recordingAll = ref(false)

  const child1 = ref(null)
  const child2 = ref(null)
  const child3 = ref(null)
  const child4 = ref(null)
  const child5 = ref(null)
  const child6 = ref(null)
  const child7 = ref(null)
  const child8 = ref(null)
  const child9 = ref(null)
  const child10 = ref(null)
  const child11 = ref(null)
  

  onMounted(() => initialize());

  function initialize(){
    if (ros != null){
      subscriberData.value = missionControlSub(ros)
    }
  }

  function recordAllPressed(){
    recordingAll.value = !recordingAll.value;
  }


</script>
<template>
  <div>
    <div class="period-input-container">
      <!--button @click="myChild.recordButtonPressed(), recordAllPressed()" v-bind:class="{'record-button-green': !recordingAll, 'record-button-red': recordingAll}">Record all</button-->
      <button @click="
        child1.recordButtonPressed(), 
        child2.recordButtonPressed(),
        child3.recordButtonPressed(),
        child4.recordButtonPressed(),
        child5.recordButtonPressed(),
        child6.recordButtonPressed(),
        child7.recordButtonPressed(),
        child8.recordButtonPressed(),
        child9.recordButtonPressed(),
        child10.recordButtonPressed(),
        child11.recordButtonPressed(),
        recordAllPressed()" 
        v-bind:class="{'record-button-green': !recordingAll, 'record-button-red': recordingAll}">Record all</button>
    </div>
    <div class="period-input-container">
      <b class="period-text">Update Delay in ms</b>
      <input class="period-input" min="4" v-model="update_time_ms" type="number" title="Number of milliseconds between each time it polls for data. Affects recording as well"/>
    </div>
    <div class="page">
      <!-- Idk why, but in order to NOT showAllFeatures, do showAllFeatures="" <- writing anything besides an empty string does not work to make it "false" -->
      <MoteusMotorTelemetry ref="child1" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="25" displayName="Front Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child2" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="24" displayName="Mid Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child3" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="23" displayName="Back Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child4" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="22" displayName="Front Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child5" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="21" displayName="Mid Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child6" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="20" displayName="Back Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child7" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="1" displayName="Shoulder Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child8" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="2" displayName="Elbow Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child9" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="3" displayName="Left Wrist Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child10" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="4" displayName="Right Wrist Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry ref="child11" class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="5" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>

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

.moteus-motor{
  margin: 5px  
}
</style>
