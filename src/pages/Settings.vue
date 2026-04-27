<!-- Rover connection, input device configuration, and controller bindings -->
<script setup lang="ts">
import ConnectionSettings from '@/components/settings/ConnectionSettings.vue';
import ControllerConfig from '@/components/settings/ControllerConfig.vue';
import ControllerMonitor from '@/components/settings/ControllerMonitor.vue';
</script>

<template>
  <div class="settings-page">
    <header class="settings-header">
      <h1>Settings</h1>
    </header>

    <div class="top-row">
      <section class="settings-card settings-card--connection">
        <ConnectionSettings />
      </section>
      <section class="settings-card">
        <ControllerConfig />
      </section>
    </div>

    <section class="settings-card settings-card--monitor">
      <ControllerMonitor />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.settings-page {
  height: calc(100vh - var(--nav-bar-size));
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  gap: 0.75rem;
}

.settings-header {
  h1 {
    font-size: 1.6rem;
    color: var(--white);
  }
}

.top-row {
  display: grid;
  grid-template-columns: 22rem 1fr;
  gap: 0.75rem;
  align-items: start;
}

.settings-card {
  background-color: var(--component-background);
  border: 1px solid var(--light-grey);
  border-top: 2px solid var(--tf-green-mid);
  border-radius: 4px;
  padding: 1.25rem 1.5rem;

  &--connection {
    border-top-color: var(--tf-green);
  }

  &--monitor {
    flex: 1; // take remaining vertical space
    min-height: 0;
    overflow-y: auto;
  }
}
</style>
