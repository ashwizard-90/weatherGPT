"use client";
import { useState, useEffect, useRef } from 'react';
import Nav from '@/components/Nav';
import { mockReports } from '@/lib/mockData';

const layers = ['Rain','Temperature','Wind','Cloud cover','Radar','Satellite','Lightning','Flood risk','Cyclone track','User reports','Government warnings'] as const;

// Your Google Maps JS API key from Google Console
const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAC5Z1irvXGd16Yoyf8gYg9yjjKHBphW-w';

declare global { interface Window { google: any; initWeatherMap?: ()=>void; } }

export default function MapPage(){
  const [activeLayers,setActiveLayers]=useState<string[]>(['Rain','Radar','User reports']);
  const [riskMode,setRiskMode]=useState(false);
  const [status,setStatus]=useState<'loading'|'ready'|'error'>('loading');
  const [errorMsg,setErrorMsg]=useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const circlesRef = useRef<any[]>([]);

  const toggle = (l:string)=> setActiveLayers(prev=> prev.includes(l)? prev.filter(x=>x!==l): [...prev,l]);

  // Load Google Maps JS
  useEffect(()=>{
    if (typeof window==='undefined') return;
    if (window.google?.maps) { initMap(); return; }

    const existing = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existing) {
      existing.addEventListener('load', initMap);
      existing.addEventListener('error', ()=>{ setStatus('error'); setErrorMsg('Google Maps script failed to load — check key, billing, and HTTP referrer restrictions.'); });
      return;
    }

    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=marker&loading=async`;
    s.async = true;
    s.defer = true;
    s.onload = initMap;
    s.onerror = ()=>{ setStatus('error'); setErrorMsg('Failed to load Google Maps. Common causes: 1) Billing not enabled 2) Maps JavaScript API not enabled 3) HTTP referrer blocked. Check Google Console → Credentials → your key → Application restrictions.'); };
    document.head.appendChild(s);

    function initMap(){
      if (!mapRef.current || !window.google) return;
      try {
        const salem = { lat: 11.6643, lng: 78.1460 };
        const map = new window.google.maps.Map(mapRef.current, {
          center: salem,
          zoom: 7,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });
        mapInstance.current = map;
        setStatus('ready');
        // Add listeners for auth failure (Google sends window.gm_authFailure)
        (window as any).gm_authFailure = ()=>{
          setStatus('error');
          setErrorMsg('Google Maps authentication failed: Invalid key or HTTP referrer not allowed. Go to Google Console → APIs & Services → Credentials → Edit your key → Add http://localhost:3000/* to HTTP referrers, and enable Maps JavaScript API + Geocoding API. Also enable Billing.');
        };
        renderOverlays(map);
      } catch(e:any){
        setStatus('error'); setErrorMsg(e.message);
      }
    }
  }, []);

  // Re-render overlays when layers change
  useEffect(()=>{
    if (mapInstance.current && window.google) {
      clearOverlays();
      renderOverlays(mapInstance.current);
    }
  }, [activeLayers, riskMode]);

  function clearOverlays(){
    markersRef.current.forEach(m=> m.map=null);
    markersRef.current=[];
    circlesRef.current.forEach(c=> c.map=null);
    circlesRef.current=[];
  }

  function renderOverlays(map:any){
    if(!window.google) return;
    const g = window.google.maps;

    // Salem main marker — critical heavy rain
    if (activeLayers.includes('Government warnings') || activeLayers.includes('Rain') || true) {
      const marker = new g.Marker({
        position: { lat: 11.6643, lng: 78.1460 },
        map,
        title: 'Salem, TN — 31°C • 85% rain • CRITICAL Heavy Rain',
        icon: {
          path: g.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: riskMode ? '#dc2626' : '#ef4444',
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 2,
        }
      });
      const info = new g.InfoWindow({ content: `<div style="font:12px sans-serif"><b>🔴 Salem, TN</b><br/>31°C • Humidity 65%<br/>Heavy Rain 85% • CRITICAL<br/>Coastal flood risk next 3h</div>` });
      marker.addListener('click', ()=> info.open({ map, anchor: marker }));
      markersRef.current.push(marker);

      // Rain circle
      if (activeLayers.includes('Rain')) {
        const circle = new g.Circle({
          map,
          center: { lat: 11.66, lng: 78.14 },
          radius: 40000,
          fillColor: '#0ea5e9',
          fillOpacity: 0.12,
          strokeColor: '#0ea5e9',
          strokeOpacity: 0.3,
          strokeWeight: 1,
        });
        circlesRef.current.push(circle);
      }
      // Flood risk
      if (activeLayers.includes('Flood risk') || riskMode) {
        const flood = new g.Circle({
          map,
          center: { lat: 11.5, lng: 78.0 },
          radius: 60000,
          fillColor: '#dc2626',
          fillOpacity: 0.10,
          strokeColor: '#dc2626',
          strokeOpacity: 0.4,
        });
        circlesRef.current.push(flood);
      }
    }

    // Community reports
    if (activeLayers.includes('User reports')) {
      mockReports.forEach(r=>{
        const m = new g.Marker({
          position: { lat: r.lat, lng: r.lon },
          map,
          title: `${r.text} • ${r.status}`,
          icon: {
            path: g.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: r.status==='Verified' ? '#059669' : r.status==='Corroborated' ? '#f59e0b' : '#64748b',
            fillOpacity: 0.9,
            strokeColor: '#fff',
            strokeWeight: 1.5,
          }
        });
        const info = new g.InfoWindow({ content: `<div style="font:11px sans-serif"><b>${r.text}</b><br/>${r.status} • ${r.time} • ${r.user}</div>` });
        m.addListener('click', ()=> info.open({ map, anchor: m }));
        markersRef.current.push(m);
      });
    }

    // Additional city markers
    const cities = [
      { lat: 13.0827, lng: 80.2707, name: 'Chennai • 60% rain' },
      { lat: 11.0168, lng: 76.9558, name: 'Coimbatore • 20% rain' },
      { lat: 9.9252, lng: 78.1198, name: 'Madurai • 30% rain' },
    ];
    cities.forEach(c=>{
      const m = new g.Marker({ position: { lat: c.lat, lng: c.lng }, map, title: c.name,
        icon: { path: g.SymbolPath.CIRCLE, scale: 6, fillColor: '#0f2942', fillOpacity:0.8, strokeColor:'#fff', strokeWeight:1.5 }
      });
      markersRef.current.push(m);
    });
  }

  const goMyLocation = ()=>{
    if(!navigator.geolocation){ alert('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(pos=>{
      const { latitude, longitude } = pos.coords;
      if (mapInstance.current) {
        mapInstance.current.setCenter({ lat: latitude, lng: longitude });
        mapInstance.current.setZoom(11);
        new window.google.maps.Marker({ position: { lat: latitude, lng: longitude }, map: mapInstance.current, title: 'You are here', icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor:'#0ea5e9', fillOpacity:1, strokeColor:'#fff', strokeWeight:2 } });
      }
    }, ()=> alert('Location permission denied. Enable location for "My Location".'));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="font-bold text-[#0f2942]">🗺️ Live Weather Map <span className="text-[10px] font-normal text-slate-400 ml-2 hidden md:inline">Google Maps • {GOOGLE_KEY.slice(0,12)}...</span></div>
        <div className="flex gap-2">
          <button onClick={()=>setRiskMode(!riskMode)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${riskMode?'bg-red-600 text-white border-red-600':'bg-white hover:bg-slate-50'}`}>⚠️ Risk</button>
          <button onClick={goMyLocation} className="px-3 py-1.5 rounded-full text-xs border bg-white hover:bg-slate-50">📍 My Location</button>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-4 gap-0">
        <div className="lg:col-span-3 relative bg-slate-100 h-[55vh] lg:h-[calc(100vh-112px)] overflow-hidden">
          {/* Real Google Map */}
          <div ref={mapRef} className="absolute inset-0" />

          {/* Status overlay */}
          {status==='loading' && (
            <div className="absolute inset-0 grid place-items-center bg-white/60 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-lg border px-6 py-4 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-slate-300 border-t-[#0f2942] rounded-full mx-auto"/>
                <div className="text-sm font-semibold mt-2">Loading Google Maps…</div>
                <div className="text-xs text-slate-500">Key: {GOOGLE_KEY.slice(0,16)}…</div>
              </div>
            </div>
          )}
          {status==='error' && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur p-4 overflow-auto">
              <div className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="font-bold text-red-700">⚠️ Map failed to load</div>
                <div className="text-xs text-slate-700 mt-2 leading-relaxed">{errorMsg}</div>
                <div className="text-xs bg-white border rounded-xl p-3 mt-3 leading-relaxed">
                  <b>Fix in Google Console:</b><br/>
                  1. Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="text-sky-600 underline">console.cloud.google.com/apis/credentials</a><br/>
                  2. Click your key <code>AIzaSyAC5Z1irvXGd16Yoyf8gYg9yjjKHBphW-w</code><br/>
                  3. Application restrictions → <b>Website restrictions</b> → Add:<br/>
                  <code className="bg-slate-100 px-1">http://localhost:3000/*</code><br/>
                  <code className="bg-slate-100 px-1">http://localhost:3001/*</code><br/>
                  <code className="bg-slate-100 px-1">https://yourdomain.com/*</code><br/>
                  4. API restrictions → Enable <b>Maps JavaScript API</b> + <b>Geocoding API</b><br/>
                  5. <b>Billing</b> must be enabled (even free tier).<br/>
                  6. Save → wait 2-5 min → hard refresh.
                </div>
                <button onClick={()=>location.reload()} className="mt-3 w-full bg-[#0f2942] text-white rounded-full py-2 text-sm">Reload Page</button>
                <div className="text-[11px] text-slate-400 mt-2">Fallback mock shown below if Google is blocked. Check browser console (F12) for <code>Google Maps API error: RefererNotAllowedMapError</code>.</div>
              </div>
            </div>
          )}

          {/* Top badge */}
          <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1.5 text-xs shadow border pointer-events-none">Salem, TN • 31°C • 85% rain • {activeLayers.join(', ')}</div>

          {/* Timeline */}
          <div className="absolute bottom-3 left-3 right-3 bg-white rounded-2xl shadow-lg border p-3 flex items-center gap-3">
            <span className="text-xs font-semibold">Timeline</span>
            <input type="range" min={0} max={100} defaultValue={30} className="flex-1 accent-[#0f2942]"/>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">Now • +6h • +12h</span>
          </div>
        </div>

        <div className="bg-white border-t lg:border-t-0 lg:border-l p-4 space-y-4 overflow-auto">
          <div>
            <div className="text-sm font-semibold">Layers</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {layers.map(l=>(
                <button key={l} onClick={()=>toggle(l)} className={`px-2.5 py-1.5 rounded-full text-xs border ${activeLayers.includes(l)?'bg-[#0f2942] text-white border-[#0f2942]':'bg-white hover:bg-slate-50'}`}>{l}</button>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">Toggle layers updates Google Maps markers/circles live</div>
          </div>
          <div className="border rounded-2xl p-3">
            <div className="text-sm font-semibold">Active Hazards</div>
            <div className="mt-2 space-y-2 text-xs">
              <div className="flex justify-between bg-red-50 border border-red-200 rounded-xl px-3 py-2"><span>🔴 Heavy Rain — Salem</span><span className="font-bold text-red-600">Critical</span></div>
              <div className="flex justify-between bg-amber-50 border border-amber-200 rounded-xl px-3 py-2"><span>🟡 Flood Risk — Coastal</span><span className="font-bold text-amber-600">Moderate</span></div>
              <div className="flex justify-between bg-sky-50 border border-sky-200 rounded-xl px-3 py-2"><span>🔵 Strong Wind — Offshore</span><span className="font-bold text-sky-600">Moderate</span></div>
            </div>
          </div>
          <div className="border rounded-2xl p-3">
            <div className="text-sm font-semibold">Community Reports on Map</div>
            <div className="mt-2 space-y-2">
              {mockReports.slice(0,3).map(r=>(
                <div key={r.id} className="border rounded-xl p-2.5">
                  <div className="text-xs">📍 {r.text}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between"><span>{r.time} • {r.user}</span><span className={`px-1.5 py-0.5 rounded-full text-[10px] ${r.status==='Verified'?'bg-emerald-100 text-emerald-700': r.status==='Corroborated'?'bg-amber-100 text-amber-700':'bg-slate-100'}`}>{r.status}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 border rounded-xl p-2 text-[11px] text-slate-500">
            Key loaded from <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>. If you see <code>RefererNotAllowedMapError</code>, add <code>http://localhost:3000/*</code> in Google Console → Credentials → HTTP referrers. Ensure Billing is enabled.
          </div>
        </div>
      </div>
      <Nav/>
    </div>
  );
}
