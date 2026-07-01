# Architecture Overview 🏛️

Gymeo is designed using **Clean Architecture** and **Domain-Driven Design (DDD)** concepts adapted for Next.js and React client-side resilience.

## 📐 Structural Blueprint

Gymeo separates its responsibilities into three distinct layers:

```
┌──────────────────────────────────────────────────────────┐
│                      Presentation                        │
│            (app/, components/views/, lib/)               │
├──────────────────────────────────────────────────────────┤
│                    Application State                     │
│                  (context/AppContext)                    │
├──────────────────────────────────────────────────────────┤
│                  Infrastructure & Data                   │
│             (services/db, types/, utils/)                │
└──────────────────────────────────────────────────────────┘
```

1. **Presentation Layer**:
   - `src/app/`: Configuration of layouts, styles, and page index loading.
   - `src/components/views/`: Contains isolated, responsive React panels for each tab (Dashboard, Habits, Workouts, Social, Settings, Progress).
   - `src/lib/`: Custom CSS utility merging code and design layouts.

2. **Application State Layer**:
   - `src/context/AppContext.tsx`: Handles all active states like current active tab index, current running focus timer loops, audio synthesis channels, and instant UI notifications toasts. Propagates db service queries to reactive React state hooks.

3. **Infrastructure & Data Layer**:
   - `src/services/db.ts`: Concrete mock database interface using `localStorage` for complete state persistency. Handles complex gamification math (XP, streaks checkouts, achievements progression) and seeds rich mock datasets.
   - `src/types/index.ts`: Strongly-typed TypeScript interfaces defining domain entities (UserProfile, Workout, Habit, FocusSession, Achievement, Friend, FriendActivity, LeaderboardUser).

---

## 🔁 State Synchronization Workflow

When a user logs a workout:
1. The `WorkoutTrackerView` collects input metrics and calls `addWorkout(workout)` from the global context hook.
2. The context calls `db.addWorkout(workout)` which appends the workout to LocalStorage, adds +50 XP to user profile, tests level thresholds (calculating level-up rewards), tests streaks completion, tests achievements unlocking thresholds, logs friend activity events, and writes changes back to storage.
3. The context triggers `refreshState()`, updating React state variables (profile, workouts, achievements, activity feeds).
4. A toast alerts: `"Workout logged! +50 XP"`.
5. The view re-renders, displaying the new workout in the history lists and updated level bars.
