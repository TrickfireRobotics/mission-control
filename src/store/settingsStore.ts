import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ControllerConfig {
  /** Zero out horizontal stick axes (X) when in tank-drive mode. */
  tankDriveBlockHorizontal: boolean;
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
