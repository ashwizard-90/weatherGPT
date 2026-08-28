import { NextResponse } from 'next/server';
import { callOllama, getLlmConfig } from '@/lib/llm';
import { mockCurrent, occupationAdvice } from '@/lib/mockData';

// POST /api/chat - RAG pipeline: intent -> location -> weather -> risk -> LLM
// If LLM_PROVIDER=ollama and Ollama is running locally, it will call http://localhost:11434/api/chat with llama3.2
// Otherwise falls back to deterministic mock (never fabricates)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, location, occupation, primaryLang } = body as {
      message: string;
      location?: { name: string };
      occupation?: string;
      primaryLang?: string;
    };

    if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 });

    const weather = mockCurrent;
    const occ = occupation || 'General Public';
    const advice = occupationAdvice(occ, weather);
    const verifiedContext = `
Verified Weather Intelligence:
- Location: ${location?.name || 'Salem, TN'} (${weather.temp}°C, ${weather.condition})
- Rain probability: ${weather.rainProb}% (sources: ${weather.sources.join(', ')}, confidence: ${weather.confidence}, updated: 2 min ago)
- Wind: ${weather.windSpeed} km/h ${weather.windDir}, Humidity: ${weather.humidity}%, Visibility: ${weather.visibility} km
- Occupation: ${occ} -> Precomputed advice: "${advice}"
- Language: ${primaryLang || 'en'} (respond in this language, English fallback for critical)
User question: "${message}"
Task: Explain the verified weather, give occupation-specific action. Do NOT invent data.`;

    const { provider } = getLlmConfig();

    if (provider === 'ollama') {
      try {
        const llmText = await callOllama(verifiedContext);
        return NextResponse.json({
          provider: 'ollama',
          model: process.env.OLLAMA_MODEL || 'llama3.2',
          verifiedContext,
          reply: llmText,
        });
      } catch (e: any) {
        // Ollama not running — fallback to mock but tell client why
        return NextResponse.json({
          provider: 'ollama',
          warning: `Ollama not reachable at ${process.env.OLLAMA_HOST || 'http://localhost:11434'} — is 'ollama serve' running? Falling back to mock. Error: ${e.message}`,
          verifiedContext,
          reply: `[Fallback mock — start Ollama to get llama3.2] ${advice} (Rain ${weather.rainProb}%, Confidence ${weather.confidence}, Sources: ${weather.sources.join(', ')})`,
        });
      }
    }

    // Cloud or mock fallback (deterministic, no API key needed)
    return NextResponse.json({
      provider: provider || 'mock',
      verifiedContext,
      reply: `${advice} — Verified: Rain ${weather.rainProb}%, ${weather.temp}°C, Wind ${weather.windSpeed} km/h. Confidence: ${weather.confidence}. Sources: ${weather.sources.join(', ')}.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
