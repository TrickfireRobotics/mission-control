<script setup lang="ts">
import { computed } from 'vue';
import { useSettingsStore } from '@/store/settingsStore';

const settings = useSettingsStore();

const tankDriveBlockHorizontal = computed({
  get: () => settings.settings.controller.tankDriveBlockHorizontal,
  set: (v) => settings.updateControllerSettings({ tankDriveBlockHorizontal: v }),
});

const invertX = computed({
  get: () => settings.settings.controller.invertX,
  set: (v) => settings.updateControllerSettings({ invertX: v }),
});

const invertY = computed({
  get: () => settings.settings.controller.invertY,
  set: (v) => settings.updateControllerSettings({ invertY: v }),
});

const deadzone = computed({
  get: () => settings.settings.controller.deadzone,
  set: (v) => settings.updateControllerSettings({ deadzone: v }),
});
</script>

<template>
  <div class="container">
    <h2>Controller Options</h2>

    <label class="checkbox-row">
      <input v-model="tankDriveBlockHorizontal" type="checkbox" />
      Block horizontal input in tank-drive mode
    </label>

    <label class="checkbox-row">
      <input v-model="invertX" type="checkbox" />
      Invert X axis
    </label>

    <label class="checkbox-row">
      <input v-model="invertY" type="checkbox" />
      Invert Y axis
    </label>

    <div class="deadzone-row">
      <label for="deadzone">Joystick deadzone ({{ deadzone.toFixed(2) }})</label>
      <input
        id="deadzone"
        type="range"
        min="0"
        max="0.5"
        step="0.01"
        :value="deadzone"
        @input="deadzone = parseFloat(($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.deadzone-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
</style>
