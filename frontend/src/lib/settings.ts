export type AppTheme = "light" | "dark";
export type AppLanguage = "en" | "fr";

export interface AppSettings {
  theme: AppTheme;
  language: AppLanguage;
  compactMode: boolean;
  notifications: boolean;
}

const STORAGE_KEY = "fleet_settings";

const defaults: AppSettings = {
  theme: "light",
  language: "en",
  compactMode: false,
  notifications: true,
};

export function getSettings(): AppSettings {
  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return defaults;
    }

    return {
      ...defaults,
      ...JSON.parse(stored),
    };
  } catch {
    return defaults;
  }
}

export function saveSettings(settings: AppSettings) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  applySettings(settings);
}

export function applySettings(settings: AppSettings) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = settings.language;
  document.documentElement.classList.toggle("dark", settings.theme === "dark");
  document.body.classList.toggle("dark", settings.theme === "dark");
  document.body.dataset.theme = settings.theme;
}
