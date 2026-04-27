<!-- Rover connection, input device configuration, and controller bindings -->
<script setup lang="ts">
import ConnectionSettings from '@/components/settings/ConnectionSettings.vue';
import ControllerIcon from 'vue-material-design-icons/ControllerClassic.vue';
import KeyboardIcon from 'vue-material-design-icons/Keyboard.vue';
</script>

<template>
  <div class="settings-page">
    <header class="settings-header">
      <h1>Settings</h1>
      <p>Configure rover connection, input devices, and controller bindings.</p>
    </header>

    <div class="settings-grid">
      <!-- Rover Connection — primary setting -->
      <section class="settings-card settings-card--primary">
        <ConnectionSettings />
      </section>

      <!-- Input Device -->
      <section class="settings-card">
        <div class="placeholder-panel">
          <component :is="ControllerIcon" class="placeholder-icon" />
          <h2>Input Device</h2>
          <p class="placeholder-desc">
            Select and configure input devices — gamepad, keyboard, or custom bindings.
          </p>
        </div>
      </section>

      <!-- Key Bindings -->
      <section class="settings-card">
        <div class="placeholder-panel">
          <component :is="KeyboardIcon" class="placeholder-icon" />
          <h2>Controller Bindings</h2>
          <p class="placeholder-desc">
            Remap gamepad and keyboard bindings for driving, arm control, and camera actions.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-page {
  height: calc(100vh - var(--nav-bar-size));
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  gap: 1.5rem;
}

.settings-header {
  h1 {
    font-size: 2rem;
    color: var(--white);
    margin-bottom: 0.25rem;
  }

  p {
    color: var(--dark-white);
    font-size: 0.95rem;
  }
}

.settings-grid {
  display: grid;
  grid-template-columns: 22rem 1fr 1fr;
  grid-template-rows: auto;
  gap: 1rem;
  align-items: start;
}

.settings-card {
  background-color: var(--component-background);
  border: 1px solid var(--light-grey);
  border-top: 2px solid var(--tf-green-mid);
  border-radius: 4px;
  padding: 1.25rem 1.5rem;
  min-height: 18rem;

  &--primary {
    // Connection card gets a slightly more prominent border
    border-top-color: var(--tf-green);
  }
}
</style>
