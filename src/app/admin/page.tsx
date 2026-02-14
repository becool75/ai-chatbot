"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  session_id: string;
  role: string;
  message: string;
  created_at: string;
}

interface Session {
  session_id: string;
  message_count: number;
  first_message: string;
  last_active: string;
}

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Group by session
    const sessionMap = new Map<string, Message[]>();
    for (const msg of data) {
      if (!sessionMap.has(msg.session_id)) {
        sessionMap.set(msg.session_id, []);
      }
      sessionMap.get(msg.session_id)!.push(msg);
    }

    const sessionList: Session[] = [];
    sessionMap.forEach((msgs, sid) => {
      const userMsgs = msgs.filter((m) => m.role === "user");
      sessionList.push({
        session_id: sid,
        message_count: msgs.length,
        first_message: userMsgs[userMsgs.length - 1]?.message || "...",
        last_active: msgs[0].created_at,
      });
    });

    sessionList.sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime());
    setSessions(sessionList);
    setLoading(false);
  };

  const loadSession = async (sessionId: string) => {
    setSelectedSession(sessionId);
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalMessages = sessions.reduce((sum, s) => sum + s.message_count, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Chatbot Admin</h1>
            <a href="/" className="text-sm text-slate-500 hover:text-slate-300">
              ← Zur Demo
            </a>
            <a href="/settings" className="text-sm text-slate-500 hover:text-slate-300">
              Einstellungen
            </a>
          </div>
          <button
            onClick={fetchSessions}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm transition-colors hover:border-slate-500"
          >
            Aktualisieren
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-2xl font-bold text-blue-400">{sessions.length}</div>
            <div className="text-sm text-slate-500">Gespräche</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-2xl font-bold text-green-400">{totalMessages}</div>
            <div className="text-sm text-slate-500">Nachrichten</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="text-2xl font-bold text-purple-400">
              {sessions.length > 0 ? Math.round(totalMessages / sessions.length) : 0}
            </div>
            <div className="text-sm text-slate-500">Avg. pro Gespräch</div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">Lade Daten...</div>
        ) : sessions.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            Noch keine Gespräche. Teste den Chatbot auf der{" "}
            <a href="/" className="text-blue-400 underline">Demo-Seite</a>.
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Session List */}
            <div className="lg:col-span-1">
              <h2 className="mb-3 text-sm font-medium text-slate-400">Gespräche</h2>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <button
                    key={session.session_id}
                    onClick={() => loadSession(session.session_id)}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      selectedSession === session.session_id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {session.message_count} Nachrichten
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatDate(session.last_active)}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-sm text-slate-400">
                      {session.first_message}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat View */}
            <div className="lg:col-span-2">
              {selectedSession && messages.length > 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
                  <h2 className="mb-4 text-sm font-medium text-slate-400">
                    Chatverlauf ({messages.length} Nachrichten)
                  </h2>
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === "user" ? "" : ""}`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            msg.role === "user"
                              ? "bg-slate-700 text-slate-300"
                              : "bg-blue-600 text-white"
                          }`}
                        >
                          {msg.role === "user" ? "U" : "AI"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {msg.role === "user" ? "Besucher" : "Bot"}
                            </span>
                            <span className="text-xs text-slate-600">
                              {formatDate(msg.created_at)}
                            </span>
                          </div>
                          <div className="mt-1 text-sm leading-relaxed text-slate-300">
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-800 text-slate-600">
                  Wähle ein Gespräch aus der Liste
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
