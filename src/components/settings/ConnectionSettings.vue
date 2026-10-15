<script setup lang="ts">
import { computed, ref, watch, useTemplateRef } from 'vue';
import { useSettingsStore } from '@/store/settingsStore';
import { useRoslibStore } from '@/store/roslibStore';

const settings = useSettingsStore();
const roslib = useRoslibStore();

// keeps the button showing "Connected" for a short cooldown after a disconnect so
// brief connection blips don't flash it back to the active "Retry" state
const RETRY_COOLDOWN_MS = 1500;
const cooldownActive = ref(false);
let cooldownTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => roslib.isWebSocketConnected,
  (connected) => {
    if (cooldownTimer) clearTimeout(cooldownTimer);

    if (!connected) {
      cooldownActive.value = true;
      cooldownTimer = setTimeout(() => {
        cooldownActive.value = false;
      }, RETRY_COOLDOWN_MS);
    } else {
      cooldownActive.value = false;
    }
  },
);

const showAsConnected = computed(() => roslib.isWebSocketConnected || cooldownActive.value);

const connectionInput = useTemplateRef<HTMLSelectElement>('ws-host');

const connectionTypes: Record<string, string> = {
  Viator: 'ws://192.168.0.112:9090',
  Apollo: 'ws://192.168.0.111:9090',
  Simulation: 'ws://localhost:9090',
};

const connectionNames = Object.keys(connectionTypes);

// Custom input is after all the valid, predefined indices.
const connectionCustomInputIdx = connectionNames.length;

const currentConnectionIdx = computed(() => {
  let idx = Object.values(connectionTypes).indexOf(settings.settings.websocketAddress);
  // Go to custom input if it isn't in range.
  if (idx === -1) idx = connectionCustomInputIdx;

  return idx;
});

function updateSelectedIdx(newIdx: number) {
  if (newIdx === connectionCustomInputIdx) {
    settings.updateSettings({
      websocketAddress: 'ws://',
    });
  } else {
    settings.updateSettings({
      websocketAddress: connectionTypes[connectionNames[newIdx]],
    });
  }
}

function updateCustomWebsocket(newAddress: string) {
  // Ensure that the custom field is selected.
  if (currentConnectionIdx.value !== connectionCustomInputIdx) return;

  settings.updateSettings({
    websocketAddress: newAddress,
  });
}
</script>

<template>
  <div class="container">
    <h2>Websocket Host</h2>
    <select ref="ws-host" @change="updateSelectedIdx(connectionInput!.selectedIndex)">
      <option
        v-for="(connectionName, idx) in connectionNames"
        :key="connectionName"
        :selected="currentConnectionIdx === idx"
      >
        {{ connectionName }}
      </option>
      <option :selected="currentConnectionIdx === connectionCustomInputIdx">Other</option>
    </select>
    <input
      v-if="currentConnectionIdx === connectionCustomInputIdx"
      placeholder="Websocket Address"
      :value="settings.settings.websocketAddress"
      @change="(e: Event) => updateCustomWebsocket((e.target as HTMLInputElement).value)"
    />
    <button
      class="retry-button"
      :disabled="showAsConnected"
      title="Retry WebSocket connection to rover"
      @click="roslib.reconnect()"
    >
      {{ showAsConnected ? 'Connected' : 'Retry Connection' }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.retry-button {
  margin-top: 0.5rem;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
}
</style>
