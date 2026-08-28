# WeatherGPT — From Forecast to Action

AI-powered weather intelligence & disaster early-warning platform for India.

> **Understand. Prepare. Stay Safe.**

Built preserving the provided UI/UX — visual design, colors, typography, spacing, navigation — now fully functional, responsive, production-style.

## Core Principle

**LLM never fabricates forecasts.** Pipeline: Trusted Sources → Ingestion → Cleaning/Validation → Fusion → Weather Engine → Risk Engine → Verified Intelligence → LLM/RAG → Personalization → UI. Mock mode clearly labelled "Demo Data".

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend (integrated):** Next.js API Routes mirroring FastAPI spec (`/api/weather`, `/api/chat` etc.) — ready to extract to Python FastAPI + PostgreSQL + PostGIS + Redis
- **Auth:** Mock OAuth (Google/Apple/Microsoft) + Phone OTP + Email — architected for Firebase/Auth0/Cognito JWT
- **Maps:** OSM placeholder with layers (Rain, Radar, Satellite, Flood, Cyclone, User Reports) — swap to Mapbox/Google via `MAP_API_KEY`

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev    # http://localhost:3000
npm run build && npm start
# Docker
docker compose up --build
```

## Flows

Landing → Auth → Onboarding (Location → Language → Profile/Occupation → Alerts/Voice → Family Safety/Accessibility) → Dashboard

## Key Features

- **Weather Engine:** multi-source fusion, stale/invalid removal, confidence scoring (High/Med/Low), sources & lastUpdated badges
- **Risk Engine:** Heavy Rain / Flood / Cyclone / Lightning / Heatwave / Wind / Landslide / Rough Sea — Low→Critical with time/location/sources/action
- **Occupation Personalization:** Same forecast, different advice (Farmer/Fisherman/Traveler etc.) — advice layer only
- **Live Map:** Layers, Timeline, My Location, Risk toggle, community overlays
- **AI Chatbot:** Text + Voice (STT/TTS), multilingual (Tamil/Hindi/Telugu…), RAG: intent→location→weather→risk→LLM, verified-context only
- **Alerts:** Normal (sky) ≠ Critical (red, sound, vibration, voice, bilingual Tamil+English, Find Safe Route / Shelter / Hospital / Share)
- **Community:** Photo/Voice/Text + GPS + timestamp → Unverified→Under Review→Corroborated→Verified (compares multi-reports + radar + official warnings)
- **Emergency Mode:** Large touch targets, high contrast, safe zones, avoided roads, official bulletin
- **History & Climate:** Historical obs vs forecasts vs AI explanations; line/bar/heatmap charts
- **Admin:** Role gate (`admin123`), live alerts/regions/reports, verify/reject, system health, audit logs

## Environment

See `.env.example`. `DATA_MODE=mock` uses labelled mock data; `live` expects `WEATHER_API_KEY`, `LLM_API_KEY`, `MAP_API_KEY`, `DATABASE_URL`, `REDIS_URL`.

## API Design (implemented / stubbed)

`POST /auth/*`, `GET /users/me`, `GET /locations`, `GET /weather/current|hourly|daily`, `GET /weather/map`, `GET /risks`, `GET /alerts`, `POST /community/reports`, `POST /chat`, `GET /history`, `GET /emergency/*`

## Demo Scenarios

1. **Farmer (Chennai, Tamil+English):** heavy rain 85% → farming advice + voice
2. **Fisherman:** strong wind/marine warning → critical bilingual voice alert
3. **Community flood:** submit photo → Unverified → corroborated → Verified Local Flood
4. **Critical alert:** trigger sim → red emergency UI + safe route/shelter

## Accessibility & Offline

High contrast, large text, screen-reader labels, keyboard nav, voice I/O; offline shows last cached weather with timestamp, queues reports.

## Verification

`npm run build` passes. All components use design tokens; critical red reserved for real critical events.
