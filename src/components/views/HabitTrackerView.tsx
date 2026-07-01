'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Plus, 
  Trash2, 
  Droplet, 
  BookOpen, 
  Wind, 
  Footprints, 
  Moon, 
  Code, 
  GraduationCap, 
  Dumbbell, 
  Apple,
  Award,
  Calendar,
  X
} from 'lucide-react';
import { Habit } from '../../types';

// Map icon names to Lucide icons
export const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Droplet,
  BookOpen,
  Wind,
  Footprints,
  Moon,
  Code,
  GraduationCap,
  Dumbbell,
  Apple
};

const PRESET_ICONS = [
  { name: 'Droplet', desc: 'Water Intake' },
  { name: 'BookOpen', desc: 'Reading' },
  { name: 'Wind', desc: 'Meditation' },
  { name: 'Footprints', desc: 'Walking' },
  { name: 'Moon', desc: 'Sleep' },
  { name: 'Code', desc: 'Coding' },
  { name: 'GraduationCap', desc: 'Study' },
  { name: 'Dumbbell', desc: 'Workout' },
  { name: 'Apple', desc: 'Healthy Diet' }
];

const PRESET_COLORS = [
  { class: 'from-blue-400 to-blue-600', name: 'Blue Sky' },
  { class: 'from-emerald-400 to-emerald-600', name: 'Emerald Grass' },
  { class: 'from-amber-400 to-amber-600', name: 'Amber Gold' },
  { class: 'from-purple-400 to-purple-600', name: 'Purple Dream' },
  { class: 'from-rose-400 to-rose-600', name: 'Rose Petal' },
  { class: 'from-indigo-400 to-indigo-600', name: 'Indigo Night' },
  { class: 'from-teal-400 to-teal-600', name: 'Teal Lagoon' }
];

export default function HabitTrackerView() {
  const { habits, createHabit, toggleHabit, deleteHabit } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitIcon, setNewHabitIcon] = useState('Droplet');
  const [newHabitColor, setNewHabitColor] = useState('from-blue-400 to-blue-600');

  const today = new Date().toISOString().split('T')[0];
  
  // Get last 7 days formatted (e.g. ["Mon", "Tue", ...]) and their ISO dates
  const getLast7Days = () => {
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      days.push({
        name: weekdays[d.getDay()],
        dateStr: d.toISOString().split('T')[0],
        dayNum: d.getDate()
      });
    }
    return days;
  };

  const last7Days = getLast7Days();

  // Handle new habit creation
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    createHabit(newHabitName, newHabitIcon, newHabitColor);
    
    // Reset form
    setNewHabitName('');
    setNewHabitIcon('Droplet');
    setNewHabitColor('from-blue-400 to-blue-600');
    setIsCreating(false);
  };

  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    const IconComp = ICON_MAP[iconName] || Droplet;
    return <IconComp className={className} />;
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-emerald-500" /> Habits
          </h2>
          <p className="text-xs text-slate-400 mt-1">Develop good habits and keep your streak burning daily.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Habit
        </button>
      </div>

      {/* Habits Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habits Checklist (Left Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Today's Checklist</h3>

          {habits.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-semibold">No habits tracked yet.</p>
              <p className="text-xs text-slate-500 mt-1">Add habits like Meditate or Drink Water to start building discipline!</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {habits.map((habit) => {
                const isCompletedToday = habit.completedDates.includes(today);
                return (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    key={habit.id}
                    className={`p-4 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border-slate-800/80`}
                  >
                    {/* Habit title & details */}
                    <div className="flex items-center gap-4">
                      {/* Interactive circular checkbox */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleHabit(habit.id, today)}
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${habit.color} flex items-center justify-center text-white shadow-lg relative overflow-hidden transition-all`}
                      >
                        {isCompletedToday ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-emerald-400"
                          >
                            <Check className="w-6 h-6 stroke-[3.5]" />
                          </motion.div>
                        ) : null}
                        {renderIcon(habit.icon, "w-6 h-6 text-white")}
                      </motion.button>

                      <div>
                        <h4 className={`font-bold transition-all text-slate-200 ${isCompletedToday ? 'line-through text-slate-500' : ''}`}>
                          {habit.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/15 flex items-center gap-0.5">
                            🔥 {habit.streak} day streak
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Total: {habit.completedDates.length} completions
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right action area: Last 7 Days mini progress grid & delete */}
                    <div className="flex items-center justify-between md:justify-end gap-5 border-t border-slate-800/40 md:border-t-0 pt-3 md:pt-0">
                      {/* Mini weekly grid */}
                      <div className="flex items-center gap-1.5">
                        {last7Days.map((day) => {
                          const isDone = habit.completedDates.includes(day.dateStr);
                          const isCur = day.dateStr === today;
                          return (
                            <div 
                              key={day.dateStr}
                              className="flex flex-col items-center gap-1"
                              title={`${day.name} (${day.dateStr}) - ${isDone ? 'Completed' : 'Not completed'}`}
                            >
                              <span className="text-[9px] text-slate-550 font-bold uppercase">{day.name[0]}</span>
                              <div 
                                onClick={() => toggleHabit(habit.id, day.dateStr)}
                                className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-bold cursor-pointer transition-all border ${
                                  isDone 
                                    ? `bg-gradient-to-br ${habit.color} text-slate-950 border-transparent shadow-sm shadow-blue-500/10` 
                                    : isCur 
                                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/5' 
                                      : 'border-slate-800 text-slate-500 hover:border-slate-700 bg-slate-950/20'
                                }`}
                              >
                                {isDone ? <Check className="w-3 h-3 stroke-[3.5] text-white" /> : day.dayNum}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this habit? All history will be lost.')) {
                            deleteHabit(habit.id);
                          }
                        }}
                        className="text-slate-650 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/5 transition-all"
                        title="Delete habit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Habit Insights Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-5">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Habit Mastery
            </h3>

            {habits.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">Create habits to view insights.</p>
            ) : (
              <div className="space-y-4">
                {/* Streak calculation info */}
                <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Consistent Champ</span>
                  <div className="text-lg font-black text-slate-200 mt-1">
                    {habits.reduce((max, h) => h.streak > max ? h.streak : max, 0)} Days
                  </div>
                  <span className="text-[10px] text-slate-500">Highest active habit streak</span>
                </div>

                {/* Best habit completion rate */}
                <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Total Logged Checks</span>
                  <div className="text-lg font-black text-slate-200 mt-1">
                    {habits.reduce((sum, h) => sum + h.completedDates.length, 0)} Checks
                  </div>
                  <span className="text-[10px] text-slate-500">Across all of your custom habits</span>
                </div>

                {/* Micro instructions */}
                <div className="p-3.5 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 text-[11px] text-slate-400">
                  ⚡ <strong>Tip:</strong> You can toggle completed states for the past week by clicking the day numbers in the calendar grid! This allows quick streak repairs.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Habit Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
                <h3 className="text-lg font-bold text-slate-200">Create New Habit</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-5">
                {/* Habit Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Habit Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Read 20 pages, No sugar, Walk"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                {/* Choose Icon */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Select Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_ICONS.map((ico) => (
                      <button
                        type="button"
                        key={ico.name}
                        onClick={() => setNewHabitIcon(ico.name)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          newHabitIcon === ico.name
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                            : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                        }`}
                        title={ico.desc}
                      >
                        {renderIcon(ico.name, "w-5 h-5")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choose Color Gradient */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Choose Theme Color</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((col) => (
                      <button
                        type="button"
                        key={col.class}
                        onClick={() => setNewHabitColor(col.class)}
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${col.class} relative flex items-center justify-center transition-all ${
                          newHabitColor === col.class 
                            ? 'ring-4 ring-slate-100 ring-offset-2 ring-offset-slate-900 scale-105' 
                            : 'hover:scale-105'
                        }`}
                        title={col.name}
                      >
                        {newHabitColor === col.class && <Check className="w-4 h-4 text-white stroke-[3.5]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-slate-800/80 pt-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-250 bg-slate-850 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Create Habit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
