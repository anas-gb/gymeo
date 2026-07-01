'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Zap, 
  Droplet, 
  Footprints, 
  Plus, 
  Dumbbell, 
  Timer, 
  Check, 
  ChevronRight, 
  Activity,
  Award
} from 'lucide-react';
import { getXPForLevel, getCumulativeXPForLevel } from '../../services/db';

export default function DashboardView() {
  const { 
    profile, 
    habits, 
    activities, 
    logWater, 
    addSteps, 
    setActiveTab, 
    toggleHabit,
    timerActive,
    timerTimeLeft,
    timerDuration,
    workouts
  } = useApp();

  const today = new Date().toISOString().split('T')[0];
  
  // Calculate level progress
  const currentLvl = profile.level;
  const xpForNext = getXPForLevel(currentLvl);
  const cumXP = getCumulativeXPForLevel(currentLvl);
  const xpInCurrentLvl = Math.max(0, profile.xp - cumXP);
  const progressPercent = Math.min(100, Math.floor((xpInCurrentLvl / xpForNext) * 100));

  // Daily goals summary
  const completedHabitsToday = habits.filter(h => h.completedDates.includes(today)).length;
  const totalHabits = habits.length;

  const quickWaterAdd = (amount: number) => {
    logWater(amount);
  };

  const quickStepsAdd = () => {
    addSteps(1500); // add 1500 steps
  };

  // Focus Timer Formatted
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate calories burned today
  const caloriesBurnedToday = workouts
    .filter(w => w.date === today)
    .reduce((sum, w) => sum + w.calories, 0);

  return (
    <div className="space-y-6">
      {/* Header welcome & XP */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/30"
            src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256"} 
            alt={profile.displayName}
          />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              Hey, {profile.displayName}!
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Let's dominate your goals today.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end md:self-center">
          {/* Streak Indicator */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('habits')}
            className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl cursor-pointer"
          >
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
            <div>
              <div className="text-sm font-bold text-amber-400">{profile.currentStreak} Days</div>
              <div className="text-[10px] text-amber-500/70">Daily Streak</div>
            </div>
          </motion.div>

          {/* Level Badge */}
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-2xl">
            <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
            <div>
              <div className="text-sm font-bold text-emerald-400">Lvl {profile.level}</div>
              <div className="text-[10px] text-emerald-500/70">{profile.xp} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* XP Level Progress Bar */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md">
        <div className="flex justify-between text-xs font-semibold mb-2 text-slate-300">
          <span>Level {currentLvl}</span>
          <span className="text-emerald-400">{xpInCurrentLvl} / {xpForNext} XP for Lvl {currentLvl + 1}</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]"
          />
        </div>
      </div>

      {/* Focus Session Alert Card if timer active */}
      {timerActive && (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setActiveTab('focus')}
          className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-3xl p-5 cursor-pointer hover:border-purple-500/50 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Timer className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-purple-200">Active Focus Session</h3>
              <p className="text-xs text-purple-300/80">Timer is running in background</p>
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-purple-400 bg-purple-500/10 px-4 py-2 rounded-2xl border border-purple-500/20">
            {formatTime(timerTimeLeft)}
          </div>
        </motion.div>
      )}

      {/* Stats Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Calories Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col justify-between h-40"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
              <Flame className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500/70 bg-rose-500/5 px-2 py-1 rounded-full">
              Energy
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100">{caloriesBurnedToday}</div>
            <div className="text-xs text-slate-400 mt-1">Calories Burned Today</div>
          </div>
        </motion.div>

        {/* Steps Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col justify-between h-40"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Footprints className="w-5 h-5" />
            </div>
            <button 
              onClick={quickStepsAdd}
              className="w-7 h-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100">
              {profile.walkStepsToday.toLocaleString()}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Steps (Goal: {profile.walkGoalSteps.toLocaleString()})
            </div>
            <div className="w-full bg-slate-850 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (profile.walkStepsToday / profile.walkGoalSteps) * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Water Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col justify-between h-40"
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Droplet className="w-5 h-5" />
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => quickWaterAdd(250)}
                className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/15"
              >
                +250ml
              </button>
              <button 
                onClick={() => quickWaterAdd(500)}
                className="text-[10px] font-bold px-2 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/15"
              >
                +500ml
              </button>
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100">
              {(profile.waterIntakeToday / 1000).toFixed(1)}L
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Water Intake (Goal: {(profile.waterIntakeGoal / 1000).toFixed(1)}L)
            </div>
            <div className="w-full bg-slate-850 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (profile.waterIntakeToday / profile.waterIntakeGoal) * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Goals Progress Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md flex flex-col justify-between h-40 cursor-pointer"
          onClick={() => setActiveTab('habits')}
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400/70 bg-purple-500/5 px-2 py-1 rounded-full">
              Habits
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-100">
              {completedHabitsToday} / {totalHabits}
            </div>
            <div className="text-xs text-slate-400 mt-1">Habits Checked Off Today</div>
            <div className="w-full bg-slate-850 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalHabits > 0 ? (completedHabitsToday / totalHabits) * 100 : 0}%` }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Grid: Habits and Social Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Habit checklist */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-200">Today's Habits</h2>
              <button 
                onClick={() => setActiveTab('habits')}
                className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-0.5"
              >
                Manage <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {habits.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                No habits created yet. Click Manage to add one!
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => {
                  const isCompleted = habit.completedDates.includes(today);
                  return (
                    <div 
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id, today)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isCompleted 
                          ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400' 
                          : 'bg-slate-850/50 border-slate-800 hover:border-slate-700 text-slate-200'
                      }`}
                    >
                      <span className={`text-sm font-semibold ${isCompleted ? 'line-through text-slate-500' : ''}`}>
                        {habit.name}
                      </span>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        isCompleted 
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                          : 'border-slate-650 hover:border-slate-550'
                      }`}>
                        {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Quick Focus Mode card */}
          {!timerActive && (
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-indigo-200">Start Focus Time</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Earn +30 XP on completion</p>
              </div>
              <button 
                onClick={() => setActiveTab('focus')}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-1.5"
              >
                <Timer className="w-3.5 h-3.5" /> Start
              </button>
            </div>
          )}
        </div>

        {/* Social Feed Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" /> Friend Activity
            </h2>
            <button 
              onClick={() => setActiveTab('social')}
              className="text-xs text-emerald-400 font-semibold hover:underline flex items-center gap-0.5"
            >
              Leaderboard <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No activity yet. Invite some friends to start the competition!
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex gap-3 bg-slate-950/30 border border-slate-900/50 p-3.5 rounded-2xl">
                  <img 
                    className="w-10 h-10 rounded-xl object-cover"
                    src={act.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256"} 
                    alt={act.displayName}
                  />
                  <div className="flex-1">
                    <div className="text-xs">
                      <span className="font-bold text-slate-200">{act.displayName}</span>{' '}
                      <span className="text-slate-400">{act.activityDetail}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-500">{act.timestamp}</span>
                      {act.xpEarned && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          +{act.xpEarned} XP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
