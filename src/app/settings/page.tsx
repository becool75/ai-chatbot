"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    id: "",
    bot_name: "",
    welcome_message: "",
    system_prompt: "",
    primary_color: "#2563eb",
  });
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("chatbot_settings")
      .select("*")
      .limit(1)
      .single();

    if (data) {
      setSettings(data);
    }
    setLoading(false);
  };

  const saveSettings = async () => {
    setStatus("saving");
    await supabase
      .from("chatbot_settings")
      .update({
        bot_name: settings.bot_name,
        welcome_message: settings.welcome_message,
        system_prompt: settings.system_prompt,
        primary_color: settings.primary_color,
      })
      .eq("id", settings.id);

    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-500">
        Lade Einstellungen...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Bot-Einstellungen</h1>
            <a href="/" className="text-sm text-slate-500 hover:text-slate-300">
              ← Zur Demo
            </a>
            <a href="/admin" className="text-sm text-slate-500 hover:text-slate-300">
              Admin-Dashboard
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="space-y-6">
          {/* Bot Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Bot-Name
            </label>
            <input
              type="text"
              value={settings.bot_name}
              onChange={(e) => setSettings({ ...settings, bot_name: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Wird im Chat-Header angezeigt
            </p>
          </div>

          {/* Welcome Message */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Willkommensnachricht
            </label>
            <input
              type="text"
              value={settings.welcome_message}
              onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Erste Nachricht die der Besucher sieht
            </p>
          </div>

          {/* System Prompt */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              System-Prompt (AI-Persönlichkeit)
            </label>
            <textarea
              rows={6}
              value={settings.system_prompt}
              onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Hier definierst du wie der Bot sich verhält, welche Infos er hat und wie er antwortet.
              Das ist der wichtigste Teil - hier kommen die Firmen-Infos, FAQs, Produkte etc. rein.
            </p>
          </div>

          {/* Primary Color */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Primärfarbe
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primary_color}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="h-10 w-20 cursor-pointer rounded border border-slate-700 bg-transparent"
              />
              <span className="text-sm text-slate-400">{settings.primary_color}</span>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={saveSettings}
            disabled={status === "saving"}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold transition-all hover:bg-blue-500 disabled:opacity-50"
          >
            {status === "saving"
              ? "Speichern..."
              : status === "saved"
                ? "Gespeichert!"
                : "Einstellungen speichern"}
          </button>
        </div>

        {/* Prompt Tips */}
        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-3 font-semibold">Tipps für den System-Prompt:</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>• Beschreibe die Firma, Produkte und Services</li>
            <li>• Füge häufige Fragen und Antworten (FAQs) ein</li>
            <li>• Definiere den Ton (formell, freundlich, etc.)</li>
            <li>• Sage was der Bot tun soll wenn er etwas nicht weiß</li>
            <li>• Gib Preise, Öffnungszeiten und Kontaktdaten an</li>
          </ul>
          <div className="mt-4 rounded-lg bg-slate-800 p-4 text-xs text-slate-400">
            <strong className="text-slate-300">Beispiel:</strong><br />
            &quot;Du bist der Support-Bot von TechStore GmbH. Wir verkaufen Cloud Services (ab 99 EUR/Monat),
            IT-Support (ab 199 EUR/Monat) und Cyber Security (ab 149 EUR/Monat).
            Öffnungszeiten: Mo-Fr 9-18 Uhr. Bei komplexen Anfragen verweise auf support@techstore.de.
            Antworte immer freundlich und auf Deutsch.&quot;
          </div>
        </div>
      </div>
    </div>
  );
}
