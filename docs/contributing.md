# Contributing Guide 🤝

Thank you for contributing to Gymeo! We value your help in creating the ultimate gamified self-improvement PWA.

---

## 🎨 Visual Design Guidelines

Gymeo is built to be modern, visual, responsive, and extremely clean:
- **Rounded Corners**: Use `rounded-3xl` for main cards and `rounded-xl` / `rounded-2xl` for inputs and action buttons.
- **Glassmorphism**: Combine translucent backgrounds `bg-slate-900/60` with thin border rings `border-slate-800/80` and background blur filters `backdrop-blur-md` to maintain depth layering.
- **Theme Color Schemes**:
  - Main brand accent: Emerald Green (`text-emerald-400`, `bg-emerald-500`)
  - Streak flame: Amber Orange (`text-amber-500`, `bg-amber-500/10`)
  - Calories/Energy: Rose Pink (`text-rose-500`, `bg-rose-500/10`)
  - Water/Fluid: Blue (`text-blue-500`, `bg-blue-500/10`)
  - Focus Mode: Indigo/Purple (`text-purple-400`, `bg-purple-500/10`)

---

## 💻 Coding Standards

- **TypeScript Strictness**: Always type parameters and function returns explicitly. Avoid `any` fallback type declaration.
- **React Components Hook**: Favor modularity. Group subpages inside `components/views` and expose actions through custom React context handles.
- **Tailwind Formatting**: Avoid inline ad-hoc pixel values when possible; use standard utility classes.

---

## 🌿 Git Commit Conventions

Gymeo follows meaningful commit prefix structures to ensure code history readability:

- `feat: [description]` — Introducing new features (e.g. `feat: focus mode`)
- `fix: [description]` — Fixing bugs or crash warnings (e.g. `fix: hydration warnings`)
- `docs: [description]` — Updating README or markdown directories (e.g. `docs: setup guide`)
- `refactor: [description]` — Rewriting component code flow without changes to features (e.g. `refactor: dashboard panels`)
- `style: [description]` — Correcting lint warnings, layout alignments, or colors (e.g. `style: buttons border colors`)
