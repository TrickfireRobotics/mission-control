<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '@/store/settingsStore';
import { useControllerStore } from '@/store/controllerStore';

const settings = useSettingsStore();
const controller = useControllerStore();

const blockHorizontal = computed({
  get: () => settings.settings.controller.tankDriveBlockHorizontal,
  set: (v) => settings.updateControllerSettings({ tankDriveBlockHorizontal: v }),
});

// Live gamepad name - read directly from the browser API
const connectedGamepadName = ref<string | null>(null);
let rafId: number | null = null;

function pollName() {
  const pads = navigator.getGamepads();
  for (const pad of pads) {
    if (pad) {
      connectedGamepadName.value = pad.id;
      rafId = requestAnimationFrame(pollName);
      return;
    }
  }
  connectedGamepadName.value = null;
  rafId = requestAnimationFrame(pollName);
}

onMounted(() => {
  rafId = requestAnimationFrame(pollName);
});
onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
});
</script>

<template>
  <div class="ctrl-config">
    <div class="section-header">
      <h2>Input Device</h2>
      <span
        class="status-badge"
        :class="controller.isGamepadConnected ? 'badge-connected' : 'badge-disconnected'"
      >
        {{ controller.isGamepadConnected ? 'Connected' : 'Not Connected' }}
      </span>
    </div>

    <div v-if="controller.isGamepadConnected && connectedGamepadName" class="device-name">
      <span class="device-label">Gamepad</span>
      <span class="device-value">{{ connectedGamepadName }}</span>
    </div>
    <p v-else class="no-device">
      No gamepad detected. Press any button on your controller to wake it up.
    </p>

    <div class="divider" />

    <h2>Driving Options</h2>

    <label class="toggle-row">
      <div class="toggle-info">
        <span class="toggle-name">Block horizontal stick input</span>
        <span class="toggle-desc">
          In tank drive, zeroes out the X axis of both sticks so only forward/back (Y axis) is sent.
          Useful to prevent accidental lateral drift commands.
        </span>
      </div>
      <div
        class="toggle-switch"
        :class="{ active: blockHorizontal }"
        @click="blockHorizontal = !blockHorizontal"
      >
        <div class="toggle-knob" />
      </div>
    </label>
  </div>
</template>

<style lang="scss" scoped>
.ctrl-config {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  h2 {
    font-size: 1.15rem;
  }
}

.status-badge {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 3px;

  &.badge-connected {
    background-color: var(--tf-green-dim);
    color: var(--tf-green);
    border: 1px solid var(--tf-green-mid);
  }
  &.badge-disconnected {
    background-color: rgba(229, 0, 0, 0.12);
    color: var(--error);
    border: 1px solid rgba(229, 0, 0, 0.35);
  }
}

.device-name {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0.5rem 0.75rem;
  background-color: var(--dark-grey);
  border: 1px solid var(--light-grey);
  border-radius: 4px;

  .device-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--dark-white);
    opacity: 0.6;
  }

  .device-value {
    font-family: 'Overpass', sans-serif;
    font-size: 0.82rem;
    color: var(--white);
    word-break: break-all;
  }
}

.no-device {
  font-size: 0.84rem;
  color: var(--dark-white);
  opacity: 0.6;
  font-style: italic;
  font-family: 'Overpass', sans-serif;
}

.divider {
  height: 1px;
  background-color: var(--light-grey);
}

.toggle-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;

  .toggle-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;

    .toggle-name {
      font-family: 'Overpass', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--white);
    }

    .toggle-desc {
      font-family: 'Overpass', sans-serif;
      font-size: 0.78rem;
      color: var(--dark-white);
      opacity: 0.7;
      line-height: 1.5;
    }
  }
}

// Toggle switch
.toggle-switch {
  flex-shrink: 0;
  width: 2.8rem;
  height: 1.5rem;
  border-radius: 999px;
  background-color: var(--light-grey);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transition: background-color 0.18s;
  cursor: pointer;
  margin-top: 2px;

  &.active {
    background-color: var(--tf-green);
  }

  .toggle-knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 1.05rem;
    height: 1.05rem;
    border-radius: 50%;
    background-color: var(--white);
    transition: transform 0.18s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  &.active .toggle-knob {
    transform: translateX(1.3rem);
    background-color: var(--pure-black);
  }
}
</style>
