import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ControllerConfig {
    /** Zero out horizontal stick axes (X) when in tank-drive mode. */
    tankDriveBlockHorizontal: boolean;
    /** Invert the X axis (left/right) on both joysticks. */
    invertX: boolean;
    /** Invert the Y axis (forward/back) on both joysticks. */
    invertY: boolean;
    /**
     * Joystick deadzone radius (0–0.5). Axis values whose absolute value is
     * below this threshold are treated as exactly zero, preventing jitter
     * commands when the stick rests near centre.
     */
    deadzone: number;
}

export interface Settings {
    websocketAddress: string;
    controller: ControllerConfig;
}

function defaultSettings(): Settings {
    return {
        websocketAddress: 'ws://192.168.0.145:9090',
        controller: {
            tankDriveBlockHorizontal: false,
            invertX: false,
            invertY: false,
            deadzone: 0.4,
        },
    };
}

function getStoredSettings(): Settings {
    const stored = localStorage.getItem('settings');
    if (stored) {
        const parsed: Partial<Settings> = JSON.parse(stored);
        // Deep-merge so new keys always have a default even on old stored data.
        return {
            ...defaultSettings(),
            ...parsed,
            controller: {
                ...defaultSettings().controller,
                ...(parsed.controller ?? {}),
            },
        };
    }
    return defaultSettings();
}

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref(getStoredSettings());

    function updateSettings(newSettings: Partial<Settings>) {
        settings.value = { ...settings.value, ...newSettings };
        localStorage.setItem('settings', JSON.stringify(settings.value));
    }

    function updateControllerSettings(newCtrl: Partial<ControllerConfig>) {
        settings.value = {
            ...settings.value,
            controller: { ...settings.value.controller, ...newCtrl },
        };
        localStorage.setItem('settings', JSON.stringify(settings.value));
    }

    function resetSettings() {
        settings.value = defaultSettings();
        localStorage.setItem('settings', JSON.stringify(settings.value));
    }

    return { settings, updateSettings, updateControllerSettings, resetSettings };
});
