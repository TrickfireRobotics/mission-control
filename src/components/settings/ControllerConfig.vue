<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useSettingsStore } from '@/store/settingsStore';
import { useControllerStore } from '@/store/controllerStore';

const settings = useSettingsStore();
const controller = useControllerStore();

const blockHorizontal = computed({
    get: () => settings.settings.controller.tankDriveBlockHorizontal,
    set: (v) => settings.updateControllerSettings({ tankDriveBlockHorizontal: v }),
});

const invertX = computed({
    get: () => settings.settings.controller.invertX,
    set: (v) => settings.updateControllerSettings({ invertX: v }),
});

const invertY = computed({
    get: () => settings.settings.controller.invertY,
    set: (v) => settings.updateControllerSettings({ invertY: v }),
});

const deadzone = computed({
    get: () => settings.settings.controller.deadzone,
    set: (v) => settings.updateControllerSettings({ deadzone: v }),
});

// Live gamepad name - read directly from the browser API
const connectedGamepadName = ref<string | null>(null);
let rafId: number | null = null;

function pollName() {
    const pads = navigator.getGamepads();
    for (const pad of pads) {
        if (pad) {
            connectedGamepadName.value = pad.id;
            rafId = requestAnimationFrame(pollName);
            return;
        }
    }
    connectedGamepadName.value = null;
    rafId = requestAnimationFrame(pollName);
}

onMounted(() => {
    rafId = requestAnimationFrame(pollName);
});
onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId);
});
</script>

<template>
    <div class="ctrl-config">
        <div class="section-header">
            <h2>Input Device</h2>
            <span
                class="status-badge"
                :class="controller.isGamepadConnected ? 'badge-connected' : 'badge-disconnected'"
            >
                {{ controller.isGamepadConnected ? 'Connected' : 'Not Connected' }}
            </span>
        </div>

        <div v-if="controller.isGamepadConnected && connectedGamepadName" class="device-name">
            <span class="device-label">Gamepad</span>
            <span class="device-value">{{ connectedGamepadName }}</span>
        </div>
        <p v-else class="no-device">
            No gamepad detected. Press any button on your controller to wake it up.
        </p>

        <div class="divider" />

        <h2>Controller Options</h2>

        <label class="toggle-row">
            <span class="toggle-name">Block horizontal stick input</span>
            <div
                class="toggle-switch"
                :class="{ active: blockHorizontal }"
                @click="blockHorizontal = !blockHorizontal"
            >
                <div class="toggle-knob" />
            </div>
        </label>

        <label class="toggle-row">
            <span class="toggle-name">Invert X axis</span>
            <div class="toggle-switch" :class="{ active: invertX }" @click="invertX = !invertX">
                <div class="toggle-knob" />
            </div>
        </label>

        <label class="toggle-row">
            <span class="toggle-name">Invert Y axis</span>
            <div class="toggle-switch" :class="{ active: invertY }" @click="invertY = !invertY">
                <div class="toggle-knob" />
            </div>
        </label>

        <div class="slider-row">
            <div class="slider-header">
                <span class="toggle-name">Joystick deadzone</span>
                <span class="slider-value">{{ deadzone.toFixed(2) }}</span>
            </div>
            <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                class="deadzone-slider"
                :value="deadzone"
                @input="deadzone = parseFloat(($event.target as HTMLInputElement).value)"
            />
            <div class="slider-labels">
                <span>0.00</span>
                <span>0.50</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ctrl-config {
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

.device-name {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0.5rem 0.75rem;
    background-color: var(--dark-grey);
    border: 1px solid var(--light-grey);
    border-radius: 4px;

    .device-label {
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 0.65rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--dark-white);
        opacity: 0.6;
    }

    .device-value {
        font-family: 'Overpass', sans-serif;
        font-size: 0.82rem;
        color: var(--white);
        word-break: break-all;
    }
}

.no-device {
    font-size: 0.84rem;
    color: var(--dark-white);
    opacity: 0.6;
    font-style: italic;
    font-family: 'Overpass', sans-serif;
}

.divider {
    height: 1px;
    background-color: var(--light-grey);
}

.toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    cursor: pointer;
    padding: 0.4rem 0;

    .toggle-name {
        font-family: 'Overpass', sans-serif;
        font-size: 0.9rem;
        font-weight: 700;
        color: var(--white);
    }
}

.slider-row {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 0.4rem 0;
}

.slider-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.slider-value {
    font-family: 'Overpass Mono', 'Overpass', monospace;
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--tf-green);
    min-width: 2.5rem;
    text-align: right;
}

.slider-labels {
    display: flex;
    justify-content: space-between;
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.65rem;
    color: var(--dark-white);
    opacity: 0.5;
}

.deadzone-slider {
    width: 100%;
    accent-color: var(--tf-green);
    cursor: pointer;
    height: 4px;
}

// Toggle switch
.toggle-switch {
    flex-shrink: 0;
    width: 2.8rem;
    height: 1.5rem;
    border-radius: 999px;
    background-color: var(--light-grey);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    transition: background-color 0.18s;
    cursor: pointer;

    &.active {
        background-color: var(--tf-green);
    }

    .toggle-knob {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 1.05rem;
        height: 1.05rem;
        border-radius: 50%;
        background-color: var(--white);
        transition: transform 0.18s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    &.active .toggle-knob {
        transform: translateX(1.3rem);
        background-color: var(--pure-black);
    }
}
</style>
