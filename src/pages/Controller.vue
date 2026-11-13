<script setup lang="ts">
import { onActivated, onDeactivated } from 'vue';
import { useControllerStore } from '@/store/controllerStore';
import { gamepadNames, joystickNames } from '@/lib/controller/controllerBindings';

const controller = useControllerStore();

// Pages are kept alive by App.vue's <KeepAlive>, so onMounted/onUnmounted only fire
// once ever - onActivated/onDeactivated fire every time this tab is switched to/away from.
onActivated(() => {
  controller.setTestTabFocused(true);
});
onDeactivated(() => {
  controller.setTestTabFocused(false);
});

const buttonNames = Object.values(gamepadNames);
const axisNames = Object.values(joystickNames);
</script>

<template>
  <div class="container">
    <h1>Controller Test</h1>
    <p class="mute-banner">
      Gamepad input is shown live below but is <strong>not</strong> sent to the rover while this tab is open.
    </p>

    <div class="status-row">
      <span
        >Gamepad:
        <strong :class="{ green: controller.isGamepadConnected, red: !controller.isGamepadConnected }">{{
          controller.isGamepadConnected ? 'Connected' : 'Disconnected'
        }}</strong></span
      >
      <span
        >Mode: <strong>{{ controller.gamePadMode }}</strong></span
      >
    </div>

    <div class="values-grid">
      <section>
        <h2>Axes</h2>
        <div v-for="name in axisNames" :key="name" class="value-row">
          <span class="name">{{ name }}</span>
          <span class="value">{{ (controller.liveInputValues[name] ?? 0).toFixed(2) }}</span>
        </div>
      </section>

      <section>
        <h2>Buttons</h2>
        <div
          v-for="name in buttonNames"
          :key="name"
          class="value-row"
          :class="{ active: (controller.liveInputValues[name] ?? 0) > 0 }"
        >
          <span class="name">{{ name }}</span>
          <span class="value">{{ (controller.liveInputValues[name] ?? 0).toFixed(2) }}</span>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.mute-banner {
  opacity: 0.8;
}

.status-row {
  display: flex;
  gap: 1.5rem;
}

.green {
  color: var(--correct);
}
.red {
  color: var(--error);
}

.values-grid {
  display: flex;
  gap: 2rem;
}

.value-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  min-width: 14rem;
  padding: 0.15rem 0;

  &.active {
    color: hsl(120, 100%, 65%);
    font-weight: 600;
  }
}
</style>
