"use client";
export function getProfile(){ if(typeof window==='undefined') return null; try{ return JSON.parse(localStorage.getItem('weathergpt_profile')||'null'); }catch{return null;}}
export function setProfile(p:any){ localStorage.setItem('weathergpt_profile', JSON.stringify(p)); }
export function getAuth(){ if(typeof window==='undefined') return null; try{ return JSON.parse(localStorage.getItem('weathergpt_auth')||'null'); }catch{return null;}}
export function setAuth(a:any){ localStorage.setItem('weathergpt_auth', JSON.stringify(a)); }
export function clearAll(){ localStorage.removeItem('weathergpt_profile'); localStorage.removeItem('weathergpt_auth'); }
