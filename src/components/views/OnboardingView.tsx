'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Zap, 
  Target, 
  Scale, 
  Droplet, 
  Footprints,
  Compass,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../../types';

interface OnboardingViewProps {
  initialProfile: UserProfile | null;
  onComplete: (onboardingData: Partial<UserProfile>) => void;
}

const GOALS = [
  { id: 'stay_fit', title: 'Maintain Fitness', desc: 'Stay active, tone muscles, and sustain general wellness.', gradient: 'from-emerald-500 to-teal-500', emoji: '🧘‍♂️' },
  { id: 'lose_weight', title: 'Weight Loss', desc: 'Burn active calories, shred fat, and lean out.', gradient: 'from-rose-500 to-pink-500', emoji: '🔥' },
  { id: 'gain_muscle', title: 'Build Muscle', desc: 'Hypertrophy training, weight gains, and strength building.', gradient: 'from-amber-500 to-orange-500', emoji: '💪' },
  { id: 'build_endurance', title: 'Stamina & Cardio', desc: 'Increase VO2 Max, training for marathons, and heart health.', gradient: 'from-blue-500 to-indigo-500', emoji: '🏃‍♂️' }
] as const;

export default function OnboardingView({ initialProfile, onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState(1);
  
  // State variables for form
  const [displayName, setDisplayName] = useState(initialProfile?.displayName || '');
  const [username, setUsername] = useState(initialProfile?.username || '');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('24');
  const [height, setHeight] = useState(175); // cm
  const [weight, setWeight] = useState(70); // kg
  const [fitnessGoal, setFitnessGoal] = useState<UserProfile['fitnessGoal']>('stay_fit');
  const [waterGoal, setWaterGoal] = useState(2500); // ml
  const [stepsGoal, setStepsGoal] = useState(10000); // steps

  const nextStep = () => {
    if (step === 1 && !displayName.trim()) return;
    setStep(prev => Math.min(4, prev + 1));
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleFinish = () => {
    onComplete({
      displayName,
      username: username || displayName.toLowerCase().replace(/\s+/g, '_'),
      bio,
      age: parseInt(age) || 24,
      height,
      weight,
      fitnessGoal,
      waterIntakeGoal: waterGoal,
      walkGoalSteps: stepsGoal,
      // reset daily progress on new onboarding
      waterIntakeToday: 0,
      walkStepsToday: 0
    });
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((num) => (
          <React.Fragment key={num}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              step >= num 
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                : 'bg-slate-900 border border-slate-800 text-slate-500'
            }`}>
              {step > num ? <Check className="w-4 h-4 stroke-[3]" /> : num}
            </div>
            {num < 4 && (
              <div className={`h-1 w-12 rounded-full transition-all ${
                step > num ? 'bg-emerald-500' : 'bg-slate-900'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      {/* Background soft lighting */}
      <div className="absolute w-80 h-80 bg-emerald-500/5 rounded-full filter blur-3xl -top-10 -left-10 -z-10"></div>
      <div className="absolute w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl -bottom-10 -right-10 -z-10"></div>

      <div className="w-full max-w-xl bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col">
        {/* Onboarding Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto mb-3">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
            Welcome to Gymeo!
          </h1>
          <p className="text-xs text-slate-400 mt-1">Let's set up your custom profile in a few quick steps.</p>
        </div>

        {renderStepIndicator()}

        {/* Multi-step Form Content */}
        <div className="flex-1 min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -15, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-slate-200 text-lg flex items-center gap-1.5">
                  <User className="w-5 h-5 text-emerald-400" /> Who are you?
                </h3>
                <p className="text-xs text-slate-500">Choose your name and nickname to represent you on leaderboards.</p>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Username</label>
                    <input
                      type="text"
                      placeholder="e.g. john_lift"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-500 font-bold uppercase">Bio / Motto</label>
                    <textarea
                      placeholder="e.g. Building consistency every single day!"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -15, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-slate-200 text-lg flex items-center gap-1.5">
                  <Scale className="w-5 h-5 text-emerald-400" /> Physical Metrics
                </h3>
                <p className="text-xs text-slate-500">Provide stats to track weight fluctuations and calibrate calories accurately.</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold uppercase">Age (Years)</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-500 font-bold uppercase">Current Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="20"
                        max="300"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                      <span>Height</span>
                      <span className="text-emerald-400">{height} cm</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="250"
                      value={height}
                      onChange={(e) => setHeight(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -15, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-slate-200 text-lg flex items-center gap-1.5">
                  <Target className="w-5 h-5 text-emerald-400" /> Primary Fitness Goal
                </h3>
                <p className="text-xs text-slate-500">Select your core target. We will tailor streak rewards and achievements.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {GOALS.map((goal) => {
                    const isSelected = fitnessGoal === goal.id;
                    return (
                      <div
                        key={goal.id}
                        onClick={() => setFitnessGoal(goal.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start h-28 relative overflow-hidden ${
                          isSelected
                            ? 'bg-slate-850 border-emerald-500 shadow-md shadow-emerald-500/5'
                            : 'bg-slate-950 border-slate-850 hover:border-slate-800'
                        }`}
                      >
                        <span className="text-2xl">{goal.emoji}</span>
                        <div className="flex-1">
                          <h4 className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {goal.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                            {goal.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ x: 15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -15, opacity: 0 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-slate-200 text-lg flex items-center gap-1.5">
                  <Compass className="w-5 h-5 text-emerald-400" /> Daily Goals Calibration
                </h3>
                <p className="text-xs text-slate-500">Define daily steps and water limits. Reaching them secures your daily streaks!</p>
                
                <div className="space-y-5">
                  {/* Steps target */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                      <span className="flex items-center gap-1"><Footprints className="w-3.5 h-3.5" /> Daily Steps Goal</span>
                      <span className="text-emerald-400 font-black">{stepsGoal.toLocaleString()} steps</span>
                    </div>
                    <input
                      type="range"
                      min="3000"
                      max="20000"
                      step="500"
                      value={stepsGoal}
                      onChange={(e) => setStepsGoal(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Water target */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase">
                      <span className="flex items-center gap-1"><Droplet className="w-3.5 h-3.5" /> Daily Water Intake</span>
                      <span className="text-blue-400 font-black">{(waterGoal / 1000).toFixed(1)} Liters ({waterGoal} ml)</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="5000"
                      step="250"
                      value={waterGoal}
                      onChange={(e) => setWaterGoal(parseInt(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Onboarding Navigation Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center gap-1 ${
              step === 1 
                ? 'opacity-30 cursor-not-allowed text-slate-650' 
                : 'bg-slate-900 text-slate-350 hover:bg-slate-850'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-5 py-2.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1"
            >
              Continue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              Finish Setup <Zap className="w-3.5 h-3.5 fill-slate-950" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
