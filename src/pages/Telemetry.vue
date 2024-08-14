<!-- All information about rover like motor speed etc, position, potential record and export to csv -->
<script setup lang="ts">
  import MoteusMotorTelemetry from '../components/MoteusMotorTelemetry.vue'
</script>
<template>
  <div class="page">
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="25" displayName="Front Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="24" displayName="Mid Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="23" displayName="Back Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="22" displayName="Front Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="21" displayName="Mid Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="20" displayName="Back Right Drive Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="1" displayName="Shoulder Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="2" displayName="Elbow Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="3" displayName="Left Wrist Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="4" displayName="Right Wrist Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="5" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    
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

.moteus-motor{
  margin: 5px  
}
</style>
