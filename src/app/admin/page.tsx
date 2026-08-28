"use client";
import { useState } from "react";
import Nav from "@/components/Nav";
import { mockReports, mockAlerts } from "@/lib/mockData";

export default function Admin() {
  const [reports, setReports] = useState(mockReports);
  const verify = (id: string) =>
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Verified" as any } : r)),
    );
  const reject = (id: string) =>
    setReports((prev) => prev.filter((r) => r.id !== id));
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center p-4">
        <div className="bg-white rounded-2xl p-6 border w-full max-w-sm">
          <div className="font-bold text-[#0f2942]">
            🛡️ Admin / Disaster Management
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Role-based access control. Enter admin key (demo: admin123)
          </div>
          <input
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="Admin key"
            type="password"
            className="mt-3 w-full border rounded-xl px-3 py-2 text-sm"
          />
          <button
            onClick={() =>
              pwd === "admin123"
                ? setAuthed(true)
                : alert("Invalid key — try admin123 for demo")
            }
            className="mt-3 w-full bg-[#0f2942] text-white rounded-full py-2 text-sm"
          >
            Unlock Dashboard
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="bg-[#0f2942] text-white px-4 py-3 sticky top-0 z-10 flex items-center justify-between">
        <div className="font-bold">
          🛡️ Admin — Disaster Management Dashboard
        </div>
        <span className="text-xs bg-white text-[#0f2942] px-2 py-1 rounded-full">
          Authorized
        </span>
      </header>
      <div className="max-w-6xl mx-auto px-3 py-4 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 border">
              <div className="text-xs text-slate-500">Active Alerts</div>
              <div className="text-2xl font-bold text-red-600">1 Critical</div>
              <div className="text-xs text-slate-400">+2 normal</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border">
              <div className="text-xs text-slate-500">Affected Regions</div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-slate-400">Coastal TN + Salem</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border">
              <div className="text-xs text-slate-500">Reports Queue</div>
              <div className="text-2xl font-bold">{reports.length}</div>
              <div className="text-xs text-slate-400">Pending verification</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-sm font-semibold">
              Community Reports — Review Queue
            </div>
            <div className="mt-3 space-y-2">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="border rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="text-sm">{r.text}</div>
                    <div className="text-xs text-slate-500">
                      📍 {r.lat.toFixed(3)}, {r.lon.toFixed(3)} • {r.time} •{" "}
                      {r.user} •{" "}
                      <span className="font-semibold">{r.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => verify(r.id)}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-full text-xs"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => reject(r.id)}
                      className="px-3 py-1.5 bg-slate-200 rounded-full text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-sm font-semibold">System Health</div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Weather API</span>
                <span className="text-emerald-600">✓ Healthy</span>
              </div>
              <div className="flex justify-between">
                <span>Radar</span>
                <span className="text-emerald-600">✓ Healthy</span>
              </div>
              <div className="flex justify-between">
                <span>Satellite (MOSDAC)</span>
                <span className="text-amber-600">⚠ Degraded</span>
              </div>
              <div className="flex justify-between">
                <span>Govt Warnings</span>
                <span className="text-emerald-600">✓ Healthy</span>
              </div>
              <div className="flex justify-between">
                <span>Redis Cache</span>
                <span className="text-emerald-600">✓ 2 min freshness</span>
              </div>
            </div>
            <button
              onClick={() =>
                alert(
                  "Issued update: Heavy rain warning extended 6 hours (demo)",
                )
              }
              className="mt-3 w-full bg-red-600 text-white rounded-full py-2 text-sm"
            >
              Issue/Update Warning
            </button>
          </div>
          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-sm font-semibold">Alert History</div>
            <div className="mt-2 space-y-2 text-xs">
              {mockAlerts.map((a) => (
                <div
                  key={a.id}
                  className="border rounded-xl px-3 py-2 flex justify-between"
                >
                  <span>{a.title}</span>
                  <span
                    className={
                      a.type === "critical"
                        ? "text-red-600 font-bold"
                        : "text-slate-500"
                    }
                  >
                    {a.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border">
            <div className="text-sm font-semibold">Audit Logs</div>
            <div className="text-xs text-slate-500 mt-1">
              admin@weathergpt verified report r1 • 10 min ago
              <br />
              system issued critical alert a1 • 25 min ago
            </div>
          </div>
        </div>
      </div>
      <Nav />
    </div>
  );
}
