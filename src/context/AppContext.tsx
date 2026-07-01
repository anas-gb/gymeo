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
  WaterLog
} from '../types';

type TabType = 'dashboard' | 'workouts' | 'habits' | 'focus' | 'social' | 'progress' | 'settings';

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
  const [activeTab, setActiveTabState] = useState<TabType>('dashboard');
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'xp'; id: number } | null>(null);

  // Focus Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25);
  const [timerTimeLeft, setTimerTimeLeft] = useState(25 * 60);
  const [timerPaused, setTimerPaused] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Refresh all state from db service (local) or Supabase (production)
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

        // Fetch Global Achievements (static/local or schema tables)
        setAchievements(db.getAchievements());
        setFriends(db.getFriends());
        setActivities(db.getActivities());
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
  };

  // On App startup load session
  useEffect(() => {
    const initSession = async () => {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase!.auth.getSession();
        if (session) {
          setUser({ id: session.user.id, email: session.user.email! });
        }
        
        // Handle auth change triggers
        supabase!.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setUser({ id: session.user.id, email: session.user.email! });
          } else {
            setUser(null);
            setProfile(null);
          }
        });
      } else {
        // Fallback to LocalStorage mock user session
        const storedUser = localStorage.getItem('gymeo_session_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    };

    initSession();

    // Load visual theme
    const savedTheme = localStorage.getItem('gymeo_theme') as 'light' | 'dark';
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark'); // default dark
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
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email! });
        showToast('Signed in successfully!', 'success');
        return true;
      }
      return false;
    } else {
      // Mock Sign In: logs in local user
      const localProfile = db.getProfile();
      const mockSession = { id: localProfile.id, email };
      localStorage.setItem('gymeo_session_user', JSON.stringify(mockSession));
      setUser(mockSession);
      showToast('Signed in successfully! (Local Session)', 'success');
      return true;
    }
  };

  const register = async (email: string, pass: string, username: string, name: string): Promise<boolean> => {
    if (isSupabaseConfigured()) {
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
    } else {
      // Mock Register: creates new local profile
      const newProfile = db.registerUser(username, name);
      const mockSession = { id: newProfile.id, email };
      localStorage.setItem('gymeo_session_user', JSON.stringify(mockSession));
      setUser(mockSession);
      showToast('Account created! (Local Session)', 'success');
      return true;
    }
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
    // Saves onboarding questionnaire data and updates profile
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
      const { error } = await supabase!
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) console.error(error);
    }
    const updated = db.updateProfile(updates);
    setProfile(updated);
    showToast('Profile updated!', 'success');
  };

  const addWorkout = async (workout: Omit<Workout, 'id' | 'userId'>) => {
    if (isSupabaseConfigured() && user) {
      const { error } = await supabase!
        .from('workouts')
        .insert({
          ...workout,
          user_id: user.id
        });
      if (error) console.error(error);
    }
    db.addWorkout(workout);
    refreshState();
    showToast(`Workout logged! +50 XP`, 'xp');
  };

  const createHabit = async (name: string, icon: string, color: string) => {
    if (isSupabaseConfigured() && user) {
      const { error } = await supabase!
        .from('habits')
        .insert({
          name,
          icon,
          color,
          user_id: user.id
        });
      if (error) console.error(error);
    }
    db.createHabit(name, icon, color);
    refreshState();
    showToast(`Habit "${name}" created!`, 'success');
  };

  const deleteHabit = async (id: string) => {
    if (isSupabaseConfigured() && user) {
      // Mock / direct remove
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
    showToast(`Logged ${amount}ml water!`, 'success');
    
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
    showToast(`Weight updated to ${weight}kg`, 'success');
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
    
    // Play sound if possible
    try {
      if (typeof window !== 'undefined') {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        oscillator.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.3); // D6
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.6);
      }
    } catch (e) {
      console.log('Audio playback failed or blocked by autoplay settings', e);
    }
  };

  // Timer Tick
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

  // Loading state checks user authentication load
  const isLoaded = isSupabaseConfigured() 
    ? true // handled on session check callbacks
    : true; // local is immediate

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
