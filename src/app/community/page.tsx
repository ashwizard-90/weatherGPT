"use client";
import { useState } from 'react';
import Nav from '@/components/Nav';
import { mockReports } from '@/lib/mockData';

export default function Community(){
  const [reports,setReports]=useState(mockReports);
  const [text,setText]=useState('');
  const [filter,setFilter]=useState<string>('All');
  const submit = (emergency=false)=>{
    if(!text.trim() && !emergency) return;
    const statuses: any[] = ['Unverified','Under Review','Corroborated','Verified'];
    // Simulate verification workflow: new reports start Unverified, after 3 sec corroborated if matches weather
    const newReport:any = { id:'r'+Date.now(), text: text || (emergency?'Emergency: Need help — flooding at my location':''), lat:11.664, lon:78.146, time:'Just now', status:'Unverified', user:'You' };
    setReports([newReport, ...reports]);
    setText('');
    // Simulate verification after 2.5s
    setTimeout(()=>{
      setReports(prev=> prev.map(r=> r.id===newReport.id ? {...r, status: Math.random()>0.5?'Corroborated':'Under Review'} : r));
      setTimeout(()=>{
        setReports(prev=> prev.map(r=> r.id===newReport.id ? {...r, status:'Verified'} : r));
      }, 2500);
    }, 2000);
  };
  const filtered = filter==='All'? reports : reports.filter(r=>r.status===filter);
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="font-bold text-[#0f2942]">👥 Community — Report Local Conditions</div>
        <div className="text-xs text-slate-500">Photo+Voice+Text + Auto GPS + Timestamp → Verification → Local Warning. Never treat single report as truth.</div>
      </header>
      <div className="max-w-3xl mx-auto px-3 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 border">
          <div className="text-sm font-semibold">Report Local Conditions</div>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="This road is flooded... (photo optional during emergency)" className="mt-2 w-full border rounded-xl p-3 text-sm min-h-[80px]"/>
          <div className="mt-2 flex gap-2">
            <button className="px-3 py-1.5 border rounded-full text-xs">📷 Add Photo</button>
            <button className="px-3 py-1.5 border rounded-full text-xs" onClick={()=>{
              const SR:any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
              if(!SR){ alert('Voice not supported'); return; }
              const rec = new SR(); rec.lang='ta-IN'; rec.onresult=(e:any)=> setText(e.results[0][0].transcript); rec.start();
            }}>🎤 Voice</button>
            <span className="ml-auto text-xs text-slate-400">📍 GPS: 11.6643, 78.1460 • {new Date().toLocaleTimeString()}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button onClick={()=>submit(false)} className="bg-[#0f2942] text-white rounded-full py-2.5 text-sm font-semibold">Submit Report</button>
            <button onClick={()=>submit(true)} className="bg-red-600 text-white rounded-full py-2.5 text-sm font-semibold">🚨 One-Tap Emergency Report</button>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">During emergency, photo remains optional • Queued offline if no connectivity</div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All','Unverified','Under Review','Corroborated','Verified'].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} className={`shrink-0 px-3 py-1.5 rounded-full text-xs border ${filter===s?'bg-[#0f2942] text-white border-[#0f2942]':'bg-white'}`}>{s}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(r=>(
            <div key={r.id} className="bg-white rounded-2xl p-4 border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-sm">{r.text}</div>
                  <div className="text-xs text-slate-500 mt-1">📍 {r.lat.toFixed(3)}, {r.lon.toFixed(3)} • {r.time} • by {r.user}</div>
                </div>
                <span className={`shrink-0 px-2 py-1 rounded-full text-[11px] font-semibold border ${
                  r.status==='Verified'?'bg-emerald-50 text-emerald-700 border-emerald-200':
                  r.status==='Corroborated'?'bg-amber-50 text-amber-700 border-amber-200':
                  r.status==='Under Review'?'bg-sky-50 text-sky-700 border-sky-200':'bg-slate-100 text-slate-600'
                }`}>{r.status}</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                Workflow: GPS+Timestamp → Initial Validation → Compare Multiple Reports → Compare Weather/Radar → Compare Official Alerts → Verification
              </div>
              {r.status==='Verified' && <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200 rounded-xl p-2">✅ Verified Local Flood Condition — Local warning issued. Avoid this road.</div>}
            </div>
          ))}
        </div>
      </div>
      <Nav/>
    </div>
  );
}
