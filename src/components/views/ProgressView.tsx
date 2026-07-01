'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Trophy, 
  TrendingUp, 
  Activity, 
  Calendar,
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
  Scale
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function ProgressView() {
  const { workouts, focusSessions, achievements, weightHistory, habits, profile } = useApp();
  const [mounted, setMounted] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'weight' | 'activity' | 'xp'>('activity');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded-xl"></div>
        <div className="h-80 w-full bg-slate-900/60 rounded-3xl border border-slate-800"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-slate-900/60 rounded-2xl"></div>
          <div className="h-24 bg-slate-900/60 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // --- CHART 1: Weight Data ---
  const weightChartData = weightHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: item.weight
  }));

  // --- CHART 2: Weekly Activity (Calories & Workout Minutes) ---
  // Create last 7 days keys
  const getPast7DaysData = () => {
    const data = [];
    const dateNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayWorkouts = workouts.filter(w => w.date === dateStr);
      const calories = dayWorkouts.reduce((sum, w) => sum + w.calories, 0);
      const minutes = dayWorkouts.reduce((sum, w) => sum + w.duration, 0);
      const focuses = focusSessions.filter(f => f.date === dateStr);
      const focusMins = focuses.reduce((sum, f) => sum + f.duration, 0);

      data.push({
        dayName: dateNames[d.getDay()],
        calories,
        workoutMins: minutes,
        focusMins
      });
    }
    return data;
  };
  const activityData = getPast7DaysData();

  // --- CHART 3: XP Growth (Accumulating XP over workouts & focus) ---
  const getXPGrowthData = () => {
    const data = [];
    let runningXP = profile.xp - 500; // start slightly lower for display curve
    const dateNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      
      // Calculate XP earned on this day
      let dailyXP = 0;
      if (workouts.some(w => w.date === dateStr)) dailyXP += 50;
      focusSessions.forEach(f => {
        if (f.date === dateStr) dailyXP += 30;
      });
      habits.forEach(h => {
        if (h.completedDates.includes(dateStr)) dailyXP += 20;
      });
      
      runningXP += dailyXP;
      
      data.push({
        day: dateNames[6 - i] || 'Day',
        xp: runningXP
      });
    }
    return data;
  };
  const xpGrowthData = getXPGrowthData();

  // Custom tooltips matching glassmorphism style
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-bold text-slate-300 mb-1.5">{label}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} className="text-xs font-semibold" style={{ color: pld.color }}>
              {pld.name}: {pld.value} {pld.name.includes('Weight') ? 'kg' : pld.name.includes('Calories') ? 'kcal' : 'mins'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Activity className="w-7 h-7 text-emerald-500" /> Progress & Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">Visualize your fitness journey, habits milestones, and XP achievements.</p>
        </div>

        {/* Charts toggling panel */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-900 self-start">
          <button
            onClick={() => setSelectedChart('activity')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedChart === 'activity'
                ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly Activity
          </button>
          <button
            onClick={() => setSelectedChart('weight')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedChart === 'weight'
                ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weight Logs
          </button>
          <button
            onClick={() => setSelectedChart('xp')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedChart === 'xp'
                ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            XP Growth
          </button>
        </div>
      </div>

      {/* Primary Chart Container */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md min-h-[350px] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">
              {selectedChart === 'activity' ? 'Training Intensity' : selectedChart === 'weight' ? 'Weight Tracking' : 'Level Progression Curve'}
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {selectedChart === 'activity' ? 'Comparison of calories and exercises duration' : selectedChart === 'weight' ? 'Steady trends for body recomposition' : 'Accumulated gaming experience points'}
            </p>
          </div>
          
          <div className="flex gap-4 text-xs font-semibold text-slate-400">
            {selectedChart === 'activity' && (
              <>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> Cardio/Strength mins</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full" /> Calories kcal</span>
              </>
            )}
            {selectedChart === 'weight' && (
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-teal-400 rounded-full" /> Weight kg</span>
            )}
            {selectedChart === 'xp' && (
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" /> Experience XP</span>
            )}
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            {selectedChart === 'activity' ? (
              <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="dayName" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="workoutMins" name="Active minutes" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="calories" name="Calories burned" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : selectedChart === 'weight' ? (
              <AreaChart data={weightChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="weight" name="Weight" stroke="#2dd4bf" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            ) : (
              <AreaChart data={xpGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="xp" name="Total XP" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Achievements Gallery */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-5 h-5 text-amber-500" /> Badge Achievements
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = !!ach.unlockedAt;
            const progressPercent = Math.min(100, Math.floor((ach.progress / ach.maxProgress) * 100));
            
            return (
              <div 
                key={ach.id}
                className={`p-4 border rounded-3xl relative overflow-hidden flex flex-col justify-between h-40 transition-all ${
                  isUnlocked 
                    ? 'bg-slate-900/60 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                    : 'bg-slate-900/40 border-slate-800/80 grayscale opacity-60'
                }`}
              >
                {/* Background glow for unlocked badges */}
                {isUnlocked && (
                  <div className="absolute w-24 h-24 bg-amber-500/5 rounded-full filter blur-2xl -top-4 -right-4 -z-10 animate-pulse"></div>
                )}

                <div className="flex justify-between items-start">
                  {/* Badge Icon */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border text-lg shadow-inner ${
                    isUnlocked 
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                      : 'bg-slate-950 border-slate-900 text-slate-600'
                  }`}>
                    {isUnlocked ? '⭐' : <Lock className="w-4 h-4" />}
                  </div>

                  {/* Reward XP Tag */}
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                    isUnlocked 
                      ? 'text-amber-500 bg-amber-500/5 border-amber-500/10' 
                      : 'text-slate-500 bg-slate-950 border-slate-900'
                  }`}>
                    +{ach.xpReward} XP
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                    {ach.title}
                    {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20 stroke-[2.5]" />}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                    {ach.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-semibold">
                    <span>Progress</span>
                    <span>
                      {ach.category === 'walk' 
                        ? `${(ach.progress / 1000).toFixed(1)}k / ${(ach.maxProgress / 1000).toFixed(0)}k steps`
                        : `${ach.progress} / ${ach.maxProgress}`}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-amber-500' : 'bg-slate-700'}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
