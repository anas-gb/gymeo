'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Sun, 
  Moon, 
  Trash2, 
  Download, 
  Shield, 
  Bell, 
  Volume2,
  VolumeX,
  Languages,
  Check,
  RotateCcw
} from 'lucide-react';

export default function SettingsView() {
  const { 
    profile, 
    updateProfile, 
    theme, 
    setTheme, 
    resetAllData,
    workouts,
    habits,
    focusSessions,
    waterLogs,
    weightHistory
  } = useApp();

  // Profile forms
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || '');
  const [age, setAge] = useState<string>(profile.age?.toString() || '');
  const [height, setHeight] = useState<number>(profile.height || 170);
  const [weight, setWeight] = useState<number>(profile.weight || 70);
  const [fitnessGoal, setFitnessGoal] = useState(profile.fitnessGoal);

  // General controls
  const [language, setLanguage] = useState('en');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);

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

  // Export JSON
  const handleExportData = () => {
    const dataToExport = {
      profile,
      workouts,
      habits,
      focusSessions,
      waterLogs,
      weightHistory,
      exportDate: new Date().toISOString()
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataToExport, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `gymeo_backup_${profile.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Settings className="w-7 h-7 text-emerald-500" /> Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">Manage your identity, visual style, preferences, and data options.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Editor (Left Columns) */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md">
          <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-emerald-400" /> Edit Profile Details
          </h3>

          <form onSubmit={handleProfileSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Age</label>
                <input
                  type="number"
                  placeholder="Not specified"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Height (cm)</label>
                <input
                  type="number"
                  required
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Fitness Goal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary Goal</label>
                <select
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="stay_fit">Maintain Fitness</option>
                  <option value="lose_weight">Weight Loss</option>
                  <option value="gain_muscle">Muscle Building</option>
                  <option value="build_endurance">Stamina / Cardio</option>
                </select>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biography</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Write a little about your journey..."
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Global Settings Sidebars (Right Column) */}
        <div className="space-y-6">
          {/* Preferences Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              ⚙️ App Preferences
            </h3>

            {/* Dark Mode Switch */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-350">Visual Theme</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Toggle light vs dark theme</div>
              </div>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-lg transition-all ${
                    theme === 'light'
                      ? 'bg-slate-850 text-amber-500'
                      : 'text-slate-550 hover:text-slate-400'
                  }`}
                  title="Light Theme"
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
                  title="Dark Theme"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sound toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-350">Gaming Sounds</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Play bells/sfx on milestones</div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-10 h-6 rounded-full flex items-center p-1 transition-all ${
                  soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <motion.div layout className="w-4 h-4 rounded-full bg-slate-950" />
              </button>
            </div>

            {/* Notifications toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-350">Push Reminders</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Reminders for daily workout goals</div>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-10 h-6 rounded-full flex items-center p-1 transition-all ${
                  pushNotifications ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <motion.div layout className="w-4 h-4 rounded-full bg-slate-950" />
              </button>
            </div>

            {/* Privacy toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-350">Private Profile</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Hide feeds from leaderboards</div>
              </div>
              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className={`w-10 h-6 rounded-full flex items-center p-1 transition-all ${
                  isPrivate ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <motion.div layout className="w-4 h-4 rounded-full bg-slate-950" />
              </button>
            </div>

            {/* Language dropdown */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div>
                <div className="text-xs font-bold text-slate-350">Language</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Change application language</div>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-1.5 text-xs text-slate-200"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          {/* Backup & Actions Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-3.5">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              🛡️ Data Management
            </h3>

            {/* Export data */}
            <button
              onClick={handleExportData}
              className="w-full py-2.5 text-xs font-bold bg-slate-950 border border-slate-850 hover:bg-slate-900 hover:border-slate-800 text-slate-200 rounded-2xl flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4 text-emerald-500" /> Export Profile Data (JSON)
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

            {/* Delete/Purge account mock */}
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
