'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Flame, 
  Clock, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Calendar, 
  FileText, 
  PlusCircle, 
  X,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Workout, Exercise, Set } from '../../types';

const CATEGORIES = [
  { name: 'Strength', icon: 'Dumbbell', color: 'from-amber-500 to-orange-600', estimateKcal: 7 },
  { name: 'Cardio', icon: 'Sparkles', color: 'from-blue-500 to-indigo-600', estimateKcal: 8 },
  { name: 'Running', icon: 'Flame', color: 'from-emerald-500 to-teal-600', estimateKcal: 11 },
  { name: 'Cycling', icon: 'Clock', color: 'from-cyan-500 to-blue-600', estimateKcal: 9 },
  { name: 'Home Workout', icon: 'Plus', color: 'from-purple-500 to-pink-600', estimateKcal: 6 },
  { name: 'Custom', icon: 'PlusCircle', color: 'from-slate-500 to-slate-700', estimateKcal: 8 }
];

export default function WorkoutTrackerView() {
  const { workouts, addWorkout } = useApp();
  const [isLogging, setIsLogging] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Workout['category']>('Strength');
  const [duration, setDuration] = useState<number>(30);
  const [calories, setCalories] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Add exercise to form
  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ reps: 10, weight: 0, completed: true }] }]);
  };

  // Remove exercise from form
  const handleRemoveExercise = (exIdx: number) => {
    setExercises(exercises.filter((_, idx) => idx !== exIdx));
  };

  // Update exercise name
  const handleExerciseNameChange = (exIdx: number, val: string) => {
    const updated = [...exercises];
    updated[exIdx].name = val;
    setExercises(updated);
  };

  // Add set to exercise
  const handleAddSet = (exIdx: number) => {
    const updated = [...exercises];
    updated[exIdx].sets.push({ reps: 10, weight: 0, completed: true });
    setExercises(updated);
  };

  // Remove set from exercise
  const handleRemoveSet = (exIdx: number, setIdx: number) => {
    const updated = [...exercises];
    updated[exIdx].sets = updated[exIdx].sets.filter((_, idx) => idx !== setIdx);
    setExercises(updated);
  };

  // Update set values
  const handleSetChange = (exIdx: number, setIdx: number, field: keyof Set, val: number) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx] = {
      ...updated[exIdx].sets[setIdx],
      [field]: val
    };
    setExercises(updated);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    // Estimate calories if blank
    const selectedCatObj = CATEGORIES.find(c => c.name === category);
    const kcalFactor = selectedCatObj ? selectedCatObj.estimateKcal : 8;
    const finalCalories = calories ? parseInt(calories) : duration * kcalFactor;

    // Clean exercises with no names
    const cleanedExercises = exercises.filter(ex => ex.name.trim() !== '');

    addWorkout({
      category,
      title,
      duration,
      calories: finalCalories,
      exercises: cleanedExercises,
      notes: notes || undefined,
      date
    });

    // Reset and close
    setTitle('');
    setCategory('Strength');
    setDuration(30);
    setCalories('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);
    setExercises([]);
    setIsLogging(false);
  };

  // Get Category Styling Icon
  const getCategoryIcon = (cat: Workout['category']) => {
    switch (cat) {
      case 'Strength': return <Dumbbell className="w-5 h-5" />;
      case 'Running': return <Flame className="w-5 h-5" />;
      case 'Cycling': return <TrendingUp className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-emerald-500" /> Workouts
          </h2>
          <p className="text-xs text-slate-400 mt-1">Track your training sessions and burn calories.</p>
        </div>
        <button
          onClick={() => setIsLogging(true)}
          className="px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Log Workout
        </button>
      </div>

      {/* Main Grid split: List of workouts / details view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Workout History</h3>
          {workouts.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center">
              <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-bounce" />
              <p className="text-slate-400 font-semibold">No workouts logged yet.</p>
              <p className="text-xs text-slate-500 mt-1">Get active and record your first workout!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map((w) => {
                const catInfo = CATEGORIES.find(c => c.name === w.category);
                return (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    key={w.id}
                    onClick={() => setSelectedWorkout(selectedWorkout?.id === w.id ? null : w)}
                    className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      selectedWorkout?.id === w.id 
                        ? 'bg-slate-850 border-emerald-500/40' 
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${catInfo?.color || 'from-slate-500 to-slate-700'} flex items-center justify-center text-white shadow-lg`}>
                        {getCategoryIcon(w.category)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200">{w.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" /> {w.duration}m
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-rose-500" /> {w.calories} kcal
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" /> {w.date}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-2 border-t border-slate-800/60 md:border-t-0 pt-2 md:pt-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-750">
                        {w.category}
                      </span>
                      <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${selectedWorkout?.id === w.id ? 'rotate-90' : ''}`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Workout Details Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedWorkout ? (
              <motion.div
                key={selectedWorkout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md sticky top-6 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <h3 className="font-bold text-slate-200">Workout Summary</h3>
                  <button 
                    onClick={() => setSelectedWorkout(null)}
                    className="text-xs text-slate-500 hover:text-slate-300 font-semibold"
                  >
                    Close
                  </button>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {selectedWorkout.category}
                  </span>
                  <h4 className="text-xl font-bold text-slate-100 mt-2">{selectedWorkout.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Logged on {selectedWorkout.date}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-900">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Duration</span>
                    <span className="text-lg font-black text-slate-200">{selectedWorkout.duration} min</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Calories</span>
                    <span className="text-lg font-black text-rose-400">{selectedWorkout.calories} kcal</span>
                  </div>
                </div>

                {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exercises</h5>
                    <div className="space-y-3">
                      {selectedWorkout.exercises.map((ex, exIdx) => (
                        <div key={exIdx} className="bg-slate-950/20 border border-slate-850 p-3 rounded-2xl">
                          <div className="text-sm font-bold text-slate-200">{ex.name}</div>
                          <div className="mt-1.5 space-y-1">
                            {ex.sets.map((set, setIdx) => (
                              <div key={setIdx} className="flex justify-between items-center text-xs text-slate-400 bg-slate-900/30 px-2 py-1 rounded">
                                <span>Set {setIdx + 1}</span>
                                <span className="font-semibold text-slate-300">
                                  {set.reps} reps {set.weight ? `@ ${set.weight} kg` : ''} {set.distance ? `(${set.distance} km)` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedWorkout.notes && (
                  <div className="bg-slate-950/30 border border-slate-900 p-4 rounded-2xl">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                      <FileText className="w-3.5 h-3.5 text-slate-500" /> Notes
                    </h5>
                    <p className="text-xs text-slate-300 italic">"{selectedWorkout.notes}"</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-slate-900/20 border border-dashed border-slate-800/80 rounded-3xl p-8 text-center text-slate-500 text-xs hidden lg:block sticky top-6">
                Select a workout from the history to view complete details, sets, reps, and logged notes.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Log Workout Modal */}
      <AnimatePresence>
        {isLogging && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
                <h3 className="text-lg font-bold text-slate-200">Log Training Session</h3>
                <button
                  type="button"
                  onClick={() => setIsLogging(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workout Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Evening Run, Leg Day"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Workout['category'])}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration (Minutes)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={480}
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Calories */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Calories Burned <span className="text-[10px] text-slate-500 font-normal">(Optional, estimated if blank)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 350"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</label>
                    <input
                      type="text"
                      placeholder="How did you feel? Anything notable?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Exercises Form Builder */}
                <div className="space-y-4 border-t border-slate-800/80 pt-6">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Exercises & Sets
                    </label>
                    <button
                      type="button"
                      onClick={handleAddExercise}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Exercise
                    </button>
                  </div>

                  <div className="space-y-4">
                    {exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl relative space-y-4">
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(exIdx)}
                          className="absolute top-3 right-3 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Exercise Name */}
                        <div className="space-y-1 w-[85%]">
                          <label className="text-[10px] text-slate-500 font-bold uppercase">Exercise Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Bench Press, Squats, Treadmill Run"
                            value={ex.name}
                            onChange={(e) => handleExerciseNameChange(exIdx, e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Sets List */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">Sets</span>
                            <button
                              type="button"
                              onClick={() => handleAddSet(exIdx)}
                              className="text-[10px] font-bold text-emerald-400 hover:underline flex items-center gap-0.5"
                            >
                              + Add Set
                            </button>
                          </div>

                          <div className="space-y-2">
                            {ex.sets.map((set, setIdx) => (
                              <div key={setIdx} className="flex items-center gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                                <span className="text-[10px] text-slate-500 font-bold min-w-[32px]">Set {setIdx + 1}</span>
                                
                                <div className="flex-1 flex items-center gap-2">
                                  <div className="flex items-center gap-1.5 flex-1">
                                    <input
                                      type="number"
                                      required
                                      placeholder="Reps"
                                      value={set.reps}
                                      onChange={(e) => handleSetChange(exIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-center text-slate-200"
                                    />
                                    <span className="text-[10px] text-slate-500 font-semibold">reps</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 flex-1">
                                    <input
                                      type="number"
                                      placeholder="Weight"
                                      value={set.weight || ''}
                                      onChange={(e) => handleSetChange(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-center text-slate-200"
                                    />
                                    <span className="text-[10px] text-slate-500 font-semibold">kg</span>
                                  </div>
                                </div>

                                {ex.sets.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSet(exIdx, setIdx)}
                                    className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {exercises.length === 0 && (
                      <div className="text-center py-4 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                        No exercises added. You can log details, sets, and reps for complete muscle tracking.
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-slate-800/80 pt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsLogging(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-250 bg-slate-850 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Save Workout
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
