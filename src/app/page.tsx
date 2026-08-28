"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Landing(){
  const [authed, setAuthed] = useState(false);
  useEffect(()=>{
    const a = localStorage.getItem('weathergpt_auth');
    if(a) setAuthed(true);
  },[]);
  return (
    <main className="min-h-screen bg-[#0f2942] md:bg-slate-50 flex flex-col">
      {/* Mobile hero */}
      <div className="flex-1 flex flex-col md:max-w-6xl md:mx-auto md:grid md:grid-cols-2 md:gap-8 md:px-8 md:py-8 w-full">
        <div className="bg-white md:rounded-3xl md:shadow-xl p-6 md:p-10 flex flex-col">
          <div className="flex items-center gap-2 text-[#0f2942] font-bold"><span className="w-7 h-7 rounded-full bg-[#0f2942] text-white grid place-items-center text-xs">☁️</span>WeatherGPT</div>
          <div className="mt-6">
            <img src="https://images.pexels.com/photos/24504043/pexels-photo-24504043.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Monsoon clouds over India" className="w-full h-44 object-cover rounded-2xl"/>
            <div className=" -mt-6 bg-sky-500 h-20 rounded-xl opacity-20 blur-xl"/>
          </div>
          <div className="mt-4">
            <div className="inline-flex items-center gap-1.5 text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-200">⚠️ ACTIVE WEATHER ALERTS</div>
            <h1 className="text-2xl font-extrabold text-[#0f2942] mt-3 leading-tight">WeatherGPT<br/>From Forecast to Action</h1>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">Real-time weather intelligence, personalized advice, and disaster awareness for India. Precision meteorological data meets actionable AI insights.</p>
            <div className="mt-4 flex gap-3">
              <Link href={authed?"/dashboard":"/auth"} className="px-5 py-2.5 bg-[#0f2942] text-white rounded-full text-sm font-semibold">Get Started</Link>
              <Link href="/map" className="px-5 py-2.5 border border-slate-200 rounded-full text-sm">Explore Live Map</Link>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <Feature icon="🎯" title="Hyper-Local Forecasting" desc="Precision data tailored to your exact coordinates, updating every 5 minutes."/>
            <Feature icon="🌐" title="Multilingual Support" desc="Accessible in English, Hindi, Tamil, and Telugu for seamless communication across India."/>
            <Feature icon="🔔" title="Disaster Awareness" desc="Early warning systems integrated directly with national meteorological databases."/>
          </div>
          <p className="text-center text-sm text-slate-600 mt-6 font-medium">Professional Meteorological Intelligence</p>
          <div className="mt-2 text-[11px] text-center text-slate-400">Demo Mode • Data fusion from IMD, ISRO, Radar • LLM explains, never fabricates</div>
        </div>

        {/* Desktop preview of app screens - mimic design */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <div className="text-sm font-bold text-[#0f2942]">Salem, TN ☀️ 31°C | Humidity 65%</div>
            <div className="mt-3 bg-gradient-to-br from-sky-500 to-emerald-500 text-white rounded-2xl p-4">
              <div className="text-xs opacity-90">WeatherGPT Advice For You</div>
              <p className="text-sm mt-1 leading-relaxed">"Rain probability is high this evening. Consider postponing irrigation and move harvested crops to a protected area."</p>
              <div className="flex gap-4 mt-3 text-xs"><span>RAIN PROB 85%</span><span>EXPECTED 12mm</span><span className="ml-auto">100% 24mm</span></div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
              {['Now 31° ⛅','2 PM 31° 🌧️','3 PM 30° 🌧️','4 PM 28° ⛈️'].map(c=> <div key={c} className="bg-slate-50 rounded-xl p-2">{c}</div>)}
            </div>
          </div>
          <div className="bg-[#7f1d1d] rounded-3xl p-6 text-white">
            <div className="w-10 h-10 bg-white rounded-full grid place-items-center mx-auto">⚠️</div>
            <p className="text-center text-sm mt-3">Heavy rainfall and flood risk expected. Avoid unnecessary travel.</p>
            <div className="mt-3 bg-white text-red-700 rounded-xl p-3 text-sm flex justify-between"><span>📍 Coastal Regions</span><span>Next 3 Hours</span></div>
          </div>
        </div>
      </div>

      {/* Bottom nav for landing */}
      <div className="md:hidden bg-white border-t flex justify-around py-2 text-[11px] text-slate-500">
        <span className="text-[#0f2942] font-semibold">🏠 Home</span><span>💬 AI Chat</span><span>🗺️ Live Map</span><span>🔔 Alerts</span>
      </div>
    </main>
  );
}
function Feature({icon,title,desc}:{icon:string,title:string,desc:string}){
  return (
    <div className="flex gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100">
      <div className="w-8 h-8 rounded-xl bg-white border grid place-items-center shrink-0">{icon}</div>
      <div><div className="text-sm font-semibold text-[#0f2942]">{title}</div><div className="text-xs text-slate-500 leading-relaxed">{desc}</div></div>
    </div>
  );
}
