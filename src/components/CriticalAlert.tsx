"use client";
export default function CriticalAlert({ onDismiss }:{onDismiss?:()=>void}){
  return (
    <div className="bg-gradient-to-b from-[#7f1d1d] to-[#dc2626] text-white rounded-2xl p-4 md:p-6 shadow-xl border border-red-900/20">
      <div className="flex justify-center mb-3"><div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">⚠️</div></div>
      <div className="text-center">
        <div className="font-mono text-xs tracking-widest opacity-80">கனமழை மற்றும் வெள்ள அபாயம் எதிர்பார்க்கப்படுகிறது. தேவையற்ற பயணங்களைத் தவிர்க்கவும்.</div>
        <p className="text-sm mt-2 font-medium">Heavy rainfall and flood risk are expected. Avoid unnecessary travel.</p>
        <div className="mt-4 grid grid-cols-1 gap-2 text-sm">
          <div className="bg-white text-red-700 rounded-xl p-2.5 flex justify-between"><span>📍 Coastal Regions</span><span className="opacity-60">Next 3 Hours</span></div>
          <div className="flex gap-2">
            <button className="flex-1 bg-white text-red-700 rounded-xl py-2.5 font-semibold">📍 Find Safe Route</button>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/20 backdrop-blur rounded-xl py-2.5">🏠 Nearest Shelter</button>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-white text-slate-900 rounded-xl py-2.5">🔊 Playing Voice Alert…</button>
          </div>
        </div>
      </div>
    </div>
  );
}
