"use client";
import Nav from '@/components/Nav';
export default function Emergency(){
  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="font-extrabold flex items-center gap-2">🚨 EMERGENCY MODE</div>
        <span className="text-xs bg-white text-red-600 px-2 py-1 rounded-full font-bold">LIVE</span>
      </div>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-red-200">
          <div className="text-sm font-bold text-red-600">🔴 Critical: Heavy Rainfall & Flood Risk — Salem & Coastal TN</div>
          <div className="text-xs text-slate-500 mt-1">📍 Your location: 11.6643, 78.1460 • Risk Level: CRITICAL • Updated 1 min ago</div>
          <p className="text-xs mt-2 font-mono">உங்கள் பகுதியில் கனமழை மற்றும் வெள்ள அபாயம் உள்ளது. பாதுகாப்பான பகுதிக்கு செல்லவும்.<br/>Heavy rainfall and flood risk. Move to safe zone, avoid low-lying roads.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <a href="https://www.google.com/maps/search/shelters+near+Salem" target="_blank" className="bg-white rounded-2xl p-4 border text-center hover:shadow">
            <div className="text-2xl">🏠</div><div className="text-sm font-semibold mt-1">Nearest Shelter</div><div className="text-xs text-slate-500">2.3 km • Govt School</div>
          </a>
          <a href="https://www.google.com/maps/search/hospitals+near+Salem" target="_blank" className="bg-white rounded-2xl p-4 border text-center hover:shadow">
            <div className="text-2xl">🏥</div><div className="text-sm font-semibold mt-1">Nearest Hospital</div><div className="text-xs text-slate-500">1.8 km • Salem GH</div>
          </a>
          <button className="bg-[#0f2942] text-white rounded-2xl p-4">
            <div className="text-2xl">🗺️</div><div className="text-sm font-semibold mt-1">Find Safe Route</div><div className="text-xs opacity-80">Avoid flooded roads</div>
          </button>
          <button onClick={()=>{
            if(navigator.share) navigator.share({title:'WeatherGPT Critical Alert', text:'Heavy rainfall flood risk in Salem — Avoid unnecessary travel. Via WeatherGPT'});
            else alert('Alert copied — share via WhatsApp/SMS');
          }} className="bg-white rounded-2xl p-4 border">
            <div className="text-2xl">📤</div><div className="text-sm font-semibold mt-1">Share Alert</div><div className="text-xs text-slate-500">Family & contacts</div>
          </button>
        </div>
        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Safe Zones vs Avoid</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
              <div className="font-semibold text-emerald-700">✓ Safe</div>
              <div>• Salem GH Road (elevated)</div><div>• Collector Office Shelter</div><div>• NH-44 (high ground)</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <div className="font-semibold text-red-700">✕ Avoid</div>
              <div>• Market Road (flooded)</div><div>• River bridge (closed)</div><div>• Low-lying coastal road</div>
            </div>
          </div>
        </div>
        <div className="bg-[#0f2942] text-white rounded-2xl p-4">
          <div className="text-sm font-semibold">Emergency Contacts</div>
          <div className="mt-2 space-y-2 text-sm">
            <a href="tel:112" className="flex justify-between bg-white/10 rounded-xl px-3 py-2"><span>🚨 National Emergency</span><span className="font-bold">112</span></a>
            <a href="tel:1077" className="flex justify-between bg-white/10 rounded-xl px-3 py-2"><span>🛟 Disaster Mgmt</span><span className="font-bold">1077</span></a>
            <a href="tel:101" className="flex justify-between bg-white/10 rounded-xl px-3 py-2"><span>🚒 Fire</span><span>101</span></a>
          </div>
          <div className="text-[11px] opacity-70 mt-3">Family Safety Mode — trusted contacts will be notified automatically if enabled.</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Latest Official Warning</div>
          <div className="text-xs text-slate-500 mt-1">IMD Bulletin • 28 Aug 2026, 11:00 IST — Heavy to very heavy rainfall likely over Coastal Tamil Nadu next 12 hours.</div>
          <div className="text-xs text-slate-500 mt-2">Verified Community Reports: 2 verified flood reports near Salem market (10–25 min ago) corroborate radar.</div>
        </div>
      </div>
      <Nav/>
    </div>
  );
}
