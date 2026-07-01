'use client';

import React from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, 
  Dumbbell, 
  CheckSquare, 
  Timer, 
  Users, 
  BarChart3, 
  Settings, 
  Zap, 
  Activity,
  ChevronRight,
  TrendingUp,
  LogOut
} from 'lucide-react';

// Import Views
import DashboardView from '../components/views/DashboardView';
import WorkoutTrackerView from '../components/views/WorkoutTrackerView';
import HabitTrackerView from '../components/views/HabitTrackerView';
import FocusModeView from '../components/views/FocusModeView';
import SocialView from '../components/views/SocialView';
import ProgressView from '../components/views/ProgressView';
import SettingsView from '../components/views/SettingsView';
import AuthView from '../components/views/AuthView';
import OnboardingView from '../components/views/OnboardingView';

function AppLayout() {
  const { 
    activeTab, 
    setActiveTab, 
    profile, 
    toast,
    timerActive,
    timerTimeLeft,
    isAuthenticated,
    isOnboarded,
    login,
    register,
    logout,
    completeOnboarding
  } = useApp();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Nav menu configuration
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  // --- SECURITY GATE 1: Authenticated check ---
  if (!isAuthenticated) {
    return <AuthView onLogin={login} onRegister={register} />;
  }

  // --- SECURITY GATE 2: Onboarded check ---
  if (!isOnboarded) {
    return <OnboardingView initialProfile={profile} onComplete={completeOnboarding} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'workouts': return <WorkoutTrackerView />;
      case 'habits': return <HabitTrackerView />;
      case 'focus': return <FocusModeView />;
      case 'social': return <SocialView />;
      case 'progress': return <ProgressView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-850 p-6 sticky top-0 h-screen justify-between z-20">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                G
              </div>
              <div>
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">Gymeo</span>
                <span className="text-[9px] block text-emerald-500 font-bold uppercase tracking-widest -mt-1">consistency</span>
              </div>
            </div>
            {/* Quick logout */}
            <button 
              onClick={logout}
              className="p-1.5 rounded-lg bg-slate-950 border border-slate-855 hover:text-rose-400 text-slate-500 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all relative ${
                    isActive 
                      ? 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/10' 
                      : 'text-slate-450 hover:text-slate-200 hover:bg-slate-850/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  {item.label}
                  {item.id === 'focus' && timerActive && (
                    <span className="absolute right-4 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Mini profile widget */}
        {profile && (
          <div 
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-3 bg-slate-950/40 hover:bg-slate-950/80 p-3 rounded-2xl border border-slate-850 cursor-pointer transition-all"
          >
            <img 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-800" 
              src={profile.avatarUrl} 
              alt={profile.displayName} 
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-200 truncate">{profile.displayName}</h4>
              <span className="text-[10px] text-slate-500 block truncate">Lvl {profile.level} • {profile.xp} XP</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-650" />
          </div>
        )}
      </aside>

      {/* 2. MOBILE TOP BANNER */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-855 sticky top-0 z-30">
        <div className="flex items-center gap-2" onClick={() => setActiveTab('dashboard')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black">
            G
          </div>
          <span className="font-black text-md tracking-tight text-white">Gymeo</span>
        </div>

        {/* Mini profile stats and logout */}
        {profile && (
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/15 px-2 py-1 rounded-lg text-[10px] font-bold text-amber-400">
              🔥 {profile.currentStreak}
            </div>
            <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/15 px-2 py-1 rounded-lg text-[10px] font-bold text-emerald-400">
              ⚡ Lvl {profile.level}
            </div>
            <button 
              onClick={logout}
              className="p-1 rounded bg-slate-950 border border-slate-850 text-slate-500"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </header>

      {/* 3. MAIN CONTENT FRAME */}
      <main className="flex-1 p-5 md:p-8 max-w-6xl mx-auto w-full pb-24 md:pb-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. MOBILE BOTTOM NAV BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-850 py-3.5 px-6 flex justify-between items-center z-30 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center relative p-1.5"
            >
              <Icon className={`w-5 h-5 transition-all ${isActive ? 'text-emerald-400 scale-110' : 'text-slate-500 hover:text-slate-350'}`} />
              {item.id === 'focus' && timerActive && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 5. FLOATING TIMER SUB-BAR FOR BACKGROUND FOCUSING */}
      {timerActive && activeTab !== 'focus' && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setActiveTab('focus')}
          className="fixed bottom-20 md:bottom-6 right-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white px-4 py-2.5 rounded-2xl border border-purple-500/35 shadow-2xl flex items-center gap-3 cursor-pointer z-40 hover:scale-103 transition-transform"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <span className="text-xs font-bold font-mono tracking-wide">{formatTime(timerTimeLeft)} focusing</span>
        </motion.div>
      )}

      {/* 6. TOAST NOTIFICATION CONTAINER */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex items-center gap-3.5 ${
              toast.type === 'xp'
                ? 'bg-amber-950/80 border-amber-500/40 text-amber-200 shadow-amber-500/5'
                : toast.type === 'info'
                  ? 'bg-slate-900/95 border-slate-850 text-slate-300'
                  : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                toast.type === 'xp' 
                  ? 'bg-amber-500/20 text-amber-400' 
                  : toast.type === 'info'
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {toast.type === 'xp' ? <Zap className="w-4 h-4 fill-amber-400" /> : toast.type === 'info' ? <Settings className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
              </div>
              <div className="text-xs font-bold flex-1">{toast.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
