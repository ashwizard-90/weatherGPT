"use client";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { getProfile, setProfile as saveProfile, clearAll, getAuth } from "@/lib/storage";
import { languages } from "@/lib/i18n";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  useEffect(() => {
    setProfile(getProfile());
    setAuth(getAuth());
  }, []);
  if (!profile)
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="bg-white rounded-2xl p-6 border">
          No profile —{" "}
          <a href="/onboarding" className="text-sky-600 underline">
            Complete onboarding
          </a>
        </div>
      </div>
    );
  const update = (patch: any) => {
    const np = { ...profile, ...patch };
    setProfile(np);
    saveProfile(np);
  };
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="font-bold text-[#0f2942]">⚙️ Settings</div>
      </header>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 border flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-200 grid place-items-center">
            👤
          </div>
          <div>
            <div className="font-semibold">{profile.name}</div>
            <div className="text-xs text-slate-500">
              {profile.occupation} • {profile.location?.name},{" "}
              {profile.location?.state}
            </div>
            <div className="text-xs text-slate-500">
              {auth?.provider} • {auth?.email}
            </div>
          </div>
          <button
            onClick={() => {
              clearAll();
              router.push("/");
            }}
            className="ml-auto text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Profile</div>
          <input
            value={profile.name}
            onChange={(e) => update({ name: e.target.value })}
            className="mt-2 w-full border rounded-xl px-3 py-2 text-sm"
            placeholder="Name"
          />
          <select
            value={profile.occupation}
            onChange={(e) => update({ occupation: e.target.value })}
            className="mt-2 w-full border rounded-xl px-3 py-2 text-sm"
          >
            {[
              "Farmer",
              "Fisherman",
              "Business Owner",
              "Traveler",
              "Aviation",
              "Marine",
              "Urban/City",
              "Researcher",
              "Disaster Management",
              "General Public",
            ].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Language</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <div className="text-xs font-semibold">Primary</div>
              <select
                value={profile.primaryLang}
                onChange={(e) => update({ primaryLang: e.target.value })}
                className="w-full border rounded-xl px-2 py-2 text-sm mt-1"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native} — {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold">Secondary</div>
              <select
                value={profile.secondaryLang}
                onChange={(e) => update({ secondaryLang: e.target.value })}
                className="w-full border rounded-xl px-2 py-2 text-sm mt-1"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Notifications</div>
          <label className="flex justify-between text-sm mt-2">
            Daily Forecast{" "}
            <input
              type="checkbox"
              checked={profile.alertPrefs?.dailyForecast}
              onChange={(e) =>
                update({
                  alertPrefs: {
                    ...profile.alertPrefs,
                    dailyForecast: e.target.checked,
                  },
                })
              }
            />
          </label>
          <label className="flex justify-between text-sm mt-2">
            Rain Alerts{" "}
            <input
              type="checkbox"
              checked={profile.alertPrefs?.rainAlerts}
              onChange={(e) =>
                update({
                  alertPrefs: {
                    ...profile.alertPrefs,
                    rainAlerts: e.target.checked,
                  },
                })
              }
            />
          </label>
          <label className="flex justify-between text-sm mt-2">
            Critical Alerts (mandatory sound){" "}
            <input type="checkbox" defaultChecked disabled />
          </label>
          <div className="text-xs text-slate-400 mt-2">
            Critical alerts use high-priority notification, distinct sound &
            vibration — never use styling for normal alerts.
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Voice</div>
          <select
            value={profile.voicePrefs?.speed || "Normal"}
            onChange={(e) =>
              update({
                voicePrefs: { ...profile.voicePrefs, speed: e.target.value },
              })
            }
            className="mt-2 w-full border rounded-xl px-3 py-2 text-sm"
          >
            <option>Normal</option>
            <option>Slow</option>
            <option>Fast</option>
          </select>
          <button
            onClick={() => {
              if ("speechSynthesis" in window) {
                const u = new SpeechSynthesisUtterance(
                  "This is a WeatherGPT voice test in your preferred language.",
                );
                u.lang = profile.primaryLang === "ta" ? "ta-IN" : "en-US";
                speechSynthesis.speak(u);
              }
            }}
            className="mt-2 w-full bg-[#0f2942] text-white rounded-full py-2 text-sm"
          >
            🔊 Test Voice
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Accessibility</div>
          <label className="flex justify-between text-sm mt-2">
            High Contrast{" "}
            <input
              type="checkbox"
              checked={profile.accessibility?.highContrast}
              onChange={(e) =>
                update({
                  accessibility: {
                    ...profile.accessibility,
                    highContrast: e.target.checked,
                  },
                })
              }
            />
          </label>
          <label className="flex justify-between text-sm mt-2">
            Large Text{" "}
            <input
              type="checkbox"
              checked={profile.accessibility?.largeText}
              onChange={(e) =>
                update({
                  accessibility: {
                    ...profile.accessibility,
                    largeText: e.target.checked,
                  },
                })
              }
            />
          </label>
        </div>

        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Privacy & Data Mode</div>
          <div className="text-xs text-slate-500 mt-1">
            DATA_MODE=mock (Demo) — replace with DATA_MODE=live and configure
            WEATHER_API_KEY, LLM_API_KEY, MAP_API_KEY, DATABASE_URL, REDIS_URL.
          </div>
          <div className="text-xs text-slate-500">
            No API keys exposed in frontend. All secrets via .env.
          </div>
        </div>
      </div>
      <Nav />
    </div>
  );
}
