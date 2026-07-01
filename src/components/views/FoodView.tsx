'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Apple, 
  Plus, 
  Trash2, 
  Utensils, 
  X, 
  Droplet,
  Info,
  Calendar,
  Flame
} from 'lucide-react';
import { Meal } from '../../types';

export default function FoodView() {
  const { profile, meals, addMeal, deleteMeal, logWater } = useApp();
  const [isLoggingMeal, setIsLoggingMeal] = useState(false);

  // Form states
  const [mealName, setMealName] = useState('');
  const [mealType, setMealType] = useState<Meal['type']>('Breakfast');
  const [calories, setCalories] = useState<number>(350);
  const [protein, setProtein] = useState<number>(20);
  const [carbs, setCarbs] = useState<number>(40);
  const [fat, setFat] = useState<number>(10);

  const today = new Date().toISOString().split('T')[0];

  // Dynamic targets based on goal
  const getNutritionTargets = () => {
    switch (profile.fitnessGoal) {
      case 'lose_weight':
        return { kcal: 1800, protein: 140, carbs: 180, fat: 55 };
      case 'gain_muscle':
        return { kcal: 2700, protein: 165, carbs: 320, fat: 80 };
      case 'build_endurance':
        return { kcal: 2400, protein: 130, carbs: 310, fat: 65 };
      default: // stay_fit
        return { kcal: 2100, protein: 130, carbs: 240, fat: 65 };
    }
  };

  const targets = getNutritionTargets();

  // Filter today's meals
  const todaysMeals = meals.filter(m => m.date === today);

  // Sum totals
  const totalKcal = todaysMeals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = todaysMeals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFat = todaysMeals.reduce((sum, m) => sum + m.fat, 0);

  const handleLogMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    addMeal({
      name: mealName,
      type: mealType,
      calories,
      protein,
      carbs,
      fat,
      date: today
    });

    // Reset and close
    setMealName('');
    setMealType('Breakfast');
    setCalories(350);
    setProtein(20);
    setCarbs(40);
    setFat(10);
    setIsLoggingMeal(false);
  };

  // Helper for SVGs
  const getCircleProps = (val: number, target: number, size: number = 80, stroke: number = 6) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const percent = Math.min(100, Math.floor((val / target) * 100)) || 0;
    const offset = circ - (percent / 100) * circ;
    return { r, circ, offset, strokeWidth: stroke, center: size / 2 };
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Apple className="w-7 h-7 text-emerald-500" /> Food Diary
          </h2>
          <p className="text-xs text-slate-400 mt-1">Log your nutrition, monitor calorie bounds, and track macro splits.</p>
        </div>
        <button
          onClick={() => setIsLoggingMeal(true)}
          className="px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-2xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Log Meal
        </button>
      </div>

      {/* Macro Tracking Ring Panel */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md flex flex-col md:flex-row items-center justify-around gap-6">
        
        {/* Main Calorie Ring */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={64}
                className="stroke-slate-850 fill-none"
                strokeWidth="8"
              />
              <motion.circle
                cx="72"
                cy="72"
                r={64}
                className="stroke-emerald-500 fill-none"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 64}
                animate={{ strokeDashoffset: (2 * Math.PI * 64) - (Math.min(100, Math.floor((totalKcal / targets.kcal) * 100)) / 100) * (2 * Math.PI * 64) }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-0.5">
              <span className="text-2xl font-black text-slate-100">{totalKcal}</span>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">/ {targets.kcal} kcal</span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-350">Calories Eaten</span>
        </div>

        {/* Small Macros Rings */}
        <div className="grid grid-cols-3 gap-6 md:gap-12 w-full md:w-auto">
          {/* Protein */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r={36} className="stroke-slate-850 fill-none" strokeWidth="5" />
                <motion.circle
                  cx="40" cy="40" r={36} className="stroke-orange-500 fill-none" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 36}
                  animate={{ strokeDashoffset: (2 * Math.PI * 36) - (Math.min(100, Math.floor((totalProtein / targets.protein) * 100)) / 100) * (2 * Math.PI * 36) }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute text-[10px] font-black text-slate-200">{totalProtein}g</div>
            </div>
            <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Protein ({targets.protein}g)</span>
          </div>

          {/* Carbs */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r={36} className="stroke-slate-850 fill-none" strokeWidth="5" />
                <motion.circle
                  cx="40" cy="40" r={36} className="stroke-blue-400 fill-none" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 36}
                  animate={{ strokeDashoffset: (2 * Math.PI * 36) - (Math.min(100, Math.floor((totalCarbs / targets.carbs) * 100)) / 100) * (2 * Math.PI * 36) }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute text-[10px] font-black text-slate-200">{totalCarbs}g</div>
            </div>
            <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Carbs ({targets.carbs}g)</span>
          </div>

          {/* Fat */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r={36} className="stroke-slate-850 fill-none" strokeWidth="5" />
                <motion.circle
                  cx="40" cy="40" r={36} className="stroke-purple-400 fill-none" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 36}
                  animate={{ strokeDashoffset: (2 * Math.PI * 36) - (Math.min(100, Math.floor((totalFat / targets.fat) * 100)) / 100) * (2 * Math.PI * 36) }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute text-[10px] font-black text-slate-200">{totalFat}g</div>
            </div>
            <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Fat ({targets.fat}g)</span>
          </div>
        </div>

      </div>

      {/* Main split: Food Diary log / Water Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Food Diary list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Today's Meals</h3>
          
          {todaysMeals.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-10 text-center">
              <Utensils className="w-12 h-12 text-slate-650 mx-auto mb-3" />
              <p className="text-slate-400 font-semibold">No meals logged today.</p>
              <p className="text-xs text-slate-500 mt-1">Start tracking your diet. Keep your macros balanced.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysMeals.map((m) => (
                <div
                  key={m.id}
                  className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-3xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm">{m.name}</h4>
                      <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 text-[10px] text-slate-500 mt-1">
                        <span className="font-bold text-slate-400">{m.type}</span>
                        <span>•</span>
                        <span>Prot: <strong className="text-orange-400">{m.protein}g</strong></span>
                        <span>Carbs: <strong className="text-blue-400">{m.carbs}g</strong></span>
                        <span>Fat: <strong className="text-purple-400">{m.fat}g</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-black text-sm text-slate-250">{m.calories}</span>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold">kcal</span>
                    </div>
                    <button
                      onClick={() => deleteMeal(m.id)}
                      className="text-slate-650 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/5 transition-all"
                      title="Delete meal log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Water / Drink diary sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Droplet className="w-5 h-5 text-blue-500" /> Fluids Intake
            </h3>
            
            <div className="flex items-center gap-4 justify-center bg-slate-950/20 p-4 border border-slate-900 rounded-2xl">
              <div className="text-center">
                <span className="text-3xl font-black text-slate-100">
                  {profile.units === 'imperial' 
                    ? `${profile.waterIntakeToday} oz` 
                    : `${(profile.waterIntakeToday / 1000).toFixed(1)}L`
                  }
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 uppercase tracking-wide">
                  Goal: {profile.units === 'imperial' ? `${profile.waterIntakeGoal} oz` : `${(profile.waterIntakeGoal / 1000).toFixed(1)}L`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => logWater(profile.units === 'imperial' ? 8 : 250)}
                className="py-2.5 text-xs font-bold bg-slate-950 hover:bg-slate-900 border border-slate-850 text-blue-400 rounded-xl transition-all"
              >
                + {profile.units === 'imperial' ? '8 oz' : '250 ml'}
              </button>
              <button
                type="button"
                onClick={() => logWater(profile.units === 'imperial' ? 16 : 500)}
                className="py-2.5 text-xs font-bold bg-slate-950 hover:bg-slate-900 border border-slate-850 text-blue-400 rounded-xl transition-all"
              >
                + {profile.units === 'imperial' ? '16 oz' : '500 ml'}
              </button>
            </div>

            <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-[10px] text-slate-400 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Drinking enough water keeps muscles hydrated, reduces cramps, and boosts metabolic recovery rates.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Log Meal Modal */}
      <AnimatePresence>
        {isLoggingMeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
                <h3 className="text-lg font-bold text-slate-200">Log Nutrition Entry</h3>
                <button
                  onClick={() => setIsLoggingMeal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleLogMeal} className="p-6 space-y-4">
                {/* Meal Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Food / Meal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oatmeal with honey"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Meal Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Meal Category</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                {/* Calories */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" /> Calories (kcal)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={calories}
                    onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Macros grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Protein */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Protein (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={protein}
                      onChange={(e) => setProtein(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-2 text-xs text-center text-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  {/* Carbs */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Carbs (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={carbs}
                      onChange={(e) => setCarbs(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-2 text-xs text-center text-slate-200 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  {/* Fat */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Fat (g)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={fat}
                      onChange={(e) => setFat(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-2 text-xs text-center text-slate-200 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="border-t border-slate-800/80 pt-5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsLoggingMeal(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-250 bg-slate-850 hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Save Meal Log
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
