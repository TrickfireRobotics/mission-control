<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Sparkline from './Sparkline.vue';
import { useTelemetry, type MoteusMotorState } from '@/lib/roslibUtils/telemetry';

// ── Constants ────────────────────────────────────────────────────────────────

const HISTORY_LENGTH = 1200;
const TEMP_HISTORY_LENGTH = 2400;

const VOLTAGE_RANGE = { min: 0, max: 60 };
const CURRENT_RANGE = { min: -10, max: 10 };
const SPEED_RANGE = { min: 0, max: 5 };
const TEMP_RANGE = { min: 0, max: 60 };

// ── Props / emits ────────────────────────────────────────────────────────────

export interface DriveMotorCardProps {
  displayName: string;
  /** CAN FD bus ID — used to filter incoming motor array. */
  dataSourceParameter: number;
  motorType: string;
}

const props = defineProps<DriveMotorCardProps>();

const emit = defineEmits<{
  /** Fired every time a temperature sample arrives so the parent schematic can colour-code wheels. */
  tempUpdate: [canId: number, temp: number];
}>();

// ── Rolling sample buffers ────────────────────────────────────────────────────

const voltageBuffer = ref<number[]>([]);
const currentBuffer = ref<number[]>([]);
const velocityBuffer = ref<number[]>([]);
const tempBuffer = ref<number[]>([]);

// ── Latest values ─────────────────────────────────────────────────────────────

const voltage = ref<number | null>(null);
const current = ref<number | null>(null);
const velocity = ref<number | null>(null);
const temperature = ref<number | null>(null);

// ── Peak tracking ─────────────────────────────────────────────────────────────

const peakVoltage = ref<number | null>(null);
const peakCurrent = ref<number | null>(null);

function resetPeaks() {
  peakVoltage.value = null;
  peakCurrent.value = null;
}

// ── Temperature severity ──────────────────────────────────────────────────────

const tempState = computed<'normal' | 'warn' | 'critical'>(() => {
  const t = temperature.value;
  if (t == null) return 'normal';
  if (t > 80) return 'critical';
  if (t > 60) return 'warn';
  return 'normal';
});

const tempSparkColor = computed(() => {
  if (tempState.value === 'critical') return '#ef4444';
  if (tempState.value === 'warn') return '#f59e0b';
  return 'var(--tf-green)';
});

const tempValueColor = computed(() => {
  if (tempState.value === 'critical') return '#ef4444';
  if (tempState.value === 'warn') return '#f59e0b';
  return 'var(--tf-green)';
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(v: number | null, decimals = 1): string {
  if (v == null) return '—';
  return v.toFixed(decimals);
}

/** Push a sample into a rolling buffer, capped at BUFFER length. */
function pushSample(buf: number[], val: number, limit = HISTORY_LENGTH) {
  buf.push(val);
  if (buf.length > limit) buf.shift();
}

// ── Telemetry subscription ────────────────────────────────────────────────────

const telemetry = useTelemetry();

function dataCallback(motors: MoteusMotorState[]) {
  const motor = motors.find((m) => m.can_id === props.dataSourceParameter);
  if (!motor) return;

  if (motor.input_voltage != null) {
    voltage.value = motor.input_voltage;
    pushSample(voltageBuffer.value, motor.input_voltage);
    if (peakVoltage.value == null || motor.input_voltage > peakVoltage.value) {
      peakVoltage.value = motor.input_voltage;
    }
  }

  if (motor.q_current != null) {
    current.value = motor.q_current;
    pushSample(currentBuffer.value, motor.q_current);
    if (peakCurrent.value == null || motor.q_current > peakCurrent.value) {
      peakCurrent.value = motor.q_current;
    }
  }

  if (motor.velocity != null) {
    velocity.value = motor.velocity;
    pushSample(velocityBuffer.value, motor.velocity);
  }

  if (motor.temperature != null) {
    temperature.value = motor.temperature;
    pushSample(tempBuffer.value, motor.temperature, TEMP_HISTORY_LENGTH);
    emit('tempUpdate', props.dataSourceParameter, motor.temperature);
  }
}

onMounted(() => telemetry.start(dataCallback));
onUnmounted(() => telemetry.stop());
</script>

<template>
  <div class="drive-card" :class="`drive-card--${tempState}`">
    <!-- ── Card header ── -->
    <div class="dc-header">
      <div class="dc-title-block">
        <h3 class="dc-name">{{ displayName }}</h3>
        <span class="dc-badge">{{ motorType }}</span>
      </div>
      <button class="dc-reset-btn" title="Reset peak values" @click="resetPeaks">↺ Peaks</button>
    </div>

    <!-- ── Metrics 2×2 grid ── -->
    <div class="dc-metrics">
      <!-- Voltage -->
      <div class="dc-metric">
        <div class="dc-metric-top">
          <span class="dc-label">Voltage</span>
          <div class="dc-value-row">
            <span class="dc-value">{{ fmt(voltage) }}</span>
            <span class="dc-unit">V</span>
            <span v-if="peakVoltage != null" class="dc-peak">↑{{ fmt(peakVoltage) }}</span>
          </div>
        </div>
        <Sparkline
          :values="voltageBuffer"
          color="var(--tf-green)"
          :height="60"
          :min="VOLTAGE_RANGE.min"
          :max="VOLTAGE_RANGE.max"
        />
      </div>

      <!-- Current -->
      <div class="dc-metric">
        <div class="dc-metric-top">
          <span class="dc-label">Current</span>
          <div class="dc-value-row">
            <span class="dc-value dc-value--blue">{{ fmt(current) }}</span>
            <span class="dc-unit">A</span>
            <span v-if="peakCurrent != null" class="dc-peak">↑{{ fmt(peakCurrent) }}</span>
          </div>
        </div>
        <Sparkline
          :values="currentBuffer"
          color="#60a5fa"
          :height="60"
          :min="CURRENT_RANGE.min"
          :max="CURRENT_RANGE.max"
        />
      </div>

      <!-- Velocity -->
      <div class="dc-metric">
        <div class="dc-metric-top">
          <span class="dc-label">Velocity</span>
          <div class="dc-value-row">
            <span class="dc-value dc-value--purple">{{ fmt(velocity) }}</span>
            <span class="dc-unit">rev/s</span>
          </div>
        </div>
        <Sparkline
          :values="velocityBuffer"
          color="#a78bfa"
          :height="60"
          :min="SPEED_RANGE.min"
          :max="SPEED_RANGE.max"
        />
      </div>

      <!-- Temperature -->
      <div class="dc-metric" :class="`dc-metric--${tempState}`">
        <div class="dc-metric-top">
          <span class="dc-label">Temp</span>
          <div class="dc-value-row">
            <span class="dc-value" :style="{ color: tempValueColor }">{{
              fmt(temperature, 0)
            }}</span>
            <span class="dc-unit">°C</span>
            <span
              v-if="tempState !== 'normal'"
              class="dc-temp-badge"
              :class="`dc-temp-badge--${tempState}`"
            >
              {{ tempState === 'critical' ? 'HOT' : 'WARM' }}
            </span>
          </div>
        </div>
        <Sparkline
          :values="tempBuffer"
          :color="tempSparkColor"
          :height="60"
          :min="TEMP_RANGE.min"
          :max="TEMP_RANGE.max"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// ── Card shell — fills its grid row entirely ──────────────────────────────────

.drive-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.008) 100%),
    var(--grey);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 2px solid rgba(0, 254, 0, 0.28);
  border-radius: 14px;
  padding: 0.7rem 0.72rem 0.66rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.035);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  &--warn {
    border-color: rgba(245, 158, 11, 0.24);
    border-top-color: rgba(245, 158, 11, 0.6);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(245, 158, 11, 0.05) inset;
  }

  &--critical {
    border-color: rgba(239, 68, 68, 0.28);
    border-top-color: rgba(239, 68, 68, 0.72);
    animation: pulse-red 1.6s ease-in-out infinite;
  }
}

@keyframes pulse-red {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(239, 68, 68, 0.15);
  }
  50% {
    box-shadow: 0 0 28px rgba(239, 68, 68, 0.4);
  }
}

// ── Header ────────────────────────────────────────────────────────────────────

.dc-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.65rem;
  flex-shrink: 0;
  padding-bottom: 0.18rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.dc-title-block {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  min-width: 0;
  flex-wrap: wrap;
}

.dc-name {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--white);
  margin: 0;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.08em;
}

.dc-badge {
  display: inline-block;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.52rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--tf-green);
  background: var(--tf-green-dim);
  border: 1px solid var(--tf-green-mid);
  border-radius: 999px;
  padding: 0.08rem 0.38rem;
  flex-shrink: 0;
}

.dc-reset-btn {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.48);
  font-size: 0.52rem;
  padding: 0.12rem 0.42rem;
  border-radius: 999px;
  opacity: 0.9;
  flex-shrink: 0;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  transition: opacity 0.15s, border-color 0.15s, color 0.15s, background 0.15s;

  &:hover {
    opacity: 1;
    border-color: var(--tf-green-mid);
    color: var(--tf-green);
    background: var(--tf-green-dim);
    cursor: pointer;
  }
}

// ── Metrics — 2×2 grid ────────────────────────────────────────────────────────

.dc-metrics {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.45rem;
}

.dc-metric {
  --metric-accent: rgba(0, 254, 0, 0.55);

  position: relative;
  padding: 0.34rem 0.38rem 0.28rem;
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.028) 0%,
      rgba(255, 255, 255, 0.008) 100%
    ),
    var(--component-background);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), inset 0 -1px 0 rgba(0, 0, 0, 0.34),
    0 1px 2px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  gap: 0.14rem;
  min-height: 0;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease,
    background 0.18s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--metric-accent), transparent);
    opacity: 0.85;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 0 rgba(0, 0, 0, 0.4),
      0 8px 16px rgba(0, 0, 0, 0.18);
  }

  &:nth-child(1) {
    --metric-accent: rgba(0, 254, 0, 0.7);
  }

  &:nth-child(2) {
    --metric-accent: rgba(96, 165, 250, 0.75);
  }

  &:nth-child(3) {
    --metric-accent: rgba(167, 139, 250, 0.75);
  }

  // Sparkline grows to fill whatever space remains after the label/value row
  :deep(.sparkline) {
    flex: 1;
    min-height: 0;
  }

  &--warn {
    --metric-accent: rgba(245, 158, 11, 0.8);
    border-color: rgba(245, 158, 11, 0.22);
    background: linear-gradient(
        180deg,
        rgba(245, 158, 11, 0.08) 0%,
        rgba(255, 255, 255, 0.012) 100%
      ),
      var(--component-background);
  }

  &--critical {
    --metric-accent: rgba(239, 68, 68, 0.9);
    border-color: rgba(239, 68, 68, 0.28);
    background: linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, rgba(255, 255, 255, 0.012) 100%),
      var(--component-background);
  }
}

.dc-metric-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.45rem;
  flex-shrink: 0;
}

.dc-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.52rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.34);
  white-space: nowrap;
}

.dc-value-row {
  display: flex;
  align-items: baseline;
  gap: 0.22rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.dc-value {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.96rem;
  font-weight: 600;
  color: var(--tf-green);
  line-height: 1;
  letter-spacing: 0.01em;

  &--blue {
    color: #60a5fa;
  }

  &--purple {
    color: #a78bfa;
  }
}

.dc-unit {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.56rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.46);
}

.dc-peak {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.58rem;
  color: rgba(255, 255, 255, 0.34);
}

.dc-temp-badge {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  padding: 0.08rem 0.34rem;
  border-radius: 999px;
  line-height: 1.4;

  &--warn {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.12);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  &--critical {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
  }
}
</style>
