<!-- All information about rover like motor speed etc, position, potential record and export to csv -->
<script setup lang="ts">
  import MoteusMotorTelemetry from '../components/MoteusMotorTelemetry.vue'
</script>
<template>
  <div class="page">
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="1" displayName="Front Left Drive Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    <MoteusMotorTelemetry class="moteus-motor" moteusCANID="420" displayName="Turntable Motor" preset="FULL"></MoteusMotorTelemetry>
    
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
