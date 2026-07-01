'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Sun, 
  Moon, 
  Download, 
  RotateCcw, 
  Trash2, 
  Scale, 
  Activity,
  Calculator,
  Grid
} from 'lucide-react';

export default function ProfileView() {
  const { 
    profile, 
    updateProfile, 
    theme, 
    setTheme, 
    resetAllData,
    toggleUnits,
    workouts,
    habits,
    focusSessions,
    meals,
    weightHistory
  } = useApp();

  // Profile forms state
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || '');
  const [age, setAge] = useState<string>(profile.age?.toString() || '');
  const [height, setHeight] = useState<number>(profile.height || 170);
  const [weight, setWeight] = useState<number>(profile.weight || 70);
  const [fitnessGoal, setFitnessGoal] = useState(profile.fitnessGoal);

  // Sync state if profile changes (e.g. on unit conversion toggle)
  useEffect(() => {
    setDisplayName(profile.displayName);
    setUsername(profile.username);
    setBio(profile.bio || '');
    setAge(profile.age?.toString() || '');
    setHeight(profile.height);
    setWeight(profile.weight);
    setFitnessGoal(profile.fitnessGoal);
  }, [profile]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      username,
      bio,
      age: age ? parseInt(age) : undefined,
      height,
      weight,
      fitnessGoal
    });
  };

  // BMI calculations
  const calculateBMI = () => {
    if (!height || !weight) return { bmi: 0, text: 'N/A', color: 'text-slate-500', percent: 0 };
    
    let bmi = 0;
    if (profile.units === 'imperial') {
      // lbs / inches^2 * 703
      bmi = (weight / (height * height)) * 703;
    } else {
      // kg / m^2
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    }
    
    bmi = Math.round(bmi * 10) / 10;
    
    let text = 'Normal';
    let color = 'text-emerald-400';
    let percent = 50; // default indicator placement
    
    if (bmi < 18.5) {
      text = 'Underweight';
      color = 'text-blue-400';
      percent = Math.min(25, (bmi / 18.5) * 25);
    } else if (bmi >= 18.5 && bmi < 25) {
      text = 'Normal Weight';
      color = 'text-emerald-400';
      percent = 25 + ((bmi - 18.5) / 6.5) * 25;
    } else if (bmi >= 25 && bmi < 30) {
      text = 'Overweight';
      color = 'text-amber-500';
      percent = 50 + ((bmi - 25) / 5) * 25;
    } else {
      text = 'Obese';
      color = 'text-rose-500';
      percent = 75 + Math.min(25, ((bmi - 30) / 15) * 25);
    }
    
    return { bmi, text, color, percent };
  };

  const bmiDetails = calculateBMI();

  // Export JSON
  const handleExportData = () => {
    const dataToExport = {
      profile,
      workouts,
      habits,
      focusSessions,
      meals,
      weightHistory,
      exportDate: new Date().toISOString()
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `gymeo_profile_${profile.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <User className="w-7 h-7 text-emerald-500" /> Profile & Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">Review your body metrics BMI indexes, toggle units, and export data backups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Editor (Left Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile fields Form */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-emerald-400" /> Personal Identity
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Height ({profile.units === 'imperial' ? 'inches' : 'cm'})
                  </label>
                  <input
                    type="number"
                    required
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-855 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Weight ({profile.units === 'imperial' ? 'lbs' : 'kg'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-855 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fitness Target</label>
                  <select
                    value={fitnessGoal}
                    onChange={(e) => setFitnessGoal(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none"
                  >
                    <option value="stay_fit">Maintain Fitness</option>
                    <option value="lose_weight">Weight Loss</option>
                    <option value="gain_muscle">Muscle Building</option>
                    <option value="build_endurance">Stamina / Cardio</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio Quote</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* BMI Calculator Panel */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" /> Body Mass Index (BMI)
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-6 justify-between p-4 bg-slate-950/30 border border-slate-900 rounded-2xl">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Your Calculated BMI</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className={`text-3xl font-black ${bmiDetails.color}`}>{bmiDetails.bmi}</span>
                  <span className={`text-xs font-bold ${bmiDetails.color}`}>{bmiDetails.text}</span>
                </div>
              </div>
              
              <div className="text-xs text-slate-550 leading-relaxed max-w-sm">
                A healthy body BMI index typically ranges between <strong>18.5 and 24.9</strong>. This indicates optimal balance of height to weight ratio.
              </div>
            </div>

            {/* Gauge slider range */}
            <div className="space-y-2 pt-2">
              <div className="relative w-full h-2 bg-gradient-to-r from-blue-400 via-emerald-400 via-amber-400 to-rose-500 rounded-full">
                {/* Dial indicator dot */}
                <div 
                  className="absolute -top-1.5 w-5 h-5 rounded-full bg-white border-4 border-slate-900 shadow-md transition-all duration-500"
                  style={{ left: `calc(${bmiDetails.percent}% - 10px)` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase">
                <span>&lt; 18.5 (Low)</span>
                <span>18.5 - 24.9 (Ideal)</span>
                <span>25 - 29.9 (High)</span>
                <span>&gt; 30 (Severe)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Settings & backups (Right Column) */}
        <div className="space-y-6">
          {/* Preferences */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              ⚙️ Preferences
            </h3>

            {/* Unit Selector */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-350">Unit System</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Toggle metric vs imperial</div>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900">
                <button
                  onClick={toggleUnits}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all ${
                    profile.units === 'metric'
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-550 hover:text-slate-450'
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  onClick={toggleUnits}
                  className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-all ${
                    profile.units === 'imperial'
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-550 hover:text-slate-450'
                  }`}
                >
                  Imperial (lbs/in)
                </button>
              </div>
            </div>

            {/* Visual theme toggler */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-350">Visual Theme</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Toggle light vs dark mode</div>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'light'
                      ? 'bg-slate-850 text-amber-500'
                      : 'text-slate-550 hover:text-slate-400'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-slate-850 text-emerald-400'
                      : 'text-slate-550 hover:text-slate-400'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Backup & Actions */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-3">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              🛡️ Data Management
            </h3>

            {/* Export data */}
            <button
              onClick={handleExportData}
              className="w-full py-2.5 text-xs font-bold bg-slate-950 border border-slate-850 hover:bg-slate-900 hover:border-slate-800 text-slate-200 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-500" /> Export Profile Backup (JSON)
            </button>

            {/* Reset App Data */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all data back to default mock values? This cannot be undone.')) {
                  resetAllData();
                }
              }}
              className="w-full py-2.5 text-xs font-bold bg-slate-950 border border-slate-850 hover:bg-slate-900 hover:border-slate-800 text-slate-200 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-amber-500" /> Reset to Seeding Defaults
            </button>

            {/* Delete local mock */}
            <button
              onClick={() => {
                if (confirm('Delete Gymeo account? This will purge all LocalStorage records and profile statistics immediately.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="w-full py-2.5 text-xs font-bold bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Purge Local Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
