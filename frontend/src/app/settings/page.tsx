"use client";

import { useEffect, useState } from "react";
import { applySettings, getSettings, saveSettings, type AppSettings } from "@/lib/settings";

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const nextSettings = { ...settings, [key]: value };
    setSettings(nextSettings);
    saveSettings(nextSettings);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500 mt-2">Customize the workspace experience.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Appearance</h2>

          <label className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium">Dark mode</p>
              <p className="text-sm text-slate-500">Switch the interface to a darker theme.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.theme === "dark"}
              onChange={(event) => updateSetting("theme", event.target.checked ? "dark" : "light")}
              className="h-5 w-5 rounded border-gray-300"
            />
          </label>

          <label className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium">Compact mode</p>
              <p className="text-sm text-slate-500">Reduce spacing for a denser layout.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(event) => updateSetting("compactMode", event.target.checked)}
              className="h-5 w-5 rounded border-gray-300"
            />
          </label>
        </section>

        <section className="bg-white rounded-2xl border p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-semibold">Preferences</h2>

          <label className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium">Language</p>
              <p className="text-sm text-slate-500">Choose the interface language.</p>
            </div>
            <select
              value={settings.language}
              onChange={(event) => updateSetting("language", event.target.value as AppSettings["language"])}
              className="rounded-lg border-gray-300"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </label>

          <label className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="font-medium">Notifications</p>
              <p className="text-sm text-slate-500">Enable or disable in-app notifications.</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(event) => updateSetting("notifications", event.target.checked)}
              className="h-5 w-5 rounded border-gray-300"
            />
          </label>
        </section>
      </div>
    </div>
  );
}
