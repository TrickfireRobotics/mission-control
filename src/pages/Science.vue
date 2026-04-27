<!-- Life detection instruments, soil sample analysis, and spectroscopy data -->
<script setup lang="ts">
import FlaskIcon from 'vue-material-design-icons/Flask.vue';
import MicroscopeIcon from 'vue-material-design-icons/Microscope.vue';
import ChartLineIcon from 'vue-material-design-icons/ChartLine.vue';
import ThermometerIcon from 'vue-material-design-icons/Thermometer.vue';
import EarthIcon from 'vue-material-design-icons/Earth.vue';
import ImageIcon from 'vue-material-design-icons/Image.vue';
</script>

<template>
  <div class="two-by-three-grid-page">
    <div class="placeholder-panel">
      <component :is="FlaskIcon" class="placeholder-icon" />
      <h2>Soil Sample Analysis</h2>
      <p class="placeholder-desc">
        Chemical composition readouts from soil sample collection and analysis instruments.
      </p>
    </div>

    <div class="placeholder-panel">
      <component :is="MicroscopeIcon" class="placeholder-icon" />
      <h2>Life Detection</h2>
      <p class="placeholder-desc">
        Biological indicator readings and life-detection instrument telemetry.
      </p>
    </div>

    <div class="placeholder-panel">
      <component :is="ChartLineIcon" class="placeholder-icon" />
      <h2>Spectroscopy</h2>
      <p class="placeholder-desc">
        Spectroscopy sensor data and wavelength analysis graphs will appear here.
      </p>
    </div>

    <div class="placeholder-panel">
      <component :is="ThermometerIcon" class="placeholder-icon" />
      <h2>Environmental Sensors</h2>
      <p class="placeholder-desc">
        Ambient temperature, humidity, UV index, and atmospheric pressure readings.
      </p>
    </div>

    <div class="placeholder-panel">
      <component :is="EarthIcon" class="placeholder-icon" />
      <h2>Sample Site Map</h2>
      <p class="placeholder-desc">
        GPS-tagged sample collection sites and site notes recorded during the science task.
      </p>
    </div>

    <div class="placeholder-panel">
      <component :is="ImageIcon" class="placeholder-icon" />
      <h2>Sample Images</h2>
      <p class="placeholder-desc">
        Close-up images captured by the science camera during sample collection.
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
