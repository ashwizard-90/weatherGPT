"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const items = [
  { href:'/dashboard', label:'Home', icon:'🏠' },
  { href:'/chat', label:'AI Chat', icon:'💬' },
  { href:'/map', label:'Live Map', icon:'🗺️' },
  { href:'/alerts', label:'Alerts', icon:'🔔' },
  { href:'/community', label:'Community', icon:'👥' },
  { href:'/emergency', label:'Safety', icon:'🛟' },
  { href:'/history', label:'History', icon:'📊' },
  { href:'/settings', label:'Profile', icon:'👤' },
];
export default function Nav({ critical=false }:{critical?:boolean}){
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-1.5 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0 md:py-0 md:sticky">
      {/* Mobile top alert bar */}
      <div className="hidden">{critical}</div>
      <div className="flex w-full max-w-6xl mx-auto justify-around md:justify-start md:gap-1 md:px-6">
        {items.map(i=>{
          const active = path.startsWith(i.href);
          return (
            <Link key={i.href} href={i.href} className={`flex flex-col md:flex-row items-center gap-0.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-xl text-[11px] md:text-sm ${active?'bg-[#0f2942] text-white':'text-slate-600 hover:bg-slate-100'}`}>
              <span>{i.icon}</span><span className="hidden md:inline">{i.label}</span><span className="md:hidden leading-none">{i.label}</span>
            </Link>
          );
        })}
        <Link href="/admin" className="hidden md:flex items-center gap-2 ml-auto px-3 py-1.5 rounded-xl text-sm border border-slate-200">🛡️ Admin</Link>
      </div>
    </nav>
  );
}
