<!-- All information about rover like motor speed etc, position, potential record and export to csv -->
<script setup lang="ts">
  import MoteusMotorTelemetry from '../components/MoteusMotorTelemetry.vue'
  import missionControlSub from '../roslib/missionControlSub'
  import {ref, onMounted, inject} from 'vue'
  import { Ros } from 'roslib';

  const ros = inject<Ros>('ros')
  let subscriberData : any = ref(null);
  let update_time_ms = ref(100)

  onMounted(() => initialize());

  function initialize(){
    if (ros != null){
      subscriberData.value = missionControlSub(ros)
    }


  }





</script>
<template>
  <div >
    <div class="period-input-container">
      <b class="period-text">Update Delay in ms</b>
      <input class="period-input" min="4" v-model="update_time_ms" type="number" title="Number of milliseconds between each time it polls for data. Affects recording as well"/>
    </div>
    <div class="page">
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="25" displayName="Front Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="24" displayName="Mid Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="23" displayName="Back Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="22" displayName="Front Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="21" displayName="Mid Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="20" displayName="Back Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="1" displayName="Shoulder Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="2" displayName="Elbow Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="3" displayName="Left Wrist Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="4" displayName="Right Wrist Motor" preset="FULL"></MoteusMotorTelemetry>
      <MoteusMotorTelemetry class="moteus-motor" showAllFeatures="true" v-bind:update_ms="update_time_ms" v-bind:dataSub="subscriberData" moteusCANID="5" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>

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
