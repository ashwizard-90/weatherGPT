"use client";
import { useState, useRef, useMemo } from "react";
import Nav from "@/components/Nav";
import { mockReports, locations } from "@/lib/mockData";

const layers = [
  "Rain",
  "Temperature",
  "Wind",
  "Cloud cover",
  "Radar",
  "Satellite",
  "Lightning",
  "Flood risk",
  "Cyclone track",
  "User reports",
  "Government warnings",
] as const;

type Marker = {
  id: string;
  lat: number;
  lon: number;
  label: string;
  sub: string;
  color: string;
  kind: "city" | "report" | "hazard" | "you";
};

const BOUNDS = { minLat: 8, maxLat: 14, minLon: 76, maxLon: 81 };
const project = (lat: number, lon: number, w: number, h: number) => {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * w;
  const y = h - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * h;
  return { x, y };
};

export default function MapPage() {
  const [activeLayers, setActiveLayers] = useState<string[]>([
    "Rain",
    "Radar",
    "User reports",
  ]);
  const [riskMode, setRiskMode] = useState(false);
  const [selected, setSelected] = useState<Marker | null>(null);
  const [you, setYou] = useState<Marker | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 800;
  const H = 600;

  const toggle = (l: string) =>
    setActiveLayers((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );

  const markers = useMemo<Marker[]>(() => {
    const list: Marker[] = [];
    locations.slice(0, 4).forEach((c) =>
      list.push({
        id: c.id,
        lat: c.lat,
        lon: c.lon,
        label: c.name,
        sub: `${c.state} • ${c.name === "Salem" ? "31°C • 85% rain" : "28°C • 30% rain"}`,
        color: "#0f2942",
        kind: "city",
      }),
    );
    if (activeLayers.includes("Government warnings") || activeLayers.includes("Rain")) {
      list.push({
        id: "salem-hazard",
        lat: 11.6643,
        lon: 78.146,
        label: "Salem — CRITICAL",
        sub: "Heavy Rain 85% • Coastal flood risk next 3h",
        color: riskMode ? "#dc2626" : "#ef4444",
        kind: "hazard",
      });
    }
    if (activeLayers.includes("User reports")) {
      mockReports.forEach((r) =>
        list.push({
          id: r.id,
          lat: r.lat,
          lon: r.lon,
          label: r.text,
          sub: `${r.status} • ${r.time} • ${r.user}`,
          color:
            r.status === "Verified"
              ? "#059669"
              : r.status === "Corroborated"
                ? "#f59e0b"
                : "#64748b",
          kind: "report",
        }),
      );
    }
    if (you) list.push(you);
    return list;
  }, [activeLayers, riskMode, you]);

  const goMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setYou({
          id: "you",
          lat: latitude,
          lon: longitude,
          label: "You are here",
          sub: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          color: "#0ea5e9",
          kind: "you",
        });
      },
      () => alert('Location permission denied. Enable location for "My Location".'),
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="font-bold text-[#0f2942]">🗺️ Live Weather Map</div>
        <div className="flex gap-2">
          <button
            onClick={() => setRiskMode(!riskMode)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${riskMode ? "bg-red-600 text-white border-red-600" : "bg-white hover:bg-slate-50"}`}
          >
            ⚠️ Risk
          </button>
          <button
            onClick={goMyLocation}
            className="px-3 py-1.5 rounded-full text-xs border bg-white hover:bg-slate-50"
          >
            📍 My Location
          </button>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-4 gap-0">
        <div className="lg:col-span-3 relative bg-gradient-to-br from-sky-50 to-slate-100 h-[55vh] lg:h-[calc(100vh-112px)] overflow-hidden">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <rect width={W} height={H} fill="#e0f2fe" />
            <path
              d="M 200,40 Q 300,80 400,60 T 620,120 Q 700,200 660,320 T 520,520 Q 400,560 300,500 T 160,360 Q 120,240 200,40 Z"
              fill="#dcfce7"
              stroke="#86efac"
              strokeWidth={2}
            />
            {[1, 2, 3, 4].map((i) => (
              <line key={`h${i}`} x1={0} y1={(i * H) / 5} x2={W} y2={(i * H) / 5} stroke="#bae6fd" strokeWidth={0.5} strokeDasharray="4 4" />
            ))}
            {[1, 2, 3, 4].map((i) => (
              <line key={`v${i}`} x1={(i * W) / 5} y1={0} x2={(i * W) / 5} y2={H} stroke="#bae6fd" strokeWidth={0.5} strokeDasharray="4 4" />
            ))}

            {activeLayers.includes("Rain") && (
              (() => {
                const p = project(11.66, 78.14, W, H);
                return <circle cx={p.x} cy={p.y} r={70} fill="#0ea5e9" fillOpacity={0.15} stroke="#0ea5e9" strokeOpacity={0.3} />;
              })()
            )}
            {(activeLayers.includes("Flood risk") || riskMode) && (
              (() => {
                const p = project(11.5, 78.0, W, H);
                return <circle cx={p.x} cy={p.y} r={95} fill="#dc2626" fillOpacity={0.1} stroke="#dc2626" strokeOpacity={0.4} />;
              })()
            )}

            {markers.map((m) => {
              const p = project(m.lat, m.lon, W, H);
              const r = m.kind === "hazard" ? 10 : m.kind === "city" ? 6 : m.kind === "you" ? 8 : 7;
              return (
                <g key={m.id} className="cursor-pointer" onClick={() => setSelected(m)}>
                  {m.kind === "hazard" && (
                    <circle cx={p.x} cy={p.y} r={r + 6} fill={m.color} opacity={0.2}>
                      <animate attributeName="r" values={`${r + 4};${r + 10};${r + 4}`} dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={p.x} cy={p.y} r={r} fill={m.color} stroke="#fff" strokeWidth={2} />
                  {m.kind === "you" && (
                    <circle cx={p.x} cy={p.y} r={r + 4} fill="none" stroke={m.color} strokeWidth={2}>
                      <animate attributeName="r" values={`${r};${r + 8}`} dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1.5 text-xs shadow border pointer-events-none">
            Salem, TN • 31°C • 85% rain • {activeLayers.join(", ")}
          </div>

          {selected && (
            <div className="absolute top-3 right-3 max-w-xs bg-white rounded-2xl shadow-lg border p-3 z-20">
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs font-bold text-[#0f2942]">{selected.label}</div>
                <button onClick={() => setSelected(null)} className="text-slate-400 text-xs">✕</button>
              </div>
              <div className="text-[11px] text-slate-600 mt-1">{selected.sub}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                📍 {selected.lat.toFixed(3)}, {selected.lon.toFixed(3)}
              </div>
            </div>
          )}

          <div className="absolute bottom-3 left-3 right-3 bg-white rounded-2xl shadow-lg border p-3 flex items-center gap-3">
            <span className="text-xs font-semibold">Timeline</span>
            <input type="range" min={0} max={100} defaultValue={30} className="flex-1 accent-[#0f2942]" />
            <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">Now • +6h • +12h</span>
          </div>
        </div>

        <div className="bg-white border-t lg:border-t-0 lg:border-l p-4 space-y-4 overflow-auto">
          <div>
            <div className="text-sm font-semibold">Layers</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {layers.map((l) => (
                <button
                  key={l}
                  onClick={() => toggle(l)}
                  className={`px-2.5 py-1.5 rounded-full text-xs border ${activeLayers.includes(l) ? "bg-[#0f2942] text-white border-[#0f2942]" : "bg-white hover:bg-slate-50"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">
              Toggle layers to update map overlays live
            </div>
          </div>
          <div className="border rounded-2xl p-3">
            <div className="text-sm font-semibold">Active Hazards</div>
            <div className="mt-2 space-y-2 text-xs">
              <div className="flex justify-between bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <span>🔴 Heavy Rain — Salem</span>
                <span className="font-bold text-red-600">Critical</span>
              </div>
              <div className="flex justify-between bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <span>🟡 Flood Risk — Coastal</span>
                <span className="font-bold text-amber-600">Moderate</span>
              </div>
              <div className="flex justify-between bg-sky-50 border border-sky-200 rounded-xl px-3 py-2">
                <span>🔵 Strong Wind — Offshore</span>
                <span className="font-bold text-sky-600">Moderate</span>
              </div>
            </div>
          </div>
          <div className="border rounded-2xl p-3">
            <div className="text-sm font-semibold">Community Reports on Map</div>
            <div className="mt-2 space-y-2">
              {mockReports.slice(0, 3).map((r) => (
                <div key={r.id} className="border rounded-xl p-2.5">
                  <div className="text-xs">📍 {r.text}</div>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>{r.time} • {r.user}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${r.status === "Verified" ? "bg-emerald-100 text-emerald-700" : r.status === "Corroborated" ? "bg-amber-100 text-amber-700" : "bg-slate-100"}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Nav />
    </div>
  );
}
