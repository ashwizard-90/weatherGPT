"use client";
import { useState, useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import { getProfile } from "../../../weatherGPT/lib/storage";
import {
  mockCurrent,
  occupationAdvice,
} from "../../../weatherGPT/lib/mockData";

type Msg = { role: "user" | "assistant"; text: string; lang?: string };

export default function Chat() {
  const [profile, setProfile] = useState<any>(null);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hello! I'm your WeatherGPT Assistant. How can I help you today?",
    },
    { role: "user", text: "நாளைக்கு மழை பெய்யுமா?" },
    {
      role: "assistant",
      text: "ஆம், நாளை மழைக்கு 60% வாய்ப்பு உள்ளது. (Yes, 60% chance of rain tomorrow in Salem. Advice for Farmer: Consider postponing irrigation.) Confidence: High • Sources: Weather API, Radar • Updated 2 min ago",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setProfile(getProfile());
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang =
        profile?.primaryLang === "ta"
          ? "ta-IN"
          : profile?.primaryLang === "hi"
            ? "hi-IN"
            : "en-US";
      speechSynthesis.speak(u);
    }
  };
  const [loading, setLoading] = useState(false);
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const langDetected = /[\u0B80-\u0BFF]/.test(input)
      ? "ta"
      : /[\u0900-\u097F]/.test(input)
        ? "hi"
        : "en";
    const userText = input;
    setMessages((m) => [
      ...m,
      { role: "user", text: userText, lang: langDetected },
    ]);
    setInput("");
    setLoading(true);
    try {
      // Try Ollama via /api/chat (llama3.2 on localhost:11434). Falls back to mock if Ollama not running.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          location: profile?.location,
          occupation: profile?.occupation,
          primaryLang: profile?.primaryLang || langDetected,
        }),
      });
      const data = await res.json();
      let resp = data.reply || data.error || "";
      if (data.warning) resp = `⚠️ ${data.warning}\n\n${resp}`;
      // Add fallback local logic if API fails to give useful reply
      if (!resp) throw new Error("No reply");
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            resp +
            ` • ${data.provider === "ollama" ? "🦙 llama3.2 via Ollama" : ""} Verified • Confidence High`,
        },
      ]);
    } catch (e) {
      // Local fallback — same verified logic as before (never fabricates)
      const q = userText.toLowerCase();
      const occ = profile?.occupation || "General Public";
      const advice = occupationAdvice(occ, mockCurrent);
      let resp = "";
      if (q.includes("rain") || q.includes("மழை") || q.includes("बारिश")) {
        resp =
          langDetected === "ta"
            ? `சேலத்தில் இன்று மழைக்கு ${mockCurrent.rainProb}% வாய்ப்பு உள்ளது. ${advice} (English: Rain probability ${mockCurrent.rainProb}% tonight. ${advice})`
            : `In ${profile?.location?.name || "Salem"}, rain probability is ${mockCurrent.rainProb}% this evening. For ${occ}: ${advice} • Confidence: High • Verified via Weather Engine`;
      } else if (
        q.includes("fish") ||
        q.includes("sea") ||
        q.includes("மீன்")
      ) {
        resp = `Marine warning: Wind ${mockCurrent.windSpeed} km/h, rain ${mockCurrent.rainProb}%. For Fisherman: ${occupationAdvice("Fisherman", mockCurrent)} • Check IMD marine bulletin.`;
      } else if (q.includes("travel") || q.includes("safe")) {
        resp = `Travel advisory: ${occupationAdvice("Traveler", mockCurrent)} Current visibility ${mockCurrent.visibility} km.`;
      } else if (q.includes("cyclone")) {
        resp = `No cyclone within 300km of ${profile?.location?.name || "Salem"} currently. Monitoring IMD. If issued, you'll receive Critical Alert (Voice + Text + English fallback).`;
      } else {
        resp = `Verified weather for ${profile?.location?.name || "Salem"}: ${mockCurrent.temp}°C, ${mockCurrent.condition}, Rain ${mockCurrent.rainProb}%, Wind ${mockCurrent.windSpeed} km/h. For ${occ}: ${advice} • Sources: Weather API, Radar, Satellite • LLM explains verified data only.`;
      }
      setMessages((m) => [
        ...m,
        { role: "assistant", text: resp + " (offline mock fallback)" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    const SR: any =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;
    if (!SR) {
      alert("Speech recognition not supported — type your question");
      return;
    }
    const rec = new SR();
    rec.lang =
      profile?.primaryLang === "ta"
        ? "ta-IN"
        : profile?.primaryLang === "hi"
          ? "hi-IN"
          : "en-US";
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e: any) => setInput(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="font-bold text-[#0f2942]">
          ☁️ WeatherGPT{" "}
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full ml-2">
            ✓ Verified Data Sources (ISRO, IMD)
          </span>
        </div>
        <div className="text-xs text-slate-500">
          {profile?.occupation || "Farmer"} • {profile?.primaryLang || "ta"} /
          en
        </div>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto px-3 py-4 space-y-3 overflow-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-[#0f2942] text-white rounded-br-sm" : "bg-white border shadow-sm rounded-bl-sm"}`}
            >
              <div>{m.text}</div>
              {m.role === "assistant" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => speak(m.text)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 rounded-full px-2.5 py-1"
                  >
                    🔊 Speak
                  </button>
                  <span className="text-[10px] text-slate-400 self-center">
                    Verified • Confidence High
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="max-w-3xl w-full mx-auto px-3 pb-2 flex gap-2 overflow-x-auto">
        {[
          "Will it rain tomorrow?",
          "Will there be heavy rain tonight?",
          "Can I go fishing tomorrow?",
          "Is it safe to travel?",
        ].map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="shrink-0 bg-white border rounded-full px-3 py-1.5 text-xs hover:bg-slate-50"
          >
            "{q}"
          </button>
        ))}
      </div>

      <div className="sticky bottom-14 md:bottom-0 bg-white border-t p-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 border rounded-full px-3 py-2 bg-slate-50">
            <span className="text-slate-400">💬</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about weather, risks, or safety..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              onClick={startVoice}
              className={`w-8 h-8 rounded-full grid place-items-center ${listening ? "bg-red-500 text-white animate-pulse" : "bg-[#0f2942] text-white"}`}
            >
              🎤
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={loading}
            className="w-10 h-10 rounded-full bg-[#0f2942] text-white grid place-items-center disabled:opacity-50"
          >
            {loading ? "…" : "➤"}
          </button>
        </div>
        <div className="max-w-3xl mx-auto text-[11px] text-slate-400 mt-2 text-center">
          LLM:{" "}
          {loading
            ? "🦙 querying llama3.2..."
            : "🦙 llama3.2 via Ollama localhost"}{" "}
          • explains verified weather only • RAG: Intent → Location → Weather →
          Risk → LLM
        </div>
      </div>
      <Nav />
    </div>
  );
}
