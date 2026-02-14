import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { message, sessionId, history } = await request.json();

  if (!message || !sessionId) {
    return NextResponse.json({ error: "Message and sessionId required" }, { status: 400 });
  }

  try {
    // Get chatbot settings
    const { data: settings } = await supabase
      .from("chatbot_settings")
      .select("system_prompt")
      .limit(1)
      .single();

    const systemPrompt = settings?.system_prompt || "Du bist ein freundlicher Kundensupport-Assistent.";

    // Build message history for context
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
    ];

    // Add conversation history (last 10 messages for context)
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) {
        messages.push({ role: msg.role, content: msg.message });
      }
    }

    messages.push({ role: "user", content: message });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content || "Entschuldigung, ich konnte keine Antwort generieren.";

    // Save both messages to Supabase
    await supabase.from("conversations").insert([
      { session_id: sessionId, role: "user", message },
      { session_id: sessionId, role: "assistant", message: reply },
    ]);

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat error:", msg);
    return NextResponse.json({ error: "Fehler bei der Verarbeitung." }, { status: 500 });
  }
}
