'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '../services/db';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { 
  UserProfile, 
  Workout, 
  Habit, 
  FocusSession, 
  Achievement, 
  Friend, 
  FriendActivity, 
  LeaderboardUser,
  WeightEntry,
  WaterLog,
  Meal,
  WorkoutSchedule
} from '../types';

type TabType = 'gym' | 'food' | 'social' | 'stats' | 'profile';

interface AppContextType {
  profile: UserProfile;
  workouts: Workout[];
  habits: Habit[];
  focusSessions: FocusSession[];
  achievements: Achievement[];
  friends: Friend[];
  activities: FriendActivity[];
  weightHistory: WeightEntry[];
  waterLogs: WaterLog[];
  meals: Meal[];
  workoutSchedule: WorkoutSchedule;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Auth state
  user: { id: string; email: string } | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string, username: string, name: string) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  
  // Actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  addWorkout: (workout: Omit<Workout, 'id' | 'userId'>) => void;
  createHabit: (name: string, icon: string, color: string) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string, date: string) => void;
  logWater: (amount: number) => void;
  addSteps: (steps: number) => void;
  addWeight: (weight: number) => void;
  searchUsers: (query: string) => Friend[];
  sendFriendRequest: (id: string) => void;
  acceptFriendRequest: (id: string) => void;
  removeFriend: (id: string) => void;
  resetAllData: () => void;
  
  // New actions for scheduling & meals
  addMeal: (meal: Omit<Meal, 'id' | 'userId'>) => void;
  deleteMeal: (id: string) => void;
  saveWorkoutSchedule: (schedule: WorkoutSchedule) => void;
  toggleUnits: () => void;

  // Focus Timer
  timerActive: boolean;
  timerDuration: number; // in mins
  timerTimeLeft: number; // in secs
  timerPaused: boolean;
  startTimer: (duration: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  cancelTimer: () => void;
  finishTimer: () => void;

  // Notification / Toast helper
  showToast: (message: string, type?: 'success' | 'info' | 'xp') => void;
  toast: { message: string; type: 'success' | 'info' | 'xp'; id: number } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activities, setActivities] = useState<FriendActivity[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [workoutSchedule, setWorkoutSchedule] = useState<WorkoutSchedule>({ days: ['Mon', 'Wed', 'Fri'], reminderTime: '07:30' });
  const [activeTab, setActiveTabState] = useState<TabType>('gym');
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'xp'; id: number } | null>(null);

  // Focus Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25);
  const [timerTimeLeft, setTimerTimeLeft] = useState(25 * 60);
  const [timerPaused, setTimerPaused] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Refresh all state
  const refreshState = async () => {
    if (isSupabaseConfigured() && user) {
      try {
        // Fetch User Profile
        const { data: profData, error: profErr } = await supabase!
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!profErr && profData) {
          setProfile(profData as UserProfile);
        }

        // Fetch Workouts
        const { data: wrkData } = await supabase!
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        if (wrkData) setWorkouts(wrkData as Workout[]);

        // Fetch Habits
        const { data: habData } = await supabase!
          .from('habits')
          .select('*')
          .eq('user_id', user.id);
        if (habData) setHabits(habData as Habit[]);

        // Fetch Focus Sessions
        const { data: focData } = await supabase!
          .from('focus_sessions')
          .select('*')
          .eq('user_id', user.id);
        if (focData) setFocusSessions(focData as FocusSession[]);

        // Fetch Weight Logs
        const { data: wgtData } = await supabase!
          .from('weight_history')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });
        if (wgtData) setWeightHistory(wgtData as WeightEntry[]);

        // Fetch Water Logs
        const { data: watData } = await supabase!
          .from('water_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true });
        if (watData) setWaterLogs(watData as WaterLog[]);

        // Fetch Meals
        const { data: melData } = await supabase!
          .from('meals')
          .select('*')
          .eq('user_id', user.id);
        if (melData) setMeals(melData as Meal[]);

        setAchievements(db.getAchievements());
        setFriends(db.getFriends());
        setActivities(db.getActivities());
        setWorkoutSchedule(db.getWorkoutSchedule());
      } catch (err) {
        console.error('Supabase fetch error, fallback to local', err);
        fallbackLocalState();
      }
    } else {
      fallbackLocalState();
    }
  };

  const fallbackLocalState = () => {
    setProfile(db.getProfile());
    setWorkouts(db.getWorkouts());
    setHabits(db.getHabits());
    setFocusSessions(db.getFocusSessions());
    setAchievements(db.getAchievements());
    setFriends(db.getFriends());
    setActivities(db.getActivities());
    setWeightHistory(db.getWeightHistory());
    setWaterLogs(db.getWaterLogs());
    setMeals(db.getMeals());
    setWorkoutSchedule(db.getWorkoutSchedule());
  };

  // On App startup load session
  useEffect(() => {
    const initSession = async () => {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session) {
          setUser({ id: session.user.id, email: session.user.email! });
        }
        
        supabase!.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setUser({ id: session.user.id, email: session.user.email! });
          } else {
            setUser(null);
            setProfile(null);
          }
        });
      }
    };

    initSession();

    const savedTheme = localStorage.getItem('gymeo_theme') as 'light' | 'dark';
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Sync profile data once user changes
  useEffect(() => {
    if (user) {
      refreshState();
    }
  }, [user]);

  // Auth Operations
  const login = async (email: string, pass: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
    }
    const { data, error } = await supabase!.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email! });
      showToast('Signed in successfully!', 'success');
      return true;
    }
    return false;
  };

  const register = async (email: string, pass: string, username: string, name: string): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase client is not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
    }
    const { data, error } = await supabase!.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          username,
          display_name: name
        }
      }
    });
    if (error) throw error;
    if (data.user) {
      setUser({ id: data.user.id, email: data.user.email! });
      showToast('Account registered successfully!', 'success');
      return true;
    }
    return false;
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase!.auth.signOut();
    }
    localStorage.removeItem('gymeo_session_user');
    setUser(null);
    setProfile(null);
    showToast('Signed out successfully.', 'info');
  };

  const completeOnboarding = (onboardingData: Partial<UserProfile>) => {
    const updated = db.updateProfile(onboardingData);
    setProfile(updated);
    showToast('Onboarding setup completed!', 'success');
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('gymeo_theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'xp' = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Actions
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (isSupabaseConfigured() && user) {
      await supabase!.from('profiles').update(updates).eq('id', user.id);
    }
    const updated = db.updateProfile(updates);
    setProfile(updated);
    showToast('Profile updated!', 'success');
  };

  const addWorkout = async (workout: Omit<Workout, 'id' | 'userId'>) => {
    if (isSupabaseConfigured() && user) {
      await supabase!.from('workouts').insert({ ...workout, user_id: user.id });
    }
    db.addWorkout(workout);
    refreshState();
    showToast(`Workout logged! +50 XP`, 'xp');
  };

  const createHabit = async (name: string, icon: string, color: string) => {
    if (isSupabaseConfigured() && user) {
      await supabase!.from('habits').insert({ name, icon, color, user_id: user.id });
    }
    db.createHabit(name, icon, color);
    refreshState();
    showToast(`Habit "${name}" created!`, 'success');
  };

  const deleteHabit = async (id: string) => {
    if (isSupabaseConfigured() && user) {
      await supabase!.from('habits').delete().eq('id', id);
    }
    db.deleteHabit(id);
    refreshState();
    showToast('Habit deleted.', 'info');
  };

  const toggleHabit = (id: string, date: string) => {
    const { completed } = db.toggleHabit(id, date);
    refreshState();
    if (completed) {
      showToast(`Habit completed! +20 XP`, 'xp');
    } else {
      showToast(`Habit unmarked.`, 'info');
    }
  };

  const logWater = (amount: number) => {
    const currentAmount = db.logWater(amount);
    refreshState();
    showToast(`Logged ${amount}${profile?.units === 'imperial' ? 'oz' : 'ml'} water!`, 'success');
    
    const prof = db.getProfile();
    if (currentAmount >= prof.waterIntakeGoal && (currentAmount - amount) < prof.waterIntakeGoal) {
      showToast(`Water goal reached! +20 XP`, 'xp');
    }
  };

  const addSteps = (steps: number) => {
    const prevSteps = profile?.walkStepsToday || 0;
    const currentSteps = db.addSteps(steps);
    refreshState();
    showToast(`Added ${steps.toLocaleString()} steps!`, 'success');

    const prof = db.getProfile();
    if (currentSteps >= prof.walkGoalSteps && prevSteps < prof.walkGoalSteps) {
      showToast(`Step goal reached! +20 XP`, 'xp');
    }
  };

  const addWeight = (weight: number) => {
    db.addWeightEntry(weight);
    refreshState();
    showToast(`Weight updated to ${weight}${profile?.units === 'imperial' ? 'lbs' : 'kg'}`, 'success');
  };

  const searchUsers = (query: string) => {
    return db.searchUsers(query);
  };

  const sendFriendRequest = (id: string) => {
    db.sendFriendRequest(id);
    refreshState();
    showToast('Friend request sent!', 'success');
  };

  const acceptFriendRequest = (id: string) => {
    db.acceptFriendRequest(id);
    refreshState();
    showToast('Friend request accepted!', 'success');
  };

  const removeFriend = (id: string) => {
    db.removeFriend(id);
    refreshState();
    showToast('Friend removed.', 'info');
  };

  const resetAllData = () => {
    db.resetToDefaults();
    refreshState();
    showToast('Application reset to default mock data', 'info');
  };

  // --- NEW DIET DIARY ACTIONS ---
  const addMeal = async (meal: Omit<Meal, 'id' | 'userId'>) => {
    if (isSupabaseConfigured() && user) {
      try {
        await supabase!.from('meals').insert({ ...meal, user_id: user.id });
      } catch (e) {}
    }
    db.addMeal(meal);
    refreshState();
    showToast('Meal diary logged! +20 XP', 'xp');
  };

  const deleteMeal = async (id: string) => {
    if (isSupabaseConfigured() && user) {
      try {
        await supabase!.from('meals').delete().eq('id', id);
      } catch (e) {}
    }
    db.deleteMeal(id);
    refreshState();
    showToast('Meal deleted', 'info');
  };

  const saveWorkoutSchedule = (schedule: WorkoutSchedule) => {
    db.saveWorkoutSchedule(schedule);
    setWorkoutSchedule(schedule);
    showToast('Workout schedule saved!', 'success');
  };

  const toggleUnits = () => {
    if (!profile) return;
    const currentUnits = profile.units || 'metric';
    const nextUnits = currentUnits === 'metric' ? 'imperial' : 'metric';
    
    let newWeight = profile.weight;
    let newHeight = profile.height;
    let newWaterGoal = profile.waterIntakeGoal;
    let newWaterIntake = profile.waterIntakeToday;
    
    if (nextUnits === 'imperial') {
      newWeight = Math.round(profile.weight * 2.20462 * 10) / 10;
      newHeight = Math.round(profile.height * 0.393701);
      newWaterGoal = Math.round(profile.waterIntakeGoal * 0.033814);
      newWaterIntake = Math.round(profile.waterIntakeToday * 0.033814);
    } else {
      newWeight = Math.round((profile.weight / 2.20462) * 10) / 10;
      newHeight = Math.round(profile.height / 0.393701);
      newWaterGoal = Math.round(profile.waterIntakeGoal / 0.033814);
      newWaterIntake = Math.round(profile.waterIntakeToday / 0.033814);
    }
    
    updateProfile({
      units: nextUnits,
      weight: newWeight,
      height: newHeight,
      waterIntakeGoal: newWaterGoal,
      waterIntakeToday: newWaterIntake
    });
  };

  // Focus Timer Logic
  const startTimer = (duration: number) => {
    setTimerDuration(duration);
    setTimerTimeLeft(duration * 60);
    setTimerActive(true);
    setTimerPaused(false);
    showToast(`Focus session started: ${duration} minutes. Stay focused!`, 'info');
  };

  const pauseTimer = () => {
    setTimerPaused(true);
    showToast('Timer paused', 'info');
  };

  const resumeTimer = () => {
    setTimerPaused(false);
    showToast('Timer resumed', 'info');
  };

  const cancelTimer = () => {
    setTimerActive(false);
    setTimerPaused(false);
    setTimerTimeLeft(timerDuration * 60);
    if (timerRef.current) clearInterval(timerRef.current);
    showToast('Focus session cancelled', 'info');
  };

  const finishTimer = () => {
    setTimerActive(false);
    setTimerPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
    db.addFocusSession(timerDuration);
    refreshState();
    showToast(`Focus Session Completed! +30 XP`, 'xp');
    
    try {
      if (typeof window !== 'undefined') {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15);
        oscillator.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.6);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (timerActive && !timerPaused) {
      timerRef.current = setInterval(() => {
        setTimerTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTimeout(() => {
              finishTimer();
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timerPaused, timerDuration]);

  const isAuthenticated = !!user;
  const isOnboarded = !!(profile && profile.height > 0);

  return (
    <AppContext.Provider
      value={{
        profile: profile!,
        workouts,
        habits,
        focusSessions,
        achievements,
        friends,
        activities,
        weightHistory,
        waterLogs,
        meals,
        workoutSchedule,
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        
        user,
        isAuthenticated,
        isOnboarded,
        login,
        register,
        logout,
        completeOnboarding,
        
        updateProfile,
        addWorkout,
        createHabit,
        deleteHabit,
        toggleHabit,
        logWater,
        addSteps,
        addWeight,
        searchUsers,
        sendFriendRequest,
        acceptFriendRequest,
        removeFriend,
        resetAllData,
        
        addMeal,
        deleteMeal,
        saveWorkoutSchedule,
        toggleUnits,
        
        timerActive,
        timerDuration,
        timerTimeLeft,
        timerPaused,
        startTimer,
        pauseTimer,
        resumeTimer,
        cancelTimer,
        finishTimer,
        
        showToast,
        toast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
