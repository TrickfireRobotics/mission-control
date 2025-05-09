<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useSettingsStore } from '@/store/settingsStore';

const settings = useSettingsStore();

const connectionInput = useTemplateRef<HTMLSelectElement>('ws-host');

const connectionTypes: Record<string, string> = {
  'Rover Production': 'ws://10.0.0.10:9090',
  'Rover Local': 'ws://192.168.0.145:9090',
  'Local Development': 'ws://localhost:9090',
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
  </div>
</template>

<style lang="scss" scoped>
.container {
  /*width: 100%;
    height: 100%;*/
  width: 90%;
  height: 90%;
  background-color: var(--component-background);
  border-radius: 1em;
  margin: 10px;
  padding: 10px;
}
</style>
