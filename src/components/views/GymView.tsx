'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  CalendarDays, 
  Clock, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Check, 
  Play, 
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { LibraryExercise } from '../../types';

// Large static library of exercises with guides and muscle gains
const EXERCISE_LIBRARY: LibraryExercise[] = [
  // CHEST
  { name: 'Barbell Bench Press', category: 'Chest', description: 'The king of chest exercises, targeting overall pectoral mass and strength.', howToUse: ['Lie flat on the bench', 'Grip the bar slightly wider than shoulder width', 'Lower the bar slowly to mid-chest level', 'Press the bar back up lock out arms'], gains: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii'], xpGained: 15 },
  { name: 'Incline Dumbbell Press', category: 'Chest', description: 'Excellent for targeting the clavicular head (upper portion) of the chest.', howToUse: ['Set bench to 30-45 degree incline', 'Hold dumbbells at shoulder height', 'Press dumbbells up until arms lock', 'Lower dumbbells under control'], gains: ['Clavicular Pectoralis', 'Triceps', 'Shoulders'], xpGained: 15 },
  { name: 'Cable Chest Flyes', category: 'Chest', description: 'Provides constant tension on the chest muscles, focusing on outer/inner definition.', howToUse: ['Set pulleys at chest height', 'Step forward with one foot', 'Bring hands together in a wide hugging motion', 'Squeeze chest at peak contraction'], gains: ['Inner Pectoralis', 'Serratus Anterior'], xpGained: 10 },
  // BACK
  { name: 'Weighted Pull-ups', category: 'Back', description: 'A foundational compound pull exercise to build lat width and a V-taper look.', howToUse: ['Hang from bar with overhand grip', 'Pull body up until chin clears the bar', 'Lower body slowly back to dead hang'], gains: ['Latissimus Dorsi', 'Biceps Brachii', 'Rhomboids'], xpGained: 20 },
  { name: 'Barbell Rows', category: 'Back', description: 'Develops back thickness and targets the upper/mid back complex.', howToUse: ['Hinge at hips, keep back straight', 'Pull barbell to lower chest/navel', 'Squeeze shoulder blades together', 'Lower bar under control'], gains: ['Rhomboids', 'Middle Trapezius', 'Lats'], xpGained: 15 },
  { name: 'Conventional Deadlift', category: 'Back', description: 'A massive compound builder targeting the entire posterior chain.', howToUse: ['Stand mid-foot under barbell', 'Hinge down, grab bar with shoulder-width grip', 'Drive legs down, pull chest up to stand tall', 'Do not round the lower back'], gains: ['Erector Spinae', 'Gluteus Maximus', 'Hamstrings'], xpGained: 25 },
  // LEGS
  { name: 'Barbell Back Squat', category: 'Legs', description: 'The absolute king of lower body development, building powerful quads and glutes.', howToUse: ['Place bar across upper traps', 'Step back, feet shoulder width apart', 'Squat down below parallel, hips back', 'Drive through heels back to top'], gains: ['Quadriceps', 'Glutes', 'Adductor Magnis'], xpGained: 20 },
  { name: 'Romanian Deadlift', category: 'Legs', description: 'Isolates the hamstrings and glutes through hip hinging.', howToUse: ['Hold barbell at hip height', 'Hinge hips backwards, slight knee bend', 'Slide bar down shins until stretch felt', 'Squeeze glutes to stand tall'], gains: ['Hamstrings', 'Gluteus Maximus', 'Lower Back'], xpGained: 15 },
  { name: 'Leg Press', category: 'Legs', description: 'Safely isolates leg muscles without loading the spine directly.', howToUse: ['Sit in press carriage, place feet width-apart', 'Unlock safety handles', 'Lower sled towards chest (90 degrees)', 'Press sled back up, do not lock knees'], gains: ['Quadriceps', 'Vastus Medialis', 'Hamstrings'], xpGained: 12 },
  // SHOULDERS
  { name: 'Overhead Barbell Press', category: 'Shoulders', description: 'A core test of upper body vertical pushing strength.', howToUse: ['Hold bar at collarbone height', 'Brace core and glutes tight', 'Press bar straight overhead, tuck chin', 'Shrug shoulders at lock out'], gains: ['Anterior Deltoids', 'Triceps', 'Upper Pectorals'], xpGained: 15 },
  { name: 'Dumbbell Lateral Raise', category: 'Shoulders', description: 'The primary movement to build shoulder width (lateral cap).', howToUse: ['Stand holding dumbbells at sides', 'Raise arms out to sides with slight elbow bend', 'Stop at shoulder height, pinky finger up', 'Control weights back down'], gains: ['Lateral Deltoids', 'Trapezius'], xpGained: 10 },
  // ARMS
  { name: 'Incline Dumbbell Curl', category: 'Arms', description: 'Puts the biceps in a deep stretched position for maximum growth.', howToUse: ['Sit on incline bench (45 degrees)', 'Let dumbbells hang straight down', 'Curl dumbbells up rotating palms forward', 'Lower under deep stretch tension'], gains: ['Bicep Long Head', 'Brachialis'], xpGained: 10 },
  { name: 'Tricep Cable Pushdowns', category: 'Arms', description: 'Isolates the triceps with constant tension.', howToUse: ['Grab rope attachment from high pulley', 'Lock elbows to ribs', 'Press rope down separating hands at bottom', 'Return slowly to chest height'], gains: ['Triceps Lateral Head', 'Medial Head'], xpGained: 10 },
  // CORE
  { name: 'Hanging Leg Raise', category: 'Core', description: 'A high difficulty exercise targeting the lower abdominals.', howToUse: ['Hang from pull-up bar', 'Keep legs straight or bend knees', 'Raise legs until parallel to floor', 'Lower legs slowly avoiding swinging'], gains: ['Rectus Abdominis', 'Hip Flexors'], xpGained: 12 },
  { name: 'Ab Wheel Rollouts', category: 'Core', description: 'Tests core anti-extension strength severely.', howToUse: ['Kneel holding ab wheel handles', 'Roll forward slowly keeping core hollowed', 'Pull back using abs, do not sag back'], gains: ['Transverse Abdominis', 'Obliques'], xpGained: 15 },
  // CARDIO
  { name: 'Rowing Machine Intervals', category: 'Cardio', description: 'Full body cardiovascular builder engaging 85% of muscle mass.', howToUse: ['Secure feet, grab handle bar', 'Push off with legs first', 'Lean back slightly and pull bar to lower chest', 'Return arms first, slide body forward'], gains: ['Cardiovascular System', 'Lats', 'Hamstrings'], xpGained: 15 }
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export default function GymView() {
  const { 
    profile, 
    workoutSchedule, 
    saveWorkoutSchedule, 
    addWorkout 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'schedule' | 'library' | 'recommend'>('schedule');
  const [selectedCategory, setSelectedCategory] = useState<LibraryExercise['category'] | 'All'>('All');
  const [selectedEx, setSelectedEx] = useState<LibraryExercise | null>(null);

  // Schedule form states
  const [scheduleDays, setScheduleDays] = useState<typeof workoutSchedule.days>([...workoutSchedule.days]);
  const [reminderTime, setReminderTime] = useState(workoutSchedule.reminderTime);

  // Auto-Scheduler Logic
  const getAutoWorkoutSuggestion = () => {
    const todayNum = new Date().getDay(); // 0 is Sun, 1 is Mon...
    const weekdayMap: Record<number, typeof WEEKDAYS[number]> = {
      0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'
    };
    const todayName = weekdayMap[todayNum];
    const isTrainingDay = workoutSchedule.days.includes(todayName);

    if (!isTrainingDay) {
      return {
        title: 'Active Recovery & Flexibility',
        description: 'Today is scheduled as a rest day! Perform low-intensity core work and static stretching to repair muscle fibers.',
        kcal: 100,
        duration: 20,
        exercises: ['Ab Wheel Rollouts', 'Hanging Leg Raise']
      };
    }

    // Suggestions depending on Goal
    switch (profile.fitnessGoal) {
      case 'gain_muscle':
        if (todayName === 'Mon' || todayName === 'Fri') {
          return {
            title: 'Hypertrophy Upper Body (Push Focus)',
            description: 'Focused on structural vertical/horizontal pressing. Target chest and shoulder hypertrophy.',
            kcal: 380,
            duration: 45,
            exercises: ['Barbell Bench Press', 'Overhead Barbell Press', 'Tricep Cable Pushdowns']
          };
        } else if (todayName === 'Wed') {
          return {
            title: 'Hypertrophy Back & Pull',
            description: 'Focused on vertical rows and arm thickness to develop lat width.',
            kcal: 400,
            duration: 50,
            exercises: ['Weighted Pull-ups', 'Barbell Rows', 'Incline Dumbbell Curl']
          };
        } else {
          return {
            title: 'Hypertrophy Lower Body Squat Day',
            description: 'Focus on quad recruitment, glutes, and posterior loading.',
            kcal: 450,
            duration: 55,
            exercises: ['Barbell Back Squat', 'Romanian Deadlift', 'Leg Press']
          };
        }
      case 'lose_weight':
        return {
          title: 'HIIT Fat Burn & Cardio Shred',
          description: 'High intensity interval training. Maximize heart rate and maintain oxygen debt for extended calorie burning.',
          kcal: 500,
          duration: 35,
          exercises: ['Rowing Machine Intervals', 'Ab Wheel Rollouts', 'Hanging Leg Raise']
        };
      case 'build_endurance':
        return {
          title: 'Aerobic Endurance & Stamina Builder',
          description: 'Focus on steady-state cardiovascular work and muscular endurance reps.',
          kcal: 450,
          duration: 45,
          exercises: ['Rowing Machine Intervals', 'Weighted Pull-ups', 'Leg Press']
        };
      default:
        return {
          title: 'Full Body Conditioning',
          description: 'A general physical conditioning workout for toning and joint health.',
          kcal: 280,
          duration: 30,
          exercises: ['Barbell Bench Press', 'Barbell Back Squat', 'Ab Wheel Rollouts']
        };
    }
  };

  const currentSuggestion = getAutoWorkoutSuggestion();

  // Save schedule
  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    saveWorkoutSchedule({
      days: scheduleDays,
      reminderTime
    });
  };

  const toggleDaySelection = (day: typeof WEEKDAYS[number]) => {
    if (scheduleDays.includes(day)) {
      setScheduleDays(scheduleDays.filter(d => d !== day));
    } else {
      setScheduleDays([...scheduleDays, day]);
    }
  };

  const handleSuggestLog = () => {
    // Generate exercises structure
    const exerciseList = currentSuggestion.exercises.map(name => ({
      name,
      sets: [
        { reps: 10, weight: profile.units === 'imperial' ? 100 : 45, completed: true },
        { reps: 10, weight: profile.units === 'imperial' ? 100 : 45, completed: true }
      ]
    }));

    addWorkout({
      category: profile.fitnessGoal === 'lose_weight' ? 'Cardio' : 'Strength',
      title: currentSuggestion.title,
      duration: currentSuggestion.duration,
      calories: currentSuggestion.kcal,
      exercises: exerciseList,
      notes: 'Logged via Auto-Scheduler Suggestion.',
      date: new Date().toISOString().split('T')[0]
    });
  };

  // Filters for exercise library
  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'] as const;
  const filteredExercises = selectedCategory === 'All'
    ? EXERCISE_LIBRARY
    : EXERCISE_LIBRARY.filter(e => e.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* View Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-emerald-500" /> Gym Central
          </h2>
          <p className="text-xs text-slate-400 mt-1">Configure your weekly splits, view exercises guides, and pull auto schedules.</p>
        </div>

        {/* View Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-900 self-start">
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'schedule'
                ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setActiveSubTab('recommend')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'recommend'
                ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Auto Suggestion
          </button>
          <button
            onClick={() => setActiveSubTab('library')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeSubTab === 'library'
                ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exercise Library
          </button>
        </div>
      </div>

      {/* --- RENDER SUB-VIEWS --- */}

      {activeSubTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Schedule Form */}
          <form onSubmit={handleSaveSchedule} className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-6">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-400" /> Workout Days split
            </h3>

            {/* Days picker */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Training Days</label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((day) => {
                  const isSelected = scheduleDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDaySelection(day)}
                      className={`w-12 h-12 rounded-xl border font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-500/5'
                          : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time reminder picker */}
            <div className="space-y-3 w-full max-w-xs">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-4 h-4" /> Daily Reminder Notification
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Save Schedule Preferences
              </button>
            </div>
          </form>

          {/* Schedule Info Panel */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2.5 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-400" /> Reminders Status
            </h3>
            
            <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Weekly Volume</span>
              <div className="text-lg font-black text-slate-250">
                {workoutSchedule.days.length} Days / Week
              </div>
              <span className="text-[10px] text-slate-500 block">
                Active schedule: {workoutSchedule.days.join(', ') || 'No days selected'}
              </span>
            </div>

            <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Daily Alerts</span>
              <div className="text-lg font-black text-slate-250">
                🔔 {workoutSchedule.reminderTime}
              </div>
              <span className="text-[10px] text-slate-500 block">Reminding you to stay consistent</span>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'recommend' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-emerald-400 fill-emerald-500/10" /> Daily Suggested Workout
              </h3>
              <p className="text-[10px] text-slate-550 mt-0.5">Automated suggestions calibrated from your age, weight, and fitness goal.</p>
            </div>
            
            <span className="text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              Goal: {profile.fitnessGoal.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl">
              <h4 className="text-lg font-black text-slate-200">{currentSuggestion.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {currentSuggestion.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950/30 border border-slate-900 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Target Calories</span>
                <span className="text-md font-black text-rose-400">~ {currentSuggestion.kcal} kcal</span>
              </div>
              <div className="p-3.5 bg-slate-950/30 border border-slate-900 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Estimated Duration</span>
                <span className="text-md font-black text-slate-250">{currentSuggestion.duration} mins</span>
              </div>
            </div>

            {/* Exercises list */}
            <div className="space-y-2.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Suggested Movements</span>
              <div className="space-y-2">
                {currentSuggestion.exercises.map((exName, idx) => {
                  const exDetails = EXERCISE_LIBRARY.find(el => el.name === exName);
                  return (
                    <div key={idx} className="flex justify-between items-center bg-slate-950/20 border border-slate-850 px-4 py-3 rounded-xl">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">{exName}</span>
                        <span className="text-[9px] text-slate-500 block">Focus: {exDetails?.gains.slice(0, 2).join(', ') || 'Muscle hypertrophy'}</span>
                      </div>
                      <span className="text-[10px] text-slate-450 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {exDetails?.category || 'Strength'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Log Button */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  handleSuggestLog();
                  alert('Suggested Workout logged! Check your stats dashboard.');
                }}
                className="px-5 py-3 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Log suggested session (+50 XP)
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Exercise List & Filters */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter buttons */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 pr-1">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all border shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-slate-950 border-slate-850 text-slate-450 hover:border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Library Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredExercises.map((ex) => (
                <div
                  key={ex.name}
                  onClick={() => setSelectedEx(ex)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    selectedEx?.name === ex.name
                      ? 'bg-slate-850 border-emerald-500/40'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-750'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-250">{ex.name}</h4>
                    <span className="text-[9px] text-slate-500 mt-1 block">Targets: {ex.gains[0]}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </div>
              ))}
            </div>
          </div>

          {/* Exercise Instructions Sidebar */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {selectedEx ? (
                <motion.div
                  key={selectedEx.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                      {selectedEx.category}
                    </span>
                    <button
                      onClick={() => setSelectedEx(null)}
                      className="text-xs text-slate-500 hover:text-slate-350 font-bold"
                    >
                      Close
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-200">{selectedEx.name}</h3>
                    <p className="text-[11px] text-slate-450 mt-1.5 leading-relaxed">
                      {selectedEx.description}
                    </p>
                  </div>

                  {/* Muscle Gains list */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Target Muscle Gains</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEx.gains.map((g, idx) => (
                        <span key={idx} className="text-[10px] font-bold text-emerald-450 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850">
                          💪 {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* How to use */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">How to Execute</span>
                    <ol className="space-y-1.5 list-decimal list-inside text-[11px] text-slate-400 leading-relaxed">
                      {selectedEx.howToUse.map((step, idx) => (
                        <li key={idx} className="pl-1">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-900/20 border border-dashed border-slate-800/80 rounded-3xl p-6 text-center text-slate-500 text-xs hidden lg:block">
                  Select an exercise from the library on the left to view instructions, muscle groups, and physical gains.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
