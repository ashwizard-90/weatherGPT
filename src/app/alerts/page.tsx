"use client";
import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import { mockAlerts } from "@/lib/mockData";

export default function Alerts() {
  const [filter, setFilter] = useState<"all" | "critical" | "normal">("all");
  const [alerts, setAlerts] = useState(mockAlerts);
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">(
    "default",
  );
  useEffect(() => {
    if ("Notification" in window) setPerm(Notification.permission as any);
  }, []);
  const requestPerm = async () => {
    if ("Notification" in window) {
      const p = await Notification.requestPermission();
      setPerm(p as any);
      if (p === "granted")
        new Notification("WeatherGPT — Alerts enabled", {
          body: "You will receive critical alerts with high-priority sound + vibration.",
        });
    }
  };
  const filtered = alerts.filter((a) =>
    filter === "all" ? true : a.type === filter,
  );
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
        <div className="font-bold text-[#0f2942]">🔔 Alerts</div>
        <button
          onClick={requestPerm}
          className="text-xs bg-[#0f2942] text-white px-3 py-1.5 rounded-full"
        >
          {perm === "granted" ? "✓ Notifications On" : "Enable Notifications"}
        </button>
      </header>
      <div className="max-w-3xl mx-auto px-3 py-4">
        <div className="flex gap-2 mb-4">
          {(["all", "critical", "normal"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm border capitalize ${filter === f ? "bg-[#0f2942] text-white border-[#0f2942]" : "bg-white"}`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 self-center">
            Normal ≠ Critical • Critical uses 🔴 red, sound, vibration, voice
          </span>
        </div>

        <div className="space-y-3">
          {filtered.map((a) =>
            a.type === "critical" ? (
              <div
                key={a.id}
                className="bg-gradient-to-b from-red-700 to-red-500 text-white rounded-2xl p-4 shadow-lg border border-red-800"
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-white rounded-full grid place-items-center">
                    ⚠️
                  </span>
                  <span className="font-bold">🔴 CRITICAL WEATHER ALERT</span>
                  <span className="ml-auto text-xs bg-white text-red-700 px-2 py-1 rounded-full font-bold">
                    {a.level}
                  </span>
                </div>
                <p className="text-xs mt-3 font-mono opacity-90">
                  {a.messageLocal}
                </p>
                <p className="text-sm mt-2">{a.message}</p>
                <div className="mt-3 bg-white text-slate-900 rounded-xl px-3 py-2 flex justify-between text-xs">
                  <span>📍 {a.location}</span>
                  <span>{a.time}</span>
                  <span className="font-bold text-red-600">
                    RISK LEVEL {a.level}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="bg-white text-red-700 rounded-xl py-2 text-sm font-semibold">
                    📍 Find Safe Route
                  </button>
                  <button className="bg-white/20 backdrop-blur rounded-xl py-2 text-sm">
                    🏠 Nearest Shelter
                  </button>
                  <button className="bg-white/20 backdrop-blur rounded-xl py-2 text-sm">
                    🏥 Nearest Hospital
                  </button>
                  <button className="bg-white text-slate-900 rounded-xl py-2 text-sm">
                    📤 Share Alert
                  </button>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      if ("speechSynthesis" in window) {
                        const u = new SpeechSynthesisUtterance(
                          a.messageLocal + " . " + a.message,
                        );
                        u.lang = "ta-IN";
                        speechSynthesis.speak(u);
                      }
                    }}
                    className="flex-1 bg-white text-slate-900 rounded-full py-2 text-sm"
                  >
                    🔊 Play Mother-Tongue → English Voice
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={a.id}
                className="bg-white rounded-2xl p-4 border shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-sky-100 rounded-full grid place-items-center">
                    🔔
                  </span>
                  <span className="font-semibold text-[#0f2942]">
                    {a.title}
                  </span>
                  <span className="ml-auto text-xs bg-slate-100 px-2 py-1 rounded-full">
                    {a.level}
                  </span>
                </div>
                <p className="text-sm mt-2 text-slate-700">{a.message}</p>
                <p className="text-xs mt-1 text-slate-500">{a.messageLocal}</p>
                <div className="text-xs text-slate-400 mt-2 flex justify-between">
                  <span>
                    📍 {a.location} • {a.time}
                  </span>
                  <span>Normal notification sound</span>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-6 bg-[#0f2942] text-white rounded-2xl p-4">
          <div className="text-sm font-semibold">
            Simulate Critical Alert (Demo)
          </div>
          <p className="text-xs opacity-80 mt-1">
            Trigger a critical alert to demo distinct sound, vibration, and
            emergency UI.
          </p>
          <button
            onClick={() => {
              setAlerts([
                {
                  id: "sim" + Date.now(),
                  type: "critical",
                  title: "Critical Alert",
                  message:
                    "Severe thunderstorm with lightning expected in your area. Stay indoors.",
                  messageLocal:
                    "உங்கள் பகுதியில் இடியுடன் கூடிய கனமழை எதிர்பார்க்கப்படுகிறது. வீட்டிற்குள் இருங்கள்.",
                  level: "CRITICAL",
                  location: "Salem",
                  time: "Next 1 Hour",
                  hazard: "Thunderstorm",
                },
                ...alerts,
              ]);
              if ("vibrate" in navigator)
                navigator.vibrate([200, 100, 200, 100, 400]);
              if (
                "Notification" in window &&
                Notification.permission === "granted"
              )
                new Notification("🔴 CRITICAL ALERT — Salem", {
                  body: "Severe thunderstorm. Stay indoors. Check WeatherGPT.",
                });
            }}
            className="mt-3 w-full bg-white text-[#0f2942] rounded-full py-2 text-sm font-semibold"
          >
            🔴 Trigger Simulated Critical Alert
          </button>
        </div>
      </div>
      <Nav />
    </div>
  );
}
