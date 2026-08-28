// Weather Engine: fuses multi-source data, validates, computes confidence
export type SourceData = { provider:string; temp:number; rainProb:number; humidity:number; windSpeed:number; timestamp:string };
export function fuseWeather(sources: SourceData[]){
  if(!sources.length) return null;
  const now = Date.now();
  const valid = sources.filter(s=>{
    const age = now - new Date(s.timestamp).getTime();
    return age < 30*60*1000 && s.rainProb>=0 && s.rainProb<=100 && s.temp>-60 && s.temp<60;
  });
  if(!valid.length) return { error:'All sources stale or invalid', sources };
  const avg = (arr:number[])=> arr.reduce((a,b)=>a+b,0)/arr.length;
  const rainProbs = valid.map(s=>s.rainProb);
  const variance = Math.max(...rainProbs)-Math.min(...rainProbs);
  let confidence: 'High'|'Medium'|'Low' = variance<10?'High': variance<20?'Medium':'Low';
  if(valid.length<2) confidence='Low';
  return {
    temp: Math.round(avg(valid.map(s=>s.temp))),
    rainProb: Math.round(avg(rainProbs)),
    humidity: Math.round(avg(valid.map(s=>s.humidity))),
    windSpeed: Math.round(avg(valid.map(s=>s.windSpeed))),
    sources: valid.map(s=>s.provider),
    confidence,
    lastUpdated: new Date().toISOString(),
    raw: valid
  };
}
export function mockSources(){
  const ts = new Date().toISOString();
  return [
    { provider:'Weather API', temp:31, rainProb:82, humidity:66, windSpeed:24, timestamp:ts },
    { provider:'Radar', temp:32, rainProb:85, humidity:64, windSpeed:26, timestamp:ts },
    { provider:'Satellite', temp:30, rainProb:80, humidity:65, windSpeed:22, timestamp:ts },
  ];
}
