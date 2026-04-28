<script setup lang="ts">
import { computed, ref, watch, useTemplateRef } from 'vue';
import { useSettingsStore } from '@/store/settingsStore';
import { useRoslibStore } from '@/store/roslibStore';

const settings = useSettingsStore();
const roslib = useRoslibStore();

// Keeps the button grey for a short cooldown after a disconnect so brief
// connection blips don't make it flash back to the active "Retry" state.
const RETRY_COOLDOWN_MS = 1500;
const cooldownActive = ref(false);
let cooldownTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => roslib.isWebSocketConnected,
  (connected) => {
    if (!connected) {
      // Start cooldown — keep showing as connected briefly after disconnect.
      cooldownActive.value = true;
      if (cooldownTimer) clearTimeout(cooldownTimer);
      cooldownTimer = setTimeout(() => {
        cooldownActive.value = false;
      }, RETRY_COOLDOWN_MS);
    } else {
      // Genuinely reconnected — cancel any pending cooldown immediately.
      if (cooldownTimer) clearTimeout(cooldownTimer);
      cooldownActive.value = false;
    }
  },
);

// True while connected OR during the brief cooldown after a disconnect.
const showAsConnected = computed(() => roslib.isWebSocketConnected || cooldownActive.value);

const connectionInput = useTemplateRef<HTMLSelectElement>('ws-host');

/**
 * Named presets for common rover connection targets.
 * Stored address format: ws://<host>:<port>
 */
const connectionPresets: Record<string, string> = {
  'Rover - Competition (10.0.0.10)': 'ws://10.0.0.10:9090',
  'Rover - Local Network (192.168.0.146)': 'ws://192.168.0.146:9090',
  'Development (localhost)': 'ws://localhost:9090',
};

const presetNames = Object.keys(connectionPresets);

// Custom input index is after all presets
const customIdx = presetNames.length;

const currentIdx = computed(() => {
  let idx = Object.values(connectionPresets).indexOf(settings.settings.websocketAddress);
  if (idx === -1) idx = customIdx;
  return idx;
});

function updateSelectedIdx(newIdx: number) {
  if (newIdx === customIdx) {
    settings.updateSettings({ websocketAddress: 'ws://' });
  } else {
    settings.updateSettings({ websocketAddress: connectionPresets[presetNames[newIdx]] });
  }
}

function updateCustomAddress(newAddress: string) {
  if (currentIdx.value !== customIdx) return;
  settings.updateSettings({ websocketAddress: newAddress });
}
</script>

<template>
  <div class="connection-settings">
    <div class="section-header">
      <h2>Rover Connection</h2>
      <span
        class="status-badge"
        :class="roslib.isWebSocketConnected ? 'badge-connected' : 'badge-disconnected'"
      >
        {{ roslib.isWebSocketConnected ? 'Connected' : 'Disconnected' }}
      </span>
    </div>

    <p class="section-desc">
      The rover runs a <strong>rosbridge WebSocket server</strong> on port 9090. Select a preset or
      enter a custom address.
    </p>

    <div class="field-group">
      <label class="field-label" for="ws-host">Network Preset</label>
      <select
        id="ws-host"
        ref="ws-host"
        @change="updateSelectedIdx(connectionInput!.selectedIndex)"
      >
        <option
          v-for="(presetName, idx) in presetNames"
          :key="presetName"
          :selected="currentIdx === idx"
        >
          {{ presetName }}
        </option>
        <option :selected="currentIdx === customIdx">Custom Address…</option>
      </select>
    </div>

    <div v-if="currentIdx === customIdx" class="field-group">
      <label class="field-label" for="ws-custom">Custom WebSocket Address</label>
      <input
        id="ws-custom"
        type="url"
        placeholder="ws://192.168.x.x:9090"
        :value="settings.settings.websocketAddress"
        @change="(e: Event) => updateCustomAddress((e.target as HTMLInputElement).value)"
      />
    </div>

    <div class="address-display">
      <span class="address-label">Current:</span>
      <code class="address-value">{{ settings.settings.websocketAddress }}</code>
    </div>

    <button
      class="retry-btn"
      :class="{ 'retry-btn--connected': showAsConnected }"
      :disabled="showAsConnected"
      title="Retry WebSocket connection to rover"
      @click="roslib.reconnect()"
    >
      {{ showAsConnected ? 'Connected' : 'Retry Connection' }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.connection-settings {
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

.section-desc {
  font-size: 0.85rem;
  color: var(--dark-white);
  line-height: 1.5;

  strong {
    color: var(--white);
    font-weight: 700;
  }
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.field-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--dark-white);
}

select,
input[type='url'] {
  width: 100%;
}

.address-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background-color: var(--dark-grey);
  border: 1px solid var(--light-grey);
  border-radius: 4px;

  .address-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--dark-white);
    opacity: 0.7;
  }

  .address-value {
    font-family: 'Overpass', monospace;
    font-size: 0.82rem;
    color: var(--tf-green);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.retry-btn {
  width: 100%;
  padding: 9px 14px;

  &--connected {
    // Visually muted — clearly not interactive
    opacity: 0.35;
    cursor: default;
    pointer-events: none;
    // Override the global green button style with a neutral look
    background-color: var(--light-grey) !important;
    color: var(--dark-white) !important;
    border-color: transparent !important;
  }
}
</style>
