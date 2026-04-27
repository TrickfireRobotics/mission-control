<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '@/store/settingsStore';
import { useControllerStore } from '@/store/controllerStore';
import { gamepadNames, joystickNames } from '@/lib/controller/controllerBindings';
import drivebaseBindings from '@/lib/controller/drivebaseAndArmBinding.json';

const settings = useSettingsStore();
const controller = useControllerStore();

// ── Gamepad polling ───────────────────────────────────────────────────────────
interface ButtonState {
  pressed: boolean;
  value: number;
}
interface GamepadSnapshot {
  id: string;
  axes: number[];
  buttons: ButtonState[];
}

const snapshot = ref<GamepadSnapshot | null>(null);
let rafId: number | null = null;

// Xbox triggers report 0.5 before first touch — ignore until the value deviates.
const triggerInit: Record<number, number | null> = { 6: null, 7: null };
const triggerReady: Record<number, boolean> = { 6: false, 7: false };

function normaliseTrigger(idx: number, raw: number): number {
  if (triggerInit[idx] === null) {
    triggerInit[idx] = raw;
  } else if (!triggerReady[idx] && Math.abs(raw - triggerInit[idx]!) > 0.04) {
    triggerReady[idx] = true;
  }
  return triggerReady[idx] ? raw : 0;
}

function poll() {
  const pads = navigator.getGamepads();
  for (const pad of pads) {
    if (pad) {
      const buttons = Array.from(pad.buttons, (b) => ({ pressed: b.pressed, value: b.value }));
      for (const idx of [6, 7]) {
        const clean = normaliseTrigger(idx, buttons[idx].value);
        buttons[idx] = { pressed: clean > 0.5, value: clean };
      }
      snapshot.value = { id: pad.id, axes: Array.from(pad.axes), buttons };
      rafId = requestAnimationFrame(poll);
      return;
    }
  }
  snapshot.value = null;
  rafId = requestAnimationFrame(poll);
}

onMounted(() => {
  rafId = requestAnimationFrame(poll);
});
onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function btnPressed(idx: number) {
  return snapshot.value?.buttons[idx]?.pressed ?? false;
}
function btnValue(idx: number) {
  return snapshot.value?.buttons[idx]?.value ?? 0;
}
function axisValue(idx: number) {
  return snapshot.value?.axes[idx] ?? 0;
}
function fmt(v: number) {
  return v.toFixed(2);
}
function stickDotStyle(xIdx: number, yIdx: number) {
  return {
    left: `${50 + axisValue(xIdx) * 40}%`,
    top: `${50 + axisValue(yIdx) * 40}%`,
  };
}

// ── Settings ──────────────────────────────────────────────────────────────────
const blockHorizontal = computed({
  get: () => settings.settings.controller.tankDriveBlockHorizontal,
  set: (v) => settings.updateControllerSettings({ tankDriveBlockHorizontal: v }),
});

// ── Bindings table ────────────────────────────────────────────────────────────
const buttonByName = Object.fromEntries(
  Object.entries(gamepadNames).map(([i, n]) => [n, Number(i)]),
);
const axisByName = Object.fromEntries(
  Object.entries(joystickNames).map(([i, n]) => [n, Number(i)]),
);

const bindingRows = computed(() =>
  drivebaseBindings.bindings.map((b) => {
    const isAxis = b.type === 'joystick';
    const idx = isAxis ? axisByName[b.name] : buttonByName[b.name];
    const live = isAxis ? axisValue(idx) : btnValue(idx);
    return { name: b.name, type: b.type, topic: b.publisher || null, live, isAxis };
  }),
);
</script>

<template>
  <div class="ctrl-page">
    <!-- ── Left column ──────────────────────────────────────────────────────── -->
    <div class="left-col">

      <!-- Box 1: Device info -->
      <section class="card">
        <div class="section-header">
          <h2>Input Device</h2>
          <span
            class="badge"
            :class="controller.isGamepadConnected ? 'badge--on' : 'badge--off'"
          >
            {{ controller.isGamepadConnected ? 'Connected' : 'Not Connected' }}
          </span>
        </div>
        <div v-if="snapshot" class="device-row">
          <span class="device-label">Gamepad</span>
          <span class="device-value">{{ snapshot.id }}</span>
        </div>
        <p v-else class="hint-text">
          No gamepad detected. Press any button to wake it up.
        </p>
      </section>

      <!-- Box 2: Controller visualiser -->
      <section class="card card--viz">
        <div v-if="snapshot" class="ctrl-viz">

          <!-- Row 1: Triggers + Bumpers + Centre buttons -->
          <div class="top-row">
            <!-- LT -->
            <div class="trigger-group">
              <span class="trig-label">LT</span>
              <div class="trig-track">
                <div class="trig-fill" :style="{ width: `${btnValue(6) * 100}%` }" />
              </div>
              <span class="trig-val">{{ fmt(btnValue(6)) }}</span>
            </div>
            <div class="bumper-btn" :class="{ active: btnPressed(4) }">LB</div>

            <div class="centre-top">
              <div class="centre-btn" :class="{ active: btnPressed(8) }">BACK</div>
              <div class="centre-btn xbox-btn" :class="{ active: btnPressed(16) }">⊙</div>
              <div class="centre-btn" :class="{ active: btnPressed(9) }">START</div>
            </div>

            <div class="bumper-btn" :class="{ active: btnPressed(5) }">RB</div>
            <!-- RT -->
            <div class="trigger-group trigger-group--right">
              <span class="trig-val">{{ fmt(btnValue(7)) }}</span>
              <div class="trig-track">
                <div class="trig-fill" :style="{ width: `${btnValue(7) * 100}%` }" />
              </div>
              <span class="trig-label">RT</span>
            </div>
          </div>

          <!-- Row 2: Sticks / D-Pad / L3+R3 / Face -->
          <div class="bottom-row">
            <!-- Left stick -->
            <div class="stick-group">
              <div class="stick-pad">
                <div class="stick-ch-h" />
                <div class="stick-ch-v" />
                <div class="stick-dot" :style="stickDotStyle(0, 1)" />
              </div>
              <div class="stick-vals">
                <span>X <em>{{ fmt(axisValue(0)) }}</em></span>
                <span>Y <em>{{ fmt(axisValue(1)) }}</em></span>
              </div>
            </div>

            <!-- D-Pad -->
            <div class="dpad">
              <div class="dpad-row">
                <div class="dpad-btn" :class="{ active: btnPressed(12) }">▲</div>
              </div>
              <div class="dpad-row">
                <div class="dpad-btn" :class="{ active: btnPressed(14) }">◄</div>
                <div class="dpad-gap" />
                <div class="dpad-btn" :class="{ active: btnPressed(15) }">►</div>
              </div>
              <div class="dpad-row">
                <div class="dpad-btn" :class="{ active: btnPressed(13) }">▼</div>
              </div>
            </div>

            <!-- L3 / R3 -->
            <div class="l3r3">
              <div class="l3r3-btn" :class="{ active: btnPressed(10) }">L3</div>
              <div class="l3r3-btn" :class="{ active: btnPressed(11) }">R3</div>
            </div>

            <!-- Face buttons -->
            <div class="face">
              <div class="face-row">
                <div
                  class="face-btn"
                  :class="{ active: btnPressed(3) }"
                  :style="btnPressed(3) ? { background: '#f5d142', color: '#000', borderColor: '#f5d142' } : {}"
                >Y</div>
              </div>
              <div class="face-row">
                <div
                  class="face-btn"
                  :class="{ active: btnPressed(2) }"
                  :style="btnPressed(2) ? { background: '#5b9bd5', color: '#000', borderColor: '#5b9bd5' } : {}"
                >X</div>
                <div class="face-gap" />
                <div
                  class="face-btn"
                  :class="{ active: btnPressed(1) }"
                  :style="btnPressed(1) ? { background: '#e8514a', color: '#fff', borderColor: '#e8514a' } : {}"
                >B</div>
              </div>
              <div class="face-row">
                <div
                  class="face-btn"
                  :class="{ active: btnPressed(0) }"
                  :style="btnPressed(0) ? { background: '#4cce6e', color: '#000', borderColor: '#4cce6e' } : {}"
                >A</div>
              </div>
            </div>

            <!-- Right stick -->
            <div class="stick-group">
              <div class="stick-pad">
                <div class="stick-ch-h" />
                <div class="stick-ch-v" />
                <div class="stick-dot" :style="stickDotStyle(2, 3)" />
              </div>
              <div class="stick-vals">
                <span>X <em>{{ fmt(axisValue(2)) }}</em></span>
                <span>Y <em>{{ fmt(axisValue(3)) }}</em></span>
              </div>
            </div>
          </div>
        </div>

        <p v-else class="hint-text">
          Press any button on your controller to activate it.
        </p>
      </section>

      <!-- Box 3: Drive settings -->
      <section class="card">
        <h2>Driving Options</h2>
        <label class="toggle-row">
          <div class="toggle-info">
            <span class="toggle-name">Block horizontal input</span>
            <span class="toggle-desc">
              Zeroes out both stick X axes in tank drive to prevent accidental lateral drift.
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
      </section>
    </div>

    <!-- ── Right column: Bindings ───────────────────────────────────────────── -->
    <div class="right-col">
      <section class="card card--bindings">
        <h2 class="bindings-title">Active Bindings</h2>
        <div class="table-wrap">
          <table class="bindings-table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Type</th>
                <th>ROS Topic</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in bindingRows"
                :key="row.name"
                :class="{ 'row-active': Math.abs(row.live) > 0.05 }"
              >
                <td class="col-name">{{ row.name }}</td>
                <td class="col-type">{{ row.type }}</td>
                <td class="col-topic">
                  <code v-if="row.topic">{{ row.topic }}</code>
                  <span v-else class="unbound">—</span>
                </td>
                <td class="col-value">
                  <template v-if="row.isAxis">
                    <div class="bar-track bar-track--axis">
                      <div class="bar-neg" :style="{ width: `${Math.max(0, -row.live) * 50}%` }" />
                      <div class="bar-centre" />
                      <div class="bar-pos" :style="{ width: `${Math.max(0, row.live) * 50}%` }" />
                    </div>
                  </template>
                  <template v-else>
                    <div class="bar-track">
                      <div class="bar-pos bar-pos--full" :style="{ width: `${row.live * 100}%` }" />
                    </div>
                  </template>
                  <span class="val-num">{{ fmt(row.live) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// ── Page shell ────────────────────────────────────────────────────────────────
.ctrl-page {
  height: calc(100vh - var(--nav-bar-size));
  display: grid;
  grid-template-columns: 22rem 1fr;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  overflow: hidden;
}

// ── Columns ───────────────────────────────────────────────────────────────────
.left-col {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  overflow: hidden;
  // Don't stretch cards to fill — let them be auto height
  align-self: start;
}

.right-col {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
}

// ── Shared card ───────────────────────────────────────────────────────────────
.card {
  background-color: var(--component-background);
  border: 1px solid var(--light-grey);
  border-top: 2px solid var(--tf-green-mid);
  border-radius: 4px;
  padding: 1rem 1.25rem;

  h2 {
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }

  &--viz {
    h2 { margin-bottom: 0.5rem; }
  }

  &--bindings {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    border-top-color: var(--tf-green);
  }
}

// ── Device card ───────────────────────────────────────────────────────────────
.section-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;

  h2 { margin-bottom: 0; }
}

.badge {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 1px 7px;
  border-radius: 3px;

  &--on {
    background-color: var(--tf-green-dim);
    color: var(--tf-green);
    border: 1px solid var(--tf-green-mid);
  }
  &--off {
    background-color: rgba(229, 0, 0, 0.12);
    color: var(--error);
    border: 1px solid rgba(229, 0, 0, 0.35);
  }
}

.device-row {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0.4rem 0.65rem;
  background-color: var(--dark-grey);
  border: 1px solid var(--light-grey);
  border-radius: 4px;

  .device-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--dark-white);
    opacity: 0.55;
  }

  .device-value {
    font-family: 'Overpass', sans-serif;
    font-size: 0.78rem;
    color: var(--white);
    word-break: break-all;
  }
}

.hint-text {
  font-family: 'Overpass', sans-serif;
  font-size: 0.8rem;
  color: var(--dark-white);
  opacity: 0.55;
  font-style: italic;
}

// ── Shared button token ───────────────────────────────────────────────────────
%btn {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--dark-white);
  background-color: #1e1e1e;
  border: 1px solid var(--light-grey);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.05s,
    color 0.05s,
    border-color 0.05s;
  user-select: none;

  &.active {
    background-color: var(--tf-green);
    color: var(--pure-black);
    border-color: var(--tf-green);
  }
}

// ── Controller visualiser ─────────────────────────────────────────────────────
.ctrl-viz {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

// Top row: triggers + bumpers + centre
.top-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.trigger-group {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex: 1;

  &--right {
    flex-direction: row-reverse;
  }

  .trig-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--dark-white);
    opacity: 0.55;
    flex-shrink: 0;
    width: 1.2rem;
    text-align: center;
  }

  .trig-track {
    flex: 1;
    height: 7px;
    background-color: #1e1e1e;
    border: 1px solid var(--light-grey);
    border-radius: 3px;
    overflow: hidden;

    .trig-fill {
      height: 100%;
      background-color: var(--tf-green);
      border-radius: 3px;
    }
  }

  .trig-val {
    font-family: 'Overpass', monospace;
    font-size: 0.6rem;
    color: var(--dark-white);
    opacity: 0.6;
    flex-shrink: 0;
    width: 2rem;
    text-align: right;
  }
}

.bumper-btn {
  @extend %btn;
  height: 1.4rem;
  width: 2.8rem;
  flex-shrink: 0;
}

.centre-top {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.centre-btn {
  @extend %btn;
  height: 1.3rem;
  padding: 0 0.4rem;
  font-size: 0.58rem;
  border-radius: 3px;

  &.xbox-btn {
    width: 1.3rem;
    font-size: 0.75rem;
    padding: 0;
  }
}

// Bottom row
.bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

// Stick
.stick-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stick-pad {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: #1a1a1a;
  border: 2px solid var(--light-grey);
  position: relative;
  overflow: hidden;

  .stick-ch-h,
  .stick-ch-v {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.08);
  }

  .stick-ch-h {
    width: 100%;
    height: 1px;
    top: 50%;
  }

  .stick-ch-v {
    height: 100%;
    width: 1px;
    left: 50%;
  }

  .stick-dot {
    position: absolute;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: var(--tf-green);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 5px rgba(0, 254, 0, 0.45);
  }
}

.stick-vals {
  display: flex;
  gap: 0.45rem;
  font-family: 'Overpass', monospace;
  font-size: 0.6rem;
  color: var(--dark-white);
  opacity: 0.55;

  em {
    font-style: normal;
    color: var(--white);
    opacity: 1;
  }
}

// D-Pad
.dpad {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.dpad-row {
  display: flex;
  gap: 2px;
  justify-content: center;
}

.dpad-btn {
  @extend %btn;
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 3px;
  font-size: 0.65rem;
}

.dpad-gap {
  width: 1.55rem;
  height: 1.55rem;
}

// L3 / R3
.l3r3 {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.l3r3-btn {
  @extend %btn;
  height: 1.3rem;
  padding: 0 0.45rem;
  font-size: 0.58rem;
}

// Face buttons
.face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.face-row {
  display: flex;
  gap: 2px;
  justify-content: center;
  align-items: center;
}

.face-btn {
  @extend %btn;
  width: 1.55rem;
  height: 1.55rem;
  border-radius: 50%;
  font-size: 0.6rem;
}

.face-gap {
  width: 1.55rem;
  height: 1.55rem;
}

// ── Drive settings ─────────────────────────────────────────────────────────────
.toggle-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  cursor: pointer;

  .toggle-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;

    .toggle-name {
      font-family: 'Overpass', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--white);
    }

    .toggle-desc {
      font-family: 'Overpass', sans-serif;
      font-size: 0.74rem;
      color: var(--dark-white);
      opacity: 0.65;
      line-height: 1.5;
    }
  }
}

.toggle-switch {
  flex-shrink: 0;
  width: 2.6rem;
  height: 1.4rem;
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
    width: 0.95rem;
    height: 0.95rem;
    border-radius: 50%;
    background-color: var(--white);
    transition: transform 0.18s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  &.active .toggle-knob {
    transform: translateX(1.2rem);
    background-color: var(--pure-black);
  }
}

// ── Bindings ──────────────────────────────────────────────────────────────────
.bindings-title {
  flex-shrink: 0;
}

.table-wrap {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-top: 0.4rem;
  scrollbar-width: thin;
  scrollbar-color: var(--light-grey) transparent;
}

.bindings-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;

  th {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.62rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--dark-white);
    opacity: 0.55;
    text-align: left;
    padding: 0.3rem 0.5rem;
    border-bottom: 1px solid var(--light-grey);
    white-space: nowrap;
    position: sticky;
    top: 0;
    background-color: var(--component-background);
    z-index: 1;
  }

  td {
    padding: 0.25rem 0.5rem;
    color: var(--dark-white);
    vertical-align: middle;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  }

  tr.row-active td {
    color: var(--white);
    background-color: rgba(0, 254, 0, 0.04);
  }
}

.col-name {
  font-family: 'Overpass', monospace;
  font-size: 0.75rem;
  white-space: nowrap;
}

.col-type {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.5;
  white-space: nowrap;
}

.col-topic {
  code {
    font-family: 'Overpass', monospace;
    font-size: 0.7rem;
    color: var(--tf-green);
    background-color: rgba(0, 254, 0, 0.07);
    padding: 1px 4px;
    border-radius: 3px;
  }

  .unbound {
    opacity: 0.3;
  }
}

.col-value {
  width: 13rem;
}

.bar-track {
  display: block;
  position: relative;
  height: 6px;
  background-color: #1a1a1a;
  border: 1px solid var(--light-grey);
  border-radius: 3px;
  overflow: hidden;
  width: 9rem;
}

.bar-neg {
  position: absolute;
  right: 50%;
  top: 0;
  height: 100%;
  background-color: var(--accent-pink);
}

.bar-centre {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.25);
}

.bar-pos {
  position: absolute;
  left: 50%;
  top: 0;
  height: 100%;
  background-color: var(--tf-green);

  &--full {
    left: 0;
  }
}

.val-num {
  font-family: 'Overpass', monospace;
  font-size: 0.62rem;
  color: var(--dark-white);
  opacity: 0.65;
  white-space: nowrap;
  display: inline-block;
  width: 2.8rem;
  text-align: right;
  vertical-align: middle;
  margin-left: 0.3rem;
}
</style>
