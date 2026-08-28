"use client";
import { useState } from 'react';
import Nav from '@/components/Nav';

export default function History(){
  const [loc,setLoc]=useState('Salem');
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
        <div className="font-bold text-[#0f2942]">📊 Historical Weather & Climate Analytics</div>
        <select value={loc} onChange={e=>setLoc(e.target.value)} className="border rounded-full px-3 py-1.5 text-sm"><option>Salem</option><option>Chennai</option><option>Mumbai</option></select>
      </header>
      <div className="max-w-6xl mx-auto px-3 py-4 grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Rainfall History — Last 7 Days (mm)</div>
          <div className="text-xs text-slate-500">Location: {loc} • Choose date range</div>
          <div className="mt-4 flex items-end gap-1 h-32">
            {[12,8,20,35,5,2,15,28,10,4,18,22].map((v,i)=>(
              <div key={i} className="flex-1 bg-sky-500 rounded-t-lg" style={{height: `${v*3}px`}} title={`${v}mm`}/>
            ))}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Bar chart • Historical observations (not forecast)</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Temperature Trend — Last 30 Days (°C)</div>
          <div className="mt-4 h-32 relative border-b border-l border-slate-200 p-2">
            <svg viewBox="0 0 200 80" className="w-full h-full">
              <polyline fill="none" stroke="#0f2942" strokeWidth="2" points="0,60 20,55 40,50 60,30 80,45 100,20 120,35 140,40 160,25 180,30 200,15"/>
              <polyline fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" points="0,65 200,20"/>
            </svg>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Line chart • Compare: this year vs last year • AI explains trends, not prediction</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Extreme Events — Seasonal Patterns</div>
          <div className="mt-3 grid grid-cols-7 gap-1">
            {Array.from({length:35}).map((_,i)=>{
              const intensity = ((i * 7 + 3) % 10) / 10;
              return <div key={i} className={`h-6 rounded ${intensity>0.8?'bg-red-500': intensity>0.5?'bg-amber-400': intensity>0.3?'bg-sky-300':'bg-slate-100'}`}/>;
            })}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">Heatmap • Frequency of heavy rain / heatwave days per week • 2024 vs 2026</div>
        </div>
        <div className="bg-[#0f2942] text-white rounded-2xl p-4">
          <div className="text-sm font-semibold">Climate Analytics (Research Section)</div>
          <ul className="text-xs mt-2 space-y-1 opacity-90 list-disc list-inside">
            <li>Temperature trend: +0.8°C/decade for Salem (observed)</li>
            <li>Rainfall: monsoon advance 5 days earlier vs 2010 avg</li>
            <li>Extreme weather frequency: +18% heavy rain events since 2020</li>
            <li>Location comparison: Coastal TN more flood-prone than interior</li>
          </ul>
          <div className="text-[11px] opacity-60 mt-3">Clearly distinguish: Historical observations vs Forecasts vs AI explanations</div>
        </div>
      </div>
      <Nav/>
    </div>
  );
}
