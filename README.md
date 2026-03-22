# 🇦🇺 CitizenMate

> **Your mate for the citizenship test.**

An AI-powered, multilingual web app that helps migrants prepare for the Australian citizenship test with confidence.

## 🌐 Domain

**citizenmate.com**

## ✨ Features

- 🎯 **Mock Tests** — 6 realistic practice tests with 20 questions each
- 📚 **Bilingual Study Guide** — Topic-by-topic study with progress tracking
- 🧠 **Smart Practice (SRS)** — Spaced repetition adapts to your weak areas
- 🤖 **AI Tutor** — Ask questions via Gemini-powered chatbot
- 📊 **Readiness Dashboard** — Calibrated score + test-date countdown
- 📱 **PWA** — Install on phone, works offline
- 🔐 **Cloud Sync** — Sign in to sync progress across devices (Supabase)
- 🎨 **Australian Theme** — Navy blue, federation red, eucalyptus green

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animation | Framer Motion |
| Auth & DB | Supabase (Postgres + Auth) |
| AI | Google Gemini API (AI SDK) |
| PWA | Serwist (Workbox) |
| Hosting | Vercel (planned) |

## 🚀 Quick Start

```bash
# Clone the repo
git clone <repo-url> CitizenMate
cd CitizenMate/citizenmate

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and Gemini API keys

# Run development server
npm run dev
# Visit http://localhost:3000
```

## 📁 Project Structure

```
CitizenMate/
├── citizenmate/              ← Next.js application
│   ├── src/
│   │   ├── app/              ← Pages (App Router)
│   │   ├── components/       ← React components
│   │   ├── data/             ← Question bank & test definitions
│   │   └── lib/              ← Utilities, contexts, types
│   ├── supabase/             ← Database migrations
│   └── public/               ← Static assets & PWA manifest
├── docs/                     ← Research & implementation plans
├── design-system/            ← Design token references
├── .agent/                   ← Antigravity IDE agent config
├── BUSINESS_PLAN.md          ← Full business plan (v3)
├── MEMORY.md                 ← Project context for AI continuity
└── README.md                 ← You are here
```

## 📋 Key Documents

| Document | Description |
|----------|-------------|
| [BUSINESS_PLAN.md](./BUSINESS_PLAN.md) | Market research, monetization, growth strategy |
| [MEMORY.md](./MEMORY.md) | Full project context — architecture, decisions, next steps |
| [docs/research/](./docs/research/) | Market validation & referral strategy research |
| [docs/superpowers/](./docs/superpowers/) | Implementation plans & design specs |

## 💰 Business Model

- **Freemium + Exam Sprint Pass** ($29.99 for 60 days) — primary CTA
- Pro ($9.99/mo) and Premium ($19.99/mo) subscriptions
- B2B licensing for migration agents
- "Help a Mate" referral program

## 📊 Content

- **~150 questions** across 4 topics (Values, History, Government, Symbols)
- **6 mock tests** × 20 questions each
- **Smart practice** with spaced repetition algorithm

## 🤝 Development with Antigravity IDE

This project includes `.agent/` configuration for Google Antigravity IDE:
- **AGENT.md** — Agent operating rules with memory-first principle
- **Skills** — UI/UX Pro Max design intelligence
- **Workflows** — Memory save, smart research, project setup
- **NotebookLM** — External memory (notebook ID: `a4e76a2c-165c-42d6-9f2a-49960264fb93`)

See [MEMORY.md](./MEMORY.md) for full context on resuming development.

---

*CitizenMate — "Your mate for the citizenship test." 🇦🇺*
