<!--
  Home dashboard — velocity, camera preview, rover connection, motor status, battery/systems, map preview
-->
<script setup lang="ts">
import RoverVelocityDisplay from '@/components/rover_velocity_display/RoverVelocityDisplay.vue';
import ConnectionSettings from '@/components/settings/ConnectionSettings.vue';
import CameraIcon from 'vue-material-design-icons/Camera.vue';
import MapIcon from 'vue-material-design-icons/Map.vue';
import FlashIcon from 'vue-material-design-icons/Flash.vue';
import BatteryIcon from 'vue-material-design-icons/Battery.vue';
</script>

<template>
  <div class="two-by-three-grid-page">
    <!-- [1,1] Speed & Direction -->
    <RoverVelocityDisplay />

    <!-- [1,2] Front Camera Preview -->
    <div class="placeholder-panel">
      <component :is="CameraIcon" class="placeholder-icon" />
      <h2>Front Camera</h2>
      <p class="placeholder-desc">
        Forward-facing camera feed will appear here. Navigate to
        <strong>Cameras</strong> for all feeds.
      </p>
    </div>

    <!-- [1,3] Rover Connection — accessible directly from the dashboard -->
    <div class="home-connection-panel">
      <ConnectionSettings />
    </div>

    <!-- [2,1] Drive Motor Status -->
    <div class="placeholder-panel">
      <component :is="FlashIcon" class="placeholder-icon" />
      <h2>Drive Motors</h2>
      <p class="placeholder-desc">
        Power draw and status for all six drive motors. Navigate to
        <strong>Telemetry</strong> for full motor data.
      </p>
    </div>

    <!-- [2,2] Battery & System Status -->
    <div class="placeholder-panel">
      <component :is="BatteryIcon" class="placeholder-icon" />
      <h2>Battery &amp; Systems</h2>
      <p class="placeholder-desc">
        Battery level, system temperature, and overall health indicators will appear here.
      </p>
    </div>

    <!-- [2,3] Map Preview -->
    <div class="placeholder-panel">
      <component :is="MapIcon" class="placeholder-icon" />
      <h2>Map Preview</h2>
      <p class="placeholder-desc">
        Real-time GPS map showing rover position and navigation waypoints. Navigate to
        <strong>Map</strong> for the interactive view.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-connection-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
