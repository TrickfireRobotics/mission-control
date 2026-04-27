<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { gamepadNames, joystickNames } from '@/lib/controller/controllerBindings';
import drivebaseBindings from '@/lib/controller/drivebaseAndArmBinding.json';

interface ButtonState { pressed: boolean; value: number }
interface GamepadSnapshot {
  id: string;
  axes: number[];
  buttons: ButtonState[];
}

const snapshot = ref<GamepadSnapshot | null>(null);
let rafId: number | null = null;

// ── Trigger initialisation fix ─────────────────────────────────────────────
// The browser Gamepad API reports Xbox triggers at 0.5 before first touch.
// We record the value on first read and ignore it until the trigger deviates.
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
      // Apply trigger normalisation in place so the snapshot already has clean values
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

onMounted(() => { rafId = requestAnimationFrame(poll); });
onUnmounted(() => { if (rafId !== null) cancelAnimationFrame(rafId); });

// ── Helpers ───────────────────────────────────────────────────────────────
function btnPressed(idx: number) { return snapshot.value?.buttons[idx]?.pressed ?? false; }
function btnValue(idx: number)   { return snapshot.value?.buttons[idx]?.value   ?? 0; }
function axisValue(idx: number)  { return snapshot.value?.axes[idx] ?? 0; }
function fmt(v: number)          { return v.toFixed(2); }

function stickDotStyle(xIdx: number, yIdx: number) {
  return {
    left: `${50 + axisValue(xIdx) * 40}%`,
    top:  `${50 + axisValue(yIdx) * 40}%`,
  };
}

// ── Bindings table ─────────────────────────────────────────────────────────
const buttonByName = Object.fromEntries(
  Object.entries(gamepadNames).map(([i, n]) => [n, Number(i)]),
);
const axisByName = Object.fromEntries(
  Object.entries(joystickNames).map(([i, n]) => [n, Number(i)]),
);

const bindingRows = computed(() =>
  drivebaseBindings.bindings.map((b) => {
    const isAxis = b.type === 'joystick';
    const idx    = isAxis ? axisByName[b.name] : buttonByName[b.name];
    const live   = isAxis ? axisValue(idx) : btnValue(idx);
    return { name: b.name, type: b.type, topic: b.publisher || null, live, isAxis };
  }),
);
</script>

<template>
  <div class="monitor">
    <!-- ── Header ─────────────────────────────────────────────────────────── -->
    <div class="monitor-header">
      <h2>Controller Input</h2>
      <span v-if="snapshot" class="pad-name">{{ snapshot.id }}</span>
      <span v-else class="pad-disconnected">No gamepad detected</span>
    </div>

    <!-- ── Controller visualisation ─────────────────────────────────────── -->
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
            <div class="stick-ch-h" /><div class="stick-ch-v" />
            <div class="stick-dot" :style="stickDotStyle(0, 1)" />
          </div>
          <div class="stick-vals">
            <span>X <em>{{ fmt(axisValue(0)) }}</em></span>
            <span>Y <em>{{ fmt(axisValue(1)) }}</em></span>
          </div>
        </div>

        <!-- D-Pad -->
        <div class="dpad">
          <div class="dpad-row"><div class="dpad-btn" :class="{ active: btnPressed(12) }">▲</div></div>
          <div class="dpad-row">
            <div class="dpad-btn" :class="{ active: btnPressed(14) }">◄</div>
            <div class="dpad-gap" />
            <div class="dpad-btn" :class="{ active: btnPressed(15) }">►</div>
          </div>
          <div class="dpad-row"><div class="dpad-btn" :class="{ active: btnPressed(13) }">▼</div></div>
        </div>

        <!-- L3 / R3 -->
        <div class="l3r3">
          <div class="l3r3-btn" :class="{ active: btnPressed(10) }">L3</div>
          <div class="l3r3-btn" :class="{ active: btnPressed(11) }">R3</div>
        </div>

        <!-- Face buttons -->
        <div class="face">
          <div class="face-row">
            <div class="face-btn" :class="{ active: btnPressed(3) }"
              :style="btnPressed(3) ? { background: '#f5d142', color: '#000', borderColor: '#f5d142' } : {}">Y</div>
          </div>
          <div class="face-row">
            <div class="face-btn" :class="{ active: btnPressed(2) }"
              :style="btnPressed(2) ? { background: '#5b9bd5', color: '#000', borderColor: '#5b9bd5' } : {}">X</div>
            <div class="face-gap" />
            <div class="face-btn" :class="{ active: btnPressed(1) }"
              :style="btnPressed(1) ? { background: '#e8514a', color: '#fff', borderColor: '#e8514a' } : {}">B</div>
          </div>
          <div class="face-row">
            <div class="face-btn" :class="{ active: btnPressed(0) }"
              :style="btnPressed(0) ? { background: '#4cce6e', color: '#000', borderColor: '#4cce6e' } : {}">A</div>
          </div>
        </div>

        <!-- Right stick -->
        <div class="stick-group">
          <div class="stick-pad">
            <div class="stick-ch-h" /><div class="stick-ch-v" />
            <div class="stick-dot" :style="stickDotStyle(2, 3)" />
          </div>
          <div class="stick-vals">
            <span>X <em>{{ fmt(axisValue(2)) }}</em></span>
            <span>Y <em>{{ fmt(axisValue(3)) }}</em></span>
          </div>
        </div>
      </div>
    </div>

    <!-- No pad -->
    <p v-else class="no-pad">Press any button on your controller to activate it.</p>

    <!-- ── Bindings table ──────────────────────────────────────────────────── -->
    <div class="bindings-section">
      <h2>Active Bindings</h2>
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
              <!-- Axis: centred bar, pink = negative, green = positive -->
              <template v-if="row.isAxis">
                <div class="bar-track bar-track--axis">
                  <div class="bar-neg" :style="{ width: `${Math.max(0, -row.live) * 50}%` }" />
                  <div class="bar-centre" />
                  <div class="bar-pos" :style="{ width: `${Math.max(0,  row.live) * 50}%` }" />
                </div>
              </template>
              <!-- Button / trigger: left-to-right fill -->
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
  </div>
</template>

<style lang="scss" scoped>
// ── Shell ─────────────────────────────────────────────────────────────────
.monitor {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.monitor-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  h2 { font-size: 1.05rem; }
  .pad-name {
    font-family: 'Overpass', sans-serif;
    font-size: 0.75rem;
    color: var(--dark-white);
    opacity: 0.6;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 36rem;
  }
  .pad-disconnected {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--error);
  }
}

// ── Shared button token ────────────────────────────────────────────────────
%btn {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 600;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--dark-white);
  background-color: #1e1e1e;
  border: 1px solid var(--light-grey);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.05s, color 0.05s, border-color 0.05s;
  user-select: none;

  &.active {
    background-color: var(--tf-green);
    color: var(--pure-black);
    border-color: var(--tf-green);
  }
}

// ── Controller visualisation ───────────────────────────────────────────────
.ctrl-viz {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

// ── Top row: triggers + bumpers + centre buttons ───────────────────────────
.top-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trigger-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;

  &--right { flex-direction: row-reverse; }

  .trig-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--dark-white);
    opacity: 0.6;
    flex-shrink: 0;
    width: 1.4rem;
    text-align: center;
  }

  .trig-track {
    flex: 1;
    height: 8px;
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
    font-size: 0.65rem;
    color: var(--dark-white);
    opacity: 0.7;
    flex-shrink: 0;
    width: 2.2rem;
    text-align: right;
  }
}

.bumper-btn {
  @extend %btn;
  height: 1.5rem;
  width: 3rem;
  flex-shrink: 0;
}

.centre-top {
  display: flex;
  gap: 0.3rem;
  flex-shrink: 0;
}

.centre-btn {
  @extend %btn;
  height: 1.4rem;
  padding: 0 0.5rem;
  font-size: 0.6rem;
  border-radius: 3px;
}

// ── Bottom row: sticks / dpad / L3+R3 / face ──────────────────────────────
.bottom-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

// Stick
.stick-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.stick-pad {
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 50%;
  background-color: #1a1a1a;
  border: 2px solid var(--light-grey);
  position: relative;
  overflow: hidden;

  .stick-ch-h, .stick-ch-v {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.08);
  }
  .stick-ch-h { width: 100%; height: 1px; top: 50%; }
  .stick-ch-v { height: 100%; width: 1px; left: 50%; }

  .stick-dot {
    position: absolute;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    background-color: var(--tf-green);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 5px rgba(0, 254, 0, 0.45);
  }
}

.stick-vals {
  display: flex;
  gap: 0.5rem;
  font-family: 'Overpass', monospace;
  font-size: 0.65rem;
  color: var(--dark-white);
  opacity: 0.6;
  em { font-style: normal; color: var(--white); opacity: 1; }
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
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 3px;
  font-size: 0.7rem;
}
.dpad-gap {
  width: 1.7rem;
  height: 1.7rem;
}

// L3 / R3
.l3r3 {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.l3r3-btn {
  @extend %btn;
  height: 1.4rem;
  padding: 0 0.5rem;
  font-size: 0.6rem;
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
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  font-size: 0.65rem;
}
.face-gap {
  width: 1.7rem;
  height: 1.7rem;
}

.no-pad {
  font-family: 'Overpass', sans-serif;
  font-size: 0.85rem;
  color: var(--dark-white);
  opacity: 0.5;
  font-style: italic;
  padding: 1rem 0;
}

// ── Bindings table ─────────────────────────────────────────────────────────
.bindings-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  h2 { font-size: 1rem; }
}

.bindings-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;

  th {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--dark-white);
    opacity: 0.55;
    text-align: left;
    padding: 0.35rem 0.5rem;
    border-bottom: 1px solid var(--light-grey);
    white-space: nowrap;
  }

  td {
    padding: 0.28rem 0.5rem;
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
  font-size: 0.76rem;
  white-space: nowrap;
}
.col-type {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.55;
  white-space: nowrap;
}
.col-topic {
  code {
    font-family: 'Overpass', monospace;
    font-size: 0.73rem;
    color: var(--tf-green);
    background-color: rgba(0, 254, 0, 0.07);
    padding: 1px 4px;
    border-radius: 3px;
  }
  .unbound { opacity: 0.3; }
}

.col-value {
  width: 12rem;
}

// Inner wrapper — flex so bar + number sit side by side
.col-value-inner {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

// Bar track is a fixed container; inner divs size it via width %
.bar-track {
  // Use display:block so width on children works correctly (not flex item sizing)
  display: block;
  position: relative;
  height: 6px;
  background-color: #1a1a1a;
  border: 1px solid var(--light-grey);
  border-radius: 3px;
  overflow: hidden;
  width: 8rem;

  &--axis {
    // axis bar uses absolute children — centred pivot
  }
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
    left: 0; // for buttons/triggers: fill from left edge
  }
}

.val-num {
  font-family: 'Overpass', monospace;
  font-size: 0.65rem;
  color: var(--dark-white);
  opacity: 0.65;
  white-space: nowrap;
  display: inline-block;
  width: 2.8rem;
  text-align: right;
}
</style>
