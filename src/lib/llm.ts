// LLM abstraction — supports Ollama localhost (llama3.2) + cloud providers
// Pipeline: Verified Weather Context → LLM (explain only, never fabricate)

export type LlmProvider = 'ollama' | 'openai' | 'gemini' | 'llama';

export function getLlmConfig() {
  return {
    provider: (process.env.LLM_PROVIDER as LlmProvider) || 'ollama',
    ollamaHost: process.env.OLLAMA_HOST || 'http://localhost:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3.2',
    openaiKey: process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || '',
    geminiKey: process.env.GEMINI_API_KEY || '',
  };
}

// Server-side: call Ollama Chat API (http://localhost:11434/api/chat)
// Ollama runs locally, no API key needed. Model must be pulled: ollama pull llama3.2
export async function callOllama(prompt: string, systemPrompt?: string) {
  const { ollamaHost, ollamaModel } = getLlmConfig();
  const url = `${ollamaHost.replace(/\/$/, '')}/api/chat`;

  // WeatherGPT system instruction — never fabricate weather
  const system = systemPrompt || `You are WeatherGPT. You explain VERIFIED weather intelligence only.
Rules:
- Never invent weather data. If data is unavailable, say: "Current verified weather information is unavailable. Please check the latest official warning."
- Use the provided Verified Context (temp, rain prob, sources, confidence, location, occupation).
- Generate occupation-specific advice (Farmer/Fisherman/Traveler etc.) but keep forecast identical.
- Respond in the user's preferred language, with English fallback for critical alerts.
- Be concise, actionable, and mention confidence/sources.`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: ollamaModel,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
      stream: false,
      keep_alive: '5m',
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Ollama error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  // Ollama returns { message: { content: "..." } }
  return data.message?.content || data.response || '';
}
