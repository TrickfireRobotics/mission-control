import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Settings {
  websocketAddress: string;
}

function defaultSettings(): Settings {
  return {
    websocketAddress: 'ws://192.168.0.145:9090',
  };
}

function getStoredSettings(): Settings {
  const settings = localStorage.getItem('settings');
  if (settings) {
    return JSON.parse(settings);
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

  function resetSettings() {
    settings.value = defaultSettings();

    localStorage.setItem('settings', JSON.stringify(settings.value));
  }

  return { settings, updateSettings, resetSettings };
});
