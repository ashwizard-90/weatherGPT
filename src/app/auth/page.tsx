"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuth } from "@/lib/storage";

export default function Auth() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const doLogin = (provider: string) => {
    setAuth({
      provider,
      name: "Arun Kumar",
      email: email || "arun@example.com",
      loggedAt: new Date().toISOString(),
    });
    router.push("/onboarding");
  };
  return (
    <main className="min-h-screen bg-[#0b1e33] md:bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0f2942] text-white grid place-items-center">
            ☁️
          </div>
          <h1 className="font-extrabold text-[#0f2942] mt-3">WeatherGPT</h1>
          <p className="text-xs text-slate-500">From Forecast to Action.</p>
          <p className="text-[11px] text-slate-400 mt-2">
            Real-time weather intelligence, personalized advice and safety
            alerts — wherever you are.
          </p>
        </div>
        <div className="mt-6 space-y-2">
          <button
            onClick={() => doLogin("google")}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-full py-2.5 text-sm hover:bg-slate-50"
          >
            <span>🔵</span> Continue with Google
          </button>
          <button
            onClick={() => doLogin("apple")}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-full py-2.5 text-sm hover:bg-slate-50"
          >
            <span>🍎</span> Continue with Apple
          </button>
          <button
            onClick={() => doLogin("microsoft")}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 rounded-full py-2.5 text-sm hover:bg-slate-50"
          >
            <span>🪟</span> Continue with Microsoft
          </button>
        </div>
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">OR</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        {!emailMode ? (
          <>
            <label className="text-xs font-semibold text-slate-700">
              Mobile Number
            </label>
            <div className="mt-1 flex gap-2">
              <div className="flex items-center gap-1 border rounded-xl px-2 text-sm bg-slate-50">
                <span>🇮🇳</span>+91
              </div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter mobile number"
                className="flex-1 border rounded-xl px-3 py-2.5 text-sm"
              />
            </div>
            <button
              onClick={() => doLogin("phone")}
              className="mt-3 w-full bg-[#0f2942] text-white rounded-full py-2.5 text-sm font-semibold"
            >
              Send OTP
            </button>
            <button
              onClick={() => setEmailMode(true)}
              className="w-full text-xs text-sky-600 mt-3"
            >
              Continue with Email
            </button>
          </>
        ) : (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full border rounded-xl px-3 py-2.5 text-sm"
            />
            <input
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full border rounded-xl px-3 py-2.5 text-sm mt-2"
            />
            <button
              onClick={() => doLogin("email")}
              className="mt-3 w-full bg-[#0f2942] text-white rounded-full py-2.5 text-sm font-semibold"
            >
              Continue with Email
            </button>
            <button
              onClick={() => setEmailMode(false)}
              className="w-full text-xs text-sky-600 mt-3"
            >
              Use Phone instead
            </button>
          </>
        )}
        <p className="text-[10px] text-center text-slate-400 mt-4">
          🔒 Privacy-first weather intelligence
        </p>
      </div>
    </main>
  );
}
