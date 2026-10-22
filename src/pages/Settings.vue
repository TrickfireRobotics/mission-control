<!-- any configuration like what input device (controller/keyboard) and change controller bindings -->
<script setup lang="ts">
import ConnectionSettings from '@/components/settings/ConnectionSettings.vue';
import ControllerConfig from '@/components/settings/ControllerConfig.vue';
</script>

<template>
  <div class="two-by-three-grid-page">
    <ConnectionSettings />
    <ControllerConfig />
  </div>
</template>

<style lang="scss" scoped></style>
