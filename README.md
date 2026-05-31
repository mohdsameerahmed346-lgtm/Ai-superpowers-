# ⚡ AI Superpowers

> Fast AI outcomes. Every day.

A mobile-first app with 20 AI-powered lessons for Creators, Freelancers, Productivity, Communication, and Business. Built with React + Vite + Anthropic Claude API.

---

## Features

- 20 AI lessons across 5 categories
- Daily Challenge with +50 XP bonus
- XP + Level + Streak system
- Identity titles based on usage
- Save outputs to personal toolkit
- Free tier (3/day) + Premium paywall ($2.99/mo)
- Mobile-first design

---

## Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/ai-superpowers.git
cd ai-superpowers
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment
```bash
cp .env.example .env
```
Open `.env` and add your Anthropic API key:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```
Get your key at: https://console.anthropic.com

### 4. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 5. Build for production
```bash
npm run build
```

---

## Deploy to Vercel (free)

1. Push your code to GitHub
2. Go to https://vercel.com and import the repo
3. Add environment variable: `VITE_ANTHROPIC_API_KEY`
4. Deploy — live in 2 minutes

---

## Connect Firebase (for real user data)

Replace the in-memory store in `App.jsx` with Firebase:

```bash
npm install firebase
```

Then replace `useStore()` with:
- `firebase/auth` — for real login
- `firestore` — for streaks, XP, saved outputs
- `firebase/analytics` — for DAU and retention tracking

Firebase setup: https://firebase.google.com

---

## Project Structure

```
ai-superpowers/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx        ← entire app (lessons, store, UI)
│   └── index.jsx      ← entry point
├── .env.example       ← copy to .env and add your key
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

---

## Monetization Plan

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 3 generations/day |
| Premium | $2.99/mo | Unlimited + all 20 lessons |

Integrate Stripe or RevenueCat for real payments.

---

## Tech Stack

- React 18
- Vite
- Anthropic Claude API (claude-sonnet-4)
- CSS-in-JS (inline styles)
- Firebase (optional)

---

## License

MIT
