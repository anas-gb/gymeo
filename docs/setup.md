# Environment Setup & Deployment Guide 🚀

Follow this guide to run Gymeo locally or deploy it to a live production environment.

## 💻 Local Environment Setup

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher) or yarn/pnpm

### Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/anas-gb/gymeo.git
   cd gymeo
   ```

2. Install npm packages:
   ```bash
   npm install --legacy-peer-deps
   ```
   *Note: Gymeo runs React 19. Using `--legacy-peer-deps` resolves peer compatibility checks for Recharts or Framer Motion libraries.*

3. Spin up the development server:
   ```bash
   npm run dev
   ```

4. View the app at `http://localhost:3000`.

---

## ☁️ Deployment Guide

Gymeo is optimized for fast serverless hosting and can be deployed to Vercel or any Next.js compatible hosting platform.

### Deploying to Vercel

1. **Vercel CLI (Quickest)**:
   Ensure you have the Vercel CLI installed:
   ```bash
   npm install -g vercel
   ```
   Then run the deployment command at the root of the project:
   ```bash
   vercel
   ```
   Follow the prompts to link the project and deploy it. For production, run:
   ```bash
   vercel --prod
   ```

2. **Vercel Dashboard (Git Connected)**:
   - Go to [Vercel Dashboard](https://vercel.com).
   - Click **Add New** > **Project**.
   - Import your repository `gymeo`.
   - Vercel will automatically detect Next.js settings. Leave the build settings as default.
   - Click **Deploy**.

---

## 🛢️ Connecting Supabase (Production Database Upgrade)

To upgrade Gymeo from LocalStorage mock to a live Supabase backend:

1. Create a project on [Supabase Console](https://supabase.com).
2. Configure tables:
   - Create tables for `profiles`, `workouts`, `habits`, `focus_sessions`, `achievements`, `friends`, `friend_activities`, and `weight_history` using the schemas located in `src/types/index.ts`.
3. Add environment variables in Vercel settings or a local `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Replace the database methods inside `src/services/db.ts` to call Supabase REST client methods:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
   ```
