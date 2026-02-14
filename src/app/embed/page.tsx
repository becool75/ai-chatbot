"use client";

import { useState } from "react";

export default function EmbedPage() {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script src="${typeof window !== "undefined" ? window.location.origin : ""}/embed.js" defer></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <h1 className="text-xl font-bold">Embed-Code</h1>
          <a href="/" className="text-sm text-slate-500 hover:text-slate-300">← Zur Demo</a>
          <a href="/admin" className="text-sm text-slate-500 hover:text-slate-300">Admin</a>
          <a href="/settings" className="text-sm text-slate-500 hover:text-slate-300">Einstellungen</a>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-2 text-2xl font-bold">Chatbot auf Ihrer Website einbetten</h2>
        <p className="mb-8 text-slate-400">
          Kopieren Sie den Code und fügen Sie ihn vor dem schließenden &lt;/body&gt; Tag Ihrer Website ein.
        </p>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">HTML Embed-Code</span>
            <button
              onClick={handleCopy}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm transition-colors hover:border-slate-500"
            >
              {copied ? "Kopiert!" : "Kopieren"}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-green-400">
            {embedCode}
          </pre>
        </div>

        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-3 font-semibold">So funktioniert es:</h3>
          <ol className="space-y-2 text-sm text-slate-400">
            <li>1. Kopieren Sie den Code oben</li>
            <li>2. Öffnen Sie den HTML-Quellcode Ihrer Website</li>
            <li>3. Fügen Sie den Code vor <code className="text-slate-300">&lt;/body&gt;</code> ein</li>
            <li>4. Speichern und fertig - der Chatbot erscheint unten rechts</li>
          </ol>
        </div>

        <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <h3 className="mb-3 font-semibold">Kompatibel mit:</h3>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-slate-700 px-3 py-1">WordPress</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Shopify</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Wix</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Squarespace</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Jede HTML-Website</span>
          </div>
        </div>
      </div>
    </div>
  );
}
