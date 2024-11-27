import { defineStore } from 'pinia';

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

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: getStoredSettings(),
  }),
  actions: {
    updateSettings(newSettings: Partial<Settings>) {
      this.settings = {
        ...this.settings,
        ...newSettings,
      };

      localStorage.setItem('settings', JSON.stringify(this.settings));
    },
    resetSettings() {
      this.settings = defaultSettings();

      localStorage.setItem('settings', JSON.stringify(this.settings));
    },
  },
});
