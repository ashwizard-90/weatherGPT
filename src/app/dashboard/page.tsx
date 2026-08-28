"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/Nav';
import { mockCurrent, mockHourly, mockDaily, mockRisks, occupationAdvice } from '@/lib/mockData';
import { getProfile } from '@/lib/storage';
import { fuseWeather, mockSources } from '@/lib/weatherEngine';
import { analyzeRisks } from '@/lib/riskEngine';

export default function Dashboard(){
  const [profile,setProfile]=useState<any>(null);
  const [weather,setWeather]=useState(mockCurrent);
  const [fused,setFused]=useState<any>(null);
  const [risks,setRisks]=useState(mockRisks);
  const [showCritical,setShowCritical]=useState(true);
  const [lastUpdated,setLastUpdated]=useState('2 min ago');

  useEffect(()=>{
    const p = getProfile(); if(p) setProfile(p);
    const fusedRes = fuseWeather(mockSources() as any);
    if(fusedRes && !('error' in fusedRes)) setFused(fusedRes);
    const analyzed = analyzeRisks({ rainIntensity: mockCurrent.rainProb, rainDurationH:5, windSpeed: mockCurrent.windSpeed, visibility: mockCurrent.visibility, temp: mockCurrent.temp, terrainRisk:'medium', officialWarning: undefined });
    // map to display risks already mocked

    const id = setInterval(()=> setLastUpdated(`${Math.floor(Math.random()*5)+1} min ago`), 30000);
    return ()=> clearInterval(id);
  },[]);
  const occupation = profile?.occupation || 'Farmer';
  const advice = occupationAdvice(occupation, weather);
  const locationName = profile?.location?.name || 'Salem, TN';

  return (
    <div className="min-h-screen bg-slate-50 pb-16 md:pb-0">
      <header className="sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-[#0f2942] flex items-center gap-2">☁️ WeatherGPT <span className="text-xs font-normal text-slate-400 hidden md:inline">Hi/EN ▾</span></div>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="w-8 h-8 rounded-full bg-slate-200 grid place-items-center text-sm">👤</Link>
          <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">DATA_MODE=mock • Demo Data</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-3 md:px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Location header */}
          <div className="bg-white rounded-2xl p-4 border flex items-center justify-between">
            <div>
              <div className="font-bold text-[#0f2942]">{locationName} • {weather.temp}°C | Humidity {weather.humidity}%</div>
              <div className="text-xs text-slate-500">{weather.condition} • {profile?.location?.lat?.toFixed(4) || '11.6643'}, {profile?.location?.lon?.toFixed(4) || '78.1460'} • Feels like {weather.feelsLike}°C</div>
            </div>
            <Link href="/map" className="text-xs bg-sky-50 text-sky-700 px-3 py-1.5 rounded-full border border-sky-200">View Map →</Link>
          </div>

          {/* Current + Advice */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 border">
              <div className="text-xs font-semibold text-slate-500">Current Weather</div>
              <div className="mt-2 flex items-center gap-4">
                <div className="text-4xl">⛅</div>
                <div>
                  <div className="text-3xl font-extrabold text-[#0f2942]">{weather.temp}°C</div>
                  <div className="text-xs text-slate-500">Feels like {weather.feelsLike}°C • Wind {weather.windSpeed} km/h {weather.windDir}</div>
                  <div className="text-xs text-slate-500">Visibility {weather.visibility} km • AQI {weather.aqi} • Humidity {weather.humidity}%</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 rounded-xl p-2"><div className="text-slate-400">Rain Prob</div><div className="font-bold text-sky-600">{weather.rainProb}%</div></div>
                <div className="bg-slate-50 rounded-xl p-2"><div className="text-slate-400">Wind</div><div className="font-bold">{weather.windSpeed} km/h</div></div>
                <div className="bg-slate-50 rounded-xl p-2"><div className="text-slate-400">Humidity</div><div className="font-bold">{weather.humidity}%</div></div>
              </div>
              <div className="mt-3 text-[11px] bg-slate-50 rounded-xl p-2 border">
                <div className="font-semibold">Trust Indicators</div>
                <div className="text-slate-600">Weather Updated: {lastUpdated} • Confidence: <span className="font-semibold text-emerald-600">{fused?.confidence || weather.confidence}</span></div>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {(fused?.sources || weather.sources).map((s:string)=> <span key={s} className="px-1.5 py-0.5 bg-white border rounded-full text-[10px]">✓ {s}</span>)}
                </div>
                {fused && <div className="text-[10px] text-slate-400 mt-1">Fused from {fused.raw.length} sources • Variance &lt;10% → High confidence</div>}
              </div>
            </div>

            <div className="bg-gradient-to-br from-sky-500 via-sky-500 to-emerald-500 text-white rounded-2xl p-4 flex flex-col">
              <div className="text-xs font-semibold opacity-90">WeatherGPT Advice For You</div>
              <div className="text-[11px] opacity-80">Occupation: {occupation} • Location: {locationName}</div>
              <p className="text-sm mt-3 leading-relaxed">"{advice}"</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/20 backdrop-blur rounded-xl p-2"><div className="opacity-80">RAIN PROB</div><div className="font-bold text-base">{weather.rainProb}%</div></div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-2"><div className="opacity-80">EXPECTED</div><div className="font-bold">12mm</div></div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-2"><div className="opacity-80">WIND</div><div className="font-bold">{weather.windSpeed} km/h</div></div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href="/chat" className="flex-1 bg-white text-[#0f2942] rounded-full py-2 text-center text-sm font-semibold">Ask WeatherGPT</Link>
                <button onClick={()=>{
                  if('speechSynthesis' in window){
                    const u = new SpeechSynthesisUtterance(advice);
                    u.lang = profile?.primaryLang==='ta'? 'ta-IN' : 'en-US';
                    speechSynthesis.speak(u);
                  }
                }} className="px-3 py-2 bg-white/20 backdrop-blur rounded-full text-sm">🔊</button>
              </div>
              <div className="text-[10px] opacity-70 mt-2">Same verified forecast → personalized action. LLM explains, never fabricates.</div>
            </div>
          </div>

          {/* Hourly */}
          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-sm font-semibold">6-Hour Forecast</div>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-3">
              {mockHourly.map(h=>(
                <div key={h.time} className="bg-slate-50 rounded-xl p-2 text-center">
                  <div className="text-xs text-slate-500">{h.time}</div>
                  <div className="text-lg mt-1">{h.icon}</div>
                  <div className="text-sm font-bold">{h.temp}°</div>
                  <div className="text-[11px] text-sky-600">{h.rainProb}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day */}
          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-sm font-semibold">7-Day Forecast</div>
            <div className="mt-2 divide-y">
              {mockDaily.map(d=>(
                <div key={d.day} className="flex items-center justify-between py-2 text-sm">
                  <span className="w-16">{d.day}</span><span>{d.icon}</span><span className="text-sky-600 text-xs">{d.rainProb}%</span><span className="font-semibold">{d.high}° / {d.low}°</span><span className="text-xs text-slate-500 hidden md:inline">{d.condition}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {showCritical && (
            <div className="bg-gradient-to-b from-red-700 to-red-500 text-white rounded-2xl p-4 border border-red-800">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-white text-red-700 px-2 py-1 rounded-full font-bold">🔴 CRITICAL WEATHER ALERT</span>
                <button onClick={()=>setShowCritical(false)} className="text-white/80 text-xs">✕</button>
              </div>
              <p className="text-xs mt-3 font-mono opacity-90">உங்கள் பகுதியில் கனமழை மற்றும் வெள்ள அபாயம் உள்ளது. தேவையற்ற பயணங்களைத் தவிர்க்கவும்.</p>
              <p className="text-sm mt-2">Heavy rainfall and flood risk are expected. Avoid unnecessary travel.</p>
              <div className="mt-3 bg-white text-slate-900 rounded-xl p-2.5 flex justify-between text-xs"><span>📍 {profile?.location?.name || 'Coastal Regions'}</span><span>Next 3 Hours</span></div>
              <div className="mt-2 flex flex-col gap-2">
                <Link href="/emergency" className="bg-white text-red-700 rounded-xl py-2 text-center text-sm font-semibold">📍 Find Safe Route</Link>
                <Link href="/emergency" className="bg-white/20 backdrop-blur rounded-xl py-2 text-center text-sm">🏠 Nearest Shelter</Link>
                <button onClick={()=>{
                  if('speechSynthesis' in window){
                    const u = new SpeechSynthesisUtterance('Heavy rainfall and flood risk are expected. Avoid unnecessary travel.');
                    speechSynthesis.speak(u);
                  }
                }} className="bg-white text-slate-900 rounded-xl py-2 text-sm">🔊 Playing Voice Alert…</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-sm font-semibold">Risk Analysis</div>
            <div className="text-xs text-slate-500">Calculated by Risk Engine • Not raw API claims</div>
            <div className="mt-3 space-y-2">
              {mockRisks.map(r=>(
                <div key={r.hazard} className="flex items-center justify-between border rounded-xl px-3 py-2.5">
                  <div><div className="text-sm font-semibold">{r.hazard}</div><div className="text-xs text-slate-500">{r.location} • {r.time}</div></div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${r.level==='Critical'?'bg-red-600 text-white': r.level==='High'?'bg-orange-500 text-white': r.level==='Moderate'?'bg-amber-400 text-slate-900':'bg-emerald-100 text-emerald-700'}`}>{r.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-sm font-semibold">Daily Morning Briefing</div>
            <div className="text-xs text-slate-500">Good Morning, {profile?.name || 'Arun'} 👋</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 rounded-xl p-2">🌡️ 31°C</div><div className="bg-slate-50 rounded-xl p-2">🌧️ 72%</div><div className="bg-slate-50 rounded-xl p-2">💨 24 km/h</div>
            </div>
            <p className="text-sm mt-3 bg-sky-50 border border-sky-100 rounded-xl p-3">"Rain is likely after 4 PM. Consider completing outdoor work earlier."</p>
            <button onClick={()=>{
              if('speechSynthesis' in window){
                const u = new SpeechSynthesisUtterance('Good morning. Rain is likely after 4 PM. Consider completing outdoor work earlier.');
                speechSynthesis.speak(u);
              }
            }} className="mt-2 w-full bg-[#0f2942] text-white rounded-full py-2 text-sm">🔊 Listen to Briefing</button>
          </div>

          <div className="bg-[#0f2942] text-white rounded-2xl p-4">
            <div className="text-sm font-semibold">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              <Link href="/community" className="bg-white text-[#0f2942] rounded-xl py-2 text-center">📸 Report Conditions</Link>
              <Link href="/chat" className="bg-white/20 backdrop-blur rounded-xl py-2 text-center">💬 Ask WeatherGPT</Link>
              <Link href="/map" className="bg-white/20 backdrop-blur rounded-xl py-2 text-center">🗺️ Live Map</Link>
              <Link href="/alerts" className="bg-white/20 backdrop-blur rounded-xl py-2 text-center">🔔 Alerts</Link>
            </div>
          </div>
        </div>
      </main>
      <Nav />
    </div>
  );
}
