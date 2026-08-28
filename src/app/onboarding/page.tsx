"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { languages } from "@/lib/i18n";
import { locations } from "@/lib/mockData";
import { setProfile } from "@/lib/storage";

const occupations = [
  { id: "Farmer", icon: "🚜", label: "Farmer" },
  { id: "Fisherman", icon: "⛵", label: "Fisherman" },
  { id: "Business Owner", icon: "🏢", label: "Business Owner" },
  { id: "Traveler", icon: "✈️", label: "Traveler" },
  { id: "Aviation", icon: "✈️", label: "Aviation" },
  { id: "Marine", icon: "🚢", label: "Marine" },
  { id: "Urban/City", icon: "🏙️", label: "Urban User" },
  { id: "Researcher", icon: "🔬", label: "Researcher" },
  { id: "Disaster Management", icon: "🛡️", label: "Disaster Mgmt" },
  { id: "General Public", icon: "👤", label: "General Public" },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [locSearch, setLocSearch] = useState("");
  const [selectedLoc, setSelectedLoc] = useState<any>(locations[0]);
  const [primaryLang, setPrimaryLang] = useState("ta");
  const [secondaryLang, setSecondaryLang] = useState("en");
  const [name, setName] = useState("Arun Kumar");
  const [occupation, setOccupation] = useState("Farmer");
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [alertVoice, setAlertVoice] = useState("voice_text");
  const [dailyForecast, setDailyForecast] = useState(true);
  const [rainAlerts, setRainAlerts] = useState(true);
  const [familyName, setFamilyName] = useState("");
  const [familyPhone, setFamilyPhone] = useState("");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const [voiceSpeed, setVoiceSpeed] = useState("Normal Speed");

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setSelectedLoc({
          id: "current",
          name: "Current Location",
          state: "TN",
          country: "India",
          lat: latitude,
          lon: longitude,
          district: "Detected",
        });
      },
      () => alert("Location permission denied — you can search manually."),
    );
  };

  const finish = () => {
    const profile = {
      name,
      photo,
      occupation,
      primaryLang,
      secondaryLang,
      location: selectedLoc,
      alertPrefs: {
        dailyForecast,
        rainAlerts,
        severe: true,
        voiceMode: alertVoice,
      },
      voicePrefs: { lang: primaryLang, speed: voiceSpeed.replace(" Speed", "") },
      accessibility: { highContrast, largeText },
      familySafety: familyName
        ? { contactName: familyName, contactPhone: familyPhone }
        : null,
      createdAt: new Date().toISOString(),
    };
    setProfile(profile);
    router.push("/dashboard");
  };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const totalSteps = 4;
  const titles = [
    "Location & Language",
    "Personalize",
    "Voice & Alerts",
    "Finalizing Setup",
  ];

  return (
    <main className="min-h-screen bg-[#0f2942] md:bg-slate-100 flex flex-col items-center p-0 md:p-6">
      {/* Header with progress */}
      <div className="w-full max-w-xl bg-white md:rounded-2xl p-4 flex items-center justify-between sticky top-0 z-10 border-b md:border shadow-sm">
        <div className="font-bold text-[#0f2942] flex items-center gap-2">
          ☁️ WeatherGPT
        </div>
        <div className="text-xs text-slate-500">
          Step {step} of {totalSteps} • {titles[step - 1]}
        </div>
      </div>
      <div className="w-full max-w-xl mt-2 px-3 md:px-0">
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-[#0f2942] transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
        <div className="flex gap-1 mt-2 justify-center">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? "bg-[#0f2942]" : "bg-slate-300"}`}
            />
          ))}
        </div>
      </div>

      {/* Step content - only ONE step shown at a time */}
      <div className="w-full max-w-xl mt-4 px-3 md:px-0 flex-1 pb-24 md:pb-6">
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-xl border min-h-[520px] flex flex-col">
          {step === 1 && (
            <div className="flex-1 flex flex-col">
              <h2 className="font-bold text-[#0f2942] text-lg">
                Where are you located?
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Location helps us provide accurate local forecasts and alerts.
              </p>
              <button
                onClick={useCurrentLocation}
                className="mt-4 w-full bg-[#0f2942] text-white rounded-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
              >
                📍 Use My Current Location
              </button>
              <div className="mt-3 flex items-center gap-2 border rounded-full px-3 py-2.5 bg-white">
                <span className="text-slate-400">🔍</span>
                <input
                  value={locSearch}
                  onChange={(e) => setLocSearch(e.target.value)}
                  placeholder="Search for location manually"
                  className="flex-1 text-sm outline-none"
                />
              </div>
              <div className="mt-3 max-h-32 overflow-auto space-y-1.5">
                {locations
                  .filter((l) =>
                    l.name.toLowerCase().includes(locSearch.toLowerCase()),
                  )
                  .map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setSelectedLoc(l)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl border text-sm flex justify-between items-center ${selectedLoc?.id === l.id ? "bg-sky-50 border-sky-400" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                    >
                      <span>
                        {l.name}, {l.state}{" "}
                        <span className="text-xs text-slate-400">
                          • {l.lat.toFixed(2)}, {l.lon.toFixed(2)}
                        </span>
                      </span>
                      {selectedLoc?.id === l.id && (
                        <span className="text-sky-600">✓</span>
                      )}
                    </button>
                  ))}
              </div>
              <div className="mt-5">
                <h3 className="font-bold text-sm text-[#0f2942]">
                  Which language should WeatherGPT use?
                </h3>
                <div className="mt-2 relative">
                  <input
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Search languages..."
                    className="w-full border rounded-xl pl-8 pr-3 py-2.5 text-sm bg-slate-50"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    🔍
                  </span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {languages.filter((l) => l.label.toLowerCase().includes(langSearch.toLowerCase()) || l.native.includes(langSearch)).slice(0, 4).map((l) => (
                    <label
                      key={l.code}
                      className={`flex items-center justify-between border rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${primaryLang === l.code ? "bg-sky-50 border-sky-400" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                    >
                      <span className="flex gap-2 items-center">
                        {l.native}{" "}
                        <span className="text-xs text-slate-500">
                          {l.label}
                        </span>
                      </span>
                      <input
                        type="radio"
                        name="primary"
                        checked={primaryLang === l.code}
                        onChange={() => setPrimaryLang(l.code)}
                        className="accent-[#0f2942] w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
                <div className="mt-3 p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs">
                  <div className="font-bold text-[#0f2942]">
                    Fallback Language
                  </div>
                  <div className="text-slate-500 mt-1">
                    Critical alerts will default to English if translation
                    unavailable.
                  </div>
                  <div className="mt-2 bg-white rounded-lg p-2.5 border text-[11px] font-mono">
                    Severe rain warning — English fallback
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col">
              <h2 className="font-bold text-[#0f2942] text-center text-lg">
                Let's Personalize WeatherGPT For You
              </h2>
              <p className="text-xs text-center text-slate-500 mt-1">
                Tell us a few things so we can provide weather information and
                alerts that are relevant to you.
              </p>
              <div className="mt-6">
                <h3 className="font-bold text-sm text-[#0f2942]">
                  Step 1: Basic Profile
                </h3>
                <div className="mt-3 w-20 h-20 mx-auto rounded-full bg-slate-100 grid place-items-center border-2 border-dashed border-slate-300 text-2xl">
                  📷
                </div>
                <p className="text-center text-[11px] text-slate-400 mt-1">
                  Photo (Optional)
                </p>
                <label className="text-xs font-semibold mt-3 block text-slate-700">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Arun Kumar"
                  className="w-full border rounded-xl px-3 py-3 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
                <h3 className="font-bold text-sm mt-6 text-[#0f2942]">
                  Step 2: What do you do?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your occupation helps WeatherGPT provide relevant weather
                  advice.
                </p>
                <div className="grid grid-cols-2 gap-2.5 mt-3">
                  {occupations.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setOccupation(o.id)}
                      className={`p-3.5 rounded-xl border text-sm flex flex-col items-center gap-1.5 transition-all ${occupation === o.id ? "bg-[#0f2942] text-white border-[#0f2942] shadow-md scale-[1.02]" : "bg-white hover:bg-slate-50 border-slate-200"}`}
                    >
                      <span className="text-lg">{o.icon}</span>
                      <span className="text-xs font-medium">{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col">
              <h2 className="font-bold text-[#0f2942] text-lg">
                How would you like to receive alerts?
              </h2>
              <div className="mt-4 space-y-2.5">
                {[
                  {
                    id: "voice_text",
                    title: "Voice + Text",
                    desc: "Hear alerts read aloud and use them on screen. Best for hands-free awareness.",
                    badge: "Recommended",
                  },
                  {
                    id: "text_only",
                    title: "Text Only",
                    desc: "Standard notifications on your device screen without audio.",
                  },
                  {
                    id: "voice_only",
                    title: "Voice Only",
                    desc: "Audio alerts only. Good for extreme low-vision needs.",
                  },
                ].map((o) => (
                  <label
                    key={o.id}
                    className={`flex gap-3 border-2 rounded-xl p-3.5 cursor-pointer transition-all ${alertVoice === o.id ? "border-sky-400 bg-sky-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                  >
                    <input
                      type="radio"
                      checked={alertVoice === o.id}
                      onChange={() => setAlertVoice(o.id)}
                      className="accent-[#0f2942] mt-1 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-bold flex items-center gap-2 text-[#0f2942]">
                        {o.title}{" "}
                        {o.badge && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {o.desc}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="mt-4 border rounded-xl p-3.5 bg-slate-50">
                <div className="text-xs font-bold text-[#0f2942]">
                  Voice Settings
                </div>
                <div className="flex gap-2 mt-2.5">
                  <select
                    value={primaryLang}
                    onChange={(e) => setPrimaryLang(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2.5 text-sm bg-white"
                  >
                    {languages.slice(0, 4).map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.label} ({l.native})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-2.5 flex gap-2">
                  <select
                    value={voiceSpeed}
                    onChange={(e) => setVoiceSpeed(e.target.value)}
                    className="flex-1 border rounded-lg px-3 py-2.5 text-sm bg-white"
                  >
                    <option>Normal Speed</option>
                    <option>Slow</option>
                    <option>Fast</option>
                  </select>
                </div>
              </div>
              <div className="mt-5">
                <h3 className="font-bold text-sm text-[#0f2942]">
                  What alerts matter most?
                </h3>
                <div className="mt-2.5 space-y-2 text-sm">
                  <label className="flex items-center justify-between border rounded-xl px-3.5 py-3 bg-white">
                    <span className="text-sm">Daily Forecast</span>
                    <input
                      type="checkbox"
                      checked={dailyForecast}
                      onChange={(e) => setDailyForecast(e.target.checked)}
                      className="accent-[#0f2942] w-4 h-4"
                    />
                  </label>
                  <label className="flex items-center justify-between border rounded-xl px-3.5 py-3 bg-white">
                    <span className="text-sm">Rain & Precipitation</span>
                    <input
                      type="checkbox"
                      checked={rainAlerts}
                      onChange={(e) => setRainAlerts(e.target.checked)}
                      className="accent-[#0f2942] w-4 h-4"
                    />
                  </label>
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3.5 text-xs">
                    <div className="font-bold text-red-700 flex items-center gap-1">
                      ⚠️ CRITICAL WEATHER
                    </div>
                    <div className="text-slate-600 mt-1.5 leading-relaxed">
                      Emergency Alert Mode: Critical alerts (Cyclones, Floods)
                      bypass "Do Not Disturb" settings and include distinct
                      high-priority sounds and vibration patterns to ensure your
                      safety.
                    </div>
                    <label className="flex justify-between mt-3 font-medium">
                      Severe Storms & Cyclones
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-red-600 w-4 h-4"
                      />
                    </label>
                    <label className="flex justify-between mt-1.5 font-medium">
                      Flash Floods
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-red-600 w-4 h-4"
                      />
                    </label>
                    <label className="flex justify-between mt-1.5 font-medium">
                      Extreme Heatwaves
                      <input
                        type="checkbox"
                        defaultChecked
                        className="accent-red-600 w-4 h-4"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col">
              <h2 className="font-bold text-center text-lg text-[#0f2942]">
                Almost there.
              </h2>
              <p className="text-xs text-center text-slate-500 mt-1">
                Let's configure optional safety and accessibility preferences.
              </p>
              <div className="mt-5 space-y-4 flex-1">
                <div className="border-2 rounded-xl p-4">
                  <div className="font-bold text-sm text-[#0f2942] flex items-center gap-2">
                    👨‍👩‍👧 Family Safety (Optional)
                  </div>
                  <label className="flex items-start gap-2.5 text-xs mt-3 leading-relaxed">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mt-0.5 accent-[#0f2942]"
                    />{" "}
                    Keep Your Family Informed — Automatically send emergency
                    alerts to a trusted contact.
                  </label>
                  <input
                    placeholder="Contact Name — Jane Doe"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                    className="mt-3 w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-sky-400"
                  />
                  <input
                    placeholder="Contact Phone — (555) 123-4567"
                    value={familyPhone}
                    onChange={(e) => setFamilyPhone(e.target.value)}
                    className="mt-2 w-full border rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div className="border-2 rounded-xl p-4">
                  <div className="font-bold text-sm text-[#0f2942] flex items-center gap-2">
                    ♿ Accessibility (Optional)
                  </div>
                  <label className="flex justify-between text-sm mt-3 items-center">
                    Large Text{" "}
                    <input
                      type="checkbox"
                      checked={largeText}
                      onChange={(e) => setLargeText(e.target.checked)}
                      className="accent-[#0f2942] w-4 h-4"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Increase global font size
                  </p>
                  <label className="flex justify-between text-sm mt-3 items-center">
                    High Contrast{" "}
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                      className="accent-[#0f2942] w-4 h-4"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Enhance visual distinctness
                  </p>
                  <label className="flex justify-between text-sm mt-3 items-center">
                    Voice Assistance{" "}
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-[#0f2942] w-4 h-4"
                    />
                  </label>
                  <label className="flex justify-between text-sm mt-2 items-center">
                    Simple Language{" "}
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-[#0f2942] w-4 h-4"
                    />
                  </label>
                </div>
                <div className="border-2 rounded-xl p-4 bg-slate-50">
                  <div className="font-bold text-sm text-[#0f2942]">
                    Your WeatherGPT Profile
                  </div>
                  <div className="text-sm mt-3 flex items-center gap-2">
                    👤 <span className="font-semibold">{name}</span> —{" "}
                    {occupation}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    📍 {selectedLoc?.name}, {selectedLoc?.state} • Lang:{" "}
                    {primaryLang} • Voice: {alertVoice}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation - single step controls */}
          <div className="mt-6 flex items-center justify-between pt-4 border-t">
            {step > 1 ? (
              <button
                onClick={back}
                className="px-5 py-2.5 border-2 border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50"
              >
                ← Back
              </button>
            ) : (
              <button
                onClick={() => router.push("/auth")}
                className="px-5 py-2.5 border-2 border-slate-200 rounded-full text-sm font-medium hover:bg-slate-50"
              >
                ← Back
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={next}
                className="px-8 py-2.5 bg-[#0f2942] text-white rounded-full text-sm font-semibold hover:bg-[#1a3a5c] shadow-md"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={finish}
                className="px-8 py-2.5 bg-[#0f2942] text-white rounded-full text-sm font-semibold hover:bg-[#1a3a5c] shadow-md"
              >
                Complete Setup →
              </button>
            )}
          </div>
          <div className="mt-3 text-center">
            {step < 4 && (
              <button
                onClick={finish}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Skip for now
              </button>
            )}
            {step === 4 && (
              <button onClick={back} className="text-xs text-slate-400">
                or press Back to edit
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
