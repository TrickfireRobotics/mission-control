<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { useSettingsStore } from '@/store/settingsStore';
import { useRoslibStore } from '@/store/roslibStore';

const settings = useSettingsStore();
const roslib = useRoslibStore();

const connectionInput = useTemplateRef<HTMLSelectElement>('ws-host');

/**
 * Named presets for common rover connection targets.
 * Stored address format: ws://<host>:<port>
 */
const connectionPresets: Record<string, string> = {
  'Rover — Competition (10.0.0.10)': 'ws://10.0.0.10:9090',
  'Rover — Local Network (192.168.0.146)': 'ws://192.168.0.146:9090',
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

// ── Auto-discovery ──────────────────────────────────────────────────────────

const isScanning = ref(false);
const scanStatus = ref<string | null>(null);
const scanSuccess = ref(false);

/**
 * Attempts to open a WebSocket connection to the given URL.
 * Resolves true if the connection opens within `timeoutMs`, false otherwise.
 */
function tryConnect(url: string, timeoutMs: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    let ws: WebSocket;

    try {
      ws = new WebSocket(url);
    } catch {
      resolve(false);
      return;
    }

    const timer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        try {
          ws.close();
        } catch {}
        resolve(false);
      }
    }, timeoutMs);

    ws.onopen = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        try {
          ws.close();
        } catch {}
        resolve(true);
      }
    };

    ws.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(false);
      }
    };
  });
}

/**
 * Scans known network addresses for an active rover ROS bridge.
 * Tries each candidate in order and selects the first one that responds.
 */
async function scanForRover() {
  if (isScanning.value) return;

  isScanning.value = true;
  scanSuccess.value = false;
  scanStatus.value = 'Scanning network for rover…';

  // Candidates in priority order (presets first, then fallbacks)
  const candidates = [
    ...Object.values(connectionPresets),
    'ws://rover.local:9090', // mDNS hostname
    'ws://192.168.0.145:9090', // alternate local
    'ws://192.168.1.10:9090', // another common subnet
  ];

  // Deduplicate while preserving order
  const unique = [...new Set(candidates)];

  for (const url of unique) {
    const host = url.replace(/^wss?:\/\//, '').replace(/\/.*$/, '');
    scanStatus.value = `Trying ${host}…`;

    const found = await tryConnect(url, 1500);

    if (found) {
      settings.updateSettings({ websocketAddress: url });
      scanStatus.value = `Found rover at ${host}`;
      scanSuccess.value = true;
      isScanning.value = false;
      return;
    }
  }

  scanStatus.value = 'No rover found — check your network connection.';
  isScanning.value = false;
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
      <select id="ws-host" ref="ws-host" @change="updateSelectedIdx(connectionInput!.selectedIndex)">
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

    <!-- Auto-discovery -->
    <div class="discovery-section">
      <button
        class="discover-btn"
        :disabled="isScanning"
        :title="'Scan common network addresses for an active rover ROS bridge'"
        @click="scanForRover"
      >
        <span v-if="isScanning" class="spinner" />
        {{ isScanning ? 'Scanning…' : 'Auto-Discover Rover' }}
      </button>

      <p
        v-if="scanStatus"
        class="scan-status"
        :class="{ 'scan-success': scanSuccess, 'scan-fail': !scanSuccess && !isScanning && scanStatus }"
      >
        {{ scanStatus }}
      </p>
    </div>

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

.discovery-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.discover-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  padding: 9px 14px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid var(--pure-black);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.scan-status {
  font-size: 0.82rem;
  text-align: center;
  color: var(--dark-white);
  font-family: 'Overpass', sans-serif;
  padding: 0.25rem;

  &.scan-success {
    color: var(--tf-green);
  }

  &.scan-fail {
    color: var(--error);
  }
}
</style>
