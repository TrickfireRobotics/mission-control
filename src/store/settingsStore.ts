import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ControllerConfig {
  tankDriveBlockHorizontal: boolean;
  invertX: boolean;
  invertY: boolean;
  // joystick deadzone radius (0-0.5); axis values below this are treated as zero
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
    // deep-merge so new keys always have a default even on old stored data
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
    settings.value = {
      ...settings.value,
      ...newSettings,
    };

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
