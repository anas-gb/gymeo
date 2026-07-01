export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  age?: number;
  height: number; // in cm
  weight: number; // in kg
  fitnessGoal: 'lose_weight' | 'gain_muscle' | 'stay_fit' | 'build_endurance';
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  joinDate: string;
  waterIntakeGoal: number; // in ml
  waterIntakeToday: number; // in ml
  walkGoalSteps: number;
  walkStepsToday: number;
}

export interface Set {
  reps: number;
  weight?: number; // in kg
  distance?: number; // in km
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
  category: 'workout' | 'streak' | 'focus' | 'walk' | 'friends' | 'profile' | 'level';
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
  activityType: 'workout' | 'focus' | 'habit' | 'achievement' | 'streak';
  activityDetail: string;
  timestamp: string; // e.g., "2 hours ago" or full date
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
  weight: number; // kg
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  amount: number; // ml
}
