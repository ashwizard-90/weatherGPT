import { NextResponse } from 'next/server';
import { fuseWeather, mockSources } from '@/lib/weatherEngine';
import { analyzeRisks } from '@/lib/riskEngine';

// Simulated backend REST API — mirrors FastAPI design: GET /weather/current, /weather/hourly etc.
// In live mode, this would call Weather Provider Interface → Data Ingestion → Validation → Fusion → Risk
export async function GET(){
  const mode = process.env.DATA_MODE || 'mock';
  if(mode==='mock'){
    const fused = fuseWeather(mockSources() as any);
    const risks = analyzeRisks({ rainIntensity: 82, rainDurationH:5, windSpeed:24, visibility:8, temp:31, terrainRisk:'medium' });
    return NextResponse.json({
      dataMode: 'mock',
      note: 'Demo Data — Verified via Weather Engine (fused, validated, confidence scored). LLM explains only.',
      current: { temp:31, feelsLike:34, humidity:65, windSpeed:24, rainProb: (fused as any)?.rainProb || 82, updatedAt: new Date().toISOString(), sources: (fused as any)?.sources, confidence: (fused as any)?.confidence },
      risks,
      lastUpdated: new Date().toISOString()
    });
  }
  // live mode would fetch real providers here
  return NextResponse.json({ error: 'Live mode not configured — set WEATHER_API_KEY and DATA_MODE=live' }, { status: 503 });
}
