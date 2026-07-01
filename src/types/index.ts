export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  age?: number;
  height: number; // in cm (metric) or inches (imperial)
  weight: number; // in kg (metric) or lbs (imperial)
  fitnessGoal: 'lose_weight' | 'gain_muscle' | 'stay_fit' | 'build_endurance';
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  joinDate: string;
  waterIntakeGoal: number; // in ml or oz
  waterIntakeToday: number; // in ml or oz
  walkGoalSteps: number;
  walkStepsToday: number;
  units: 'metric' | 'imperial';
}

export interface Set {
  reps: number;
  weight?: number; // in kg or lbs
  distance?: number; // in km or miles
  completed: boolean;
}

export interface Exercise {
  name: string;
  sets: Set[];
}

export interface Workout {
  id: string;
  userId: string;
  category: 'Strength' | 'Cardio' | 'Running' | 'Cycling' | 'Home Workout' | 'Custom';
  title: string;
  duration: number; // in minutes
  calories: number;
  exercises: Exercise[];
  notes?: string;
  date: string; // YYYY-MM-DD
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string; // lucide icon name
  color: string; // css gradient color class
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
  createdAt: string;
}

export interface FocusSession {
  id: string;
  userId: string;
  duration: number; // in minutes
  date: string; // YYYY-MM-DD
  xpEarned: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'workout' | 'streak' | 'focus' | 'walk' | 'friends' | 'profile' | 'level' | 'food';
  xpReward: number;
  unlockedAt?: string; // YYYY-MM-DD
  progress: number;
  maxProgress: number;
}

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  level: number;
  currentStreak: number;
  status: 'online' | 'offline';
  isRequestReceived?: boolean;
  isRequestSent?: boolean;
}

export interface FriendActivity {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  activityType: 'workout' | 'focus' | 'habit' | 'achievement' | 'streak' | 'food';
  activityDetail: string;
  timestamp: string; // e.g. "2 hours ago"
  xpEarned?: number;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  xp: number;
  level: number;
  currentStreak: number;
  isCurrentUser?: boolean;
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number; // kg or lbs
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  amount: number; // ml or oz
}

// NEW FOR FOOD TAB
export interface Meal {
  id: string;
  userId: string;
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  date: string; // YYYY-MM-DD
}

// NEW FOR WORKOUT PLANNER
export interface WorkoutSchedule {
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  reminderTime: string; // HH:MM
}

// EXERCISE LIBRARY REFERENCE
export interface LibraryExercise {
  name: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
  description: string;
  howToUse: string[];
  gains: string[];
  xpGained: number;
}
