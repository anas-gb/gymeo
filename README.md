<img width="1893" height="858" alt="260702_02h23m41s_screenshot" src="https://github.com/user-attachments/assets/2e574bca-02ad-4520-a69c-77b64dacf5b7" />
# Gymeo 🎯

Gymeo is a modern, gamified Progressive Web App (PWA) built to make self-improvement, daily habits tracking, and fitness routines as engaging as playing Duolingo. It uses streaks, experience points (XP), achievements, leaderboards, and interactive focus timers to help users stay consistent and build discipline.

Developed with React, Next.js (App Router), TypeScript, and Tailwind CSS. Built to be mobile-first, high performance, and accessible.

---

## 🌟 Core Features

- **Dynamic Gamified Dashboard**: A central command showing current XP level progress, active streaks, step goals tracking, water intake logging, and a daily habit checklist.
- **Focus Mode Pomodoro**: Interactive timer (15, 25, 45, 60 mins) with a circular countdown ring. Includes a **Synthesized Ambient Sound Machine** powered by the Web Audio API for white rain noises and binaural focus hums.
- **Habit Tracker**: Customizable habits check-off system with 7-day consistency calendar grids, streak count multipliers, and custom color presets.
- **Workout Log**: Log cardio, strength, cycling, running, home, or custom workouts with duration, active calories, exercises, sets, and reps.
- **Friends & Leaderboard**: Global and Friends leaderboards with gold/silver/bronze trophies, online indicators, activity feeds, and friend requests.
- **Progress & Charts**: Rich visualizations for weight fluctuations, workout intensities, active minutes, and XP growth curves.
- **Settings**: Light and Dark Mode toggle, data backups (JSON export), language presets, and account reset utilities.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database/Auth**: Supabase (ready client connectors; client-first database wrapper running on LocalStorage for offline-first resilience)

---

## 📂 Project Architecture

Gymeo utilizes **Clean Architecture** principles to separate user interface elements, application state, database access layers, and entity schemas:

```
src/
├── app/                  # Next.js page layouts, entry metadata, and global styles
├── components/
│   └── views/           # Modular viewport subpages (Dashboard, Workout, Habits, Focus, Social, Progress, Settings)
├── context/              # AppContext global state manager, audio synth controller, and timer loops
├── lib/                  # Utilities (class names merging helper, etc.)
├── services/             # Local database storage client, seeding values, and gamification level maths
├── types/                # Strict TypeScript type interfaces for Gymeo domain models
└── docs/                 # Product specifications, setup, deployment, and API guides
```

---

## 📖 Detailed Guides

Explore Gymeo's detailed documentation:

1. **[Architecture Overview](file:///home/anas/Projects/gymeo/docs/architecture.md)**: Clean architecture layout, state management, and file systems.
2. **[Environment Setup & Installation](file:///home/anas/Projects/gymeo/docs/setup.md)**: Getting started, local development servers, and production environment variables.
3. **[API & Database Services](file:///home/anas/Projects/gymeo/docs/api.md)**: Schema structures, XP calculations, streak integrity check loops, and Web Audio synths.
4. **[Deployment & Hosting Guide](file:///home/anas/Projects/gymeo/docs/setup.md#deployment-guide)**: Steps to launch Gymeo on Vercel and connect Supabase database tables.
5. **[Contributing Guide](file:///home/anas/Projects/gymeo/docs/contributing.md)**: Git branch structures, code quality constraints, and styling tokens.

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/anas-gb/gymeo.git
   cd gymeo
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
