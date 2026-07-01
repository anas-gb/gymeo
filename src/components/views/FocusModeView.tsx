'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Timer, 
  Award,
  Bell,
  CloudRain,
  Flame,
  Volume1
} from 'lucide-react';

type SoundType = 'none' | 'rain' | 'binaural' | 'bell';

export default function FocusModeView() {
  const {
    timerActive,
    timerDuration,
    timerTimeLeft,
    timerPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    cancelTimer,
    finishTimer
  } = useApp();

  const [selectedTime, setSelectedTime] = useState<number>(25);
  const [activeSound, setActiveSound] = useState<SoundType>('none');
  const [volume, setVolume] = useState<number>(0.3);

  // Web Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodeRef = useRef<any>(null); // holds source node or osc nodes
  const gainNodeRef = useRef<GainNode | null>(null);

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // SVG circle calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const totalSeconds = timerDuration * 60;
  const strokeDashoffset = timerActive
    ? circumference - (timerTimeLeft / totalSeconds) * circumference
    : 0;

  // Initialize Audio Context on user action
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = volume;
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }
  };

  // Adjust volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  const stopSound = () => {
    if (soundNodeRef.current) {
      try {
        if (Array.isArray(soundNodeRef.current)) {
          soundNodeRef.current.forEach(n => n.stop());
        } else {
          soundNodeRef.current.stop();
        }
      } catch (e) {}
      soundNodeRef.current = null;
    }
  };

  // Play ambient sounds using Web Audio API synthesis
  const startSound = (type: SoundType) => {
    stopSound();
    if (type === 'none') return;
    
    initAudio();
    const ctx = audioCtxRef.current!;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (type === 'rain') {
      // Synthesize Rain/Brownian noise
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brownian noise filter formula
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // boost volume slightly
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Create lowpass filter for deep rain feel
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 500; // hz

      noiseSource.connect(filter);
      filter.connect(gainNodeRef.current!);
      
      noiseSource.start(0);
      soundNodeRef.current = noiseSource;
    } 
    else if (type === 'binaural') {
      // Binaural Beats (200Hz left ear, 204Hz right ear)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      
      osc1.frequency.value = 160; // deep hum
      osc2.frequency.value = 164.5; // binaural focus wave
      
      // Pan Left/Right
      const panner1 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const panner2 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      
      if (panner1 && panner2) {
        panner1.pan.value = -1; // hard left
        panner2.pan.value = 1; // hard right
        
        osc1.connect(panner1);
        panner1.connect(gainNodeRef.current!);
        
        osc2.connect(panner2);
        panner2.connect(gainNodeRef.current!);
      } else {
        osc1.connect(gainNodeRef.current!);
        osc2.connect(gainNodeRef.current!);
      }
      
      osc1.start(0);
      osc2.start(0);
      
      soundNodeRef.current = [osc1, osc2];
    }
  };

  const handleSoundToggle = (type: SoundType) => {
    if (activeSound === type) {
      setActiveSound('none');
      stopSound();
    } else {
      setActiveSound(type);
      if (timerActive && !timerPaused) {
        startSound(type);
      } else {
        initAudio(); // preload
      }
    }
  };

  // Sync sound playing with timer state
  useEffect(() => {
    if (timerActive && !timerPaused) {
      if (activeSound !== 'none') {
        startSound(activeSound);
      }
    } else {
      stopSound();
    }
  }, [timerActive, timerPaused]);

  // Ring tone sound on finish/gong
  const triggerGong = () => {
    initAudio();
    const ctx = audioCtxRef.current!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 3.0);
    
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3.0);
    
    osc.start();
    osc.stop(ctx.currentTime + 3.0);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
          <Timer className="w-7 h-7 text-emerald-500" /> Focus Mode
        </h2>
        <p className="text-xs text-slate-400 mt-1">Immerse yourself in deep work, block out distractions, and collect XP.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Circular Timer Display (Left / Center) */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-md lg:col-span-2 flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden">
          {/* Animated background glow */}
          <div className="absolute w-72 h-72 bg-emerald-500/5 rounded-full filter blur-3xl -z-10 animate-pulse"></div>
          
          {/* SVG Progress Circle */}
          <div className="relative flex items-center justify-center w-72 h-72">
            <svg className="w-full h-full transform -rotate-90">
              {/* Back track */}
              <circle
                cx="144"
                cy="144"
                r={radius}
                className="stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              {/* Active track */}
              <motion.circle
                cx="144"
                cy="144"
                r={radius}
                className="stroke-emerald-500 fill-none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </svg>
            
            {/* Clock numbers inside ring */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
              <span className="text-5xl font-black font-mono text-slate-100 tracking-tight">
                {formatTime(timerTimeLeft)}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                {timerActive ? (timerPaused ? 'PAUSED' : 'FOCUSING') : 'READY'}
              </span>
            </div>
          </div>

          {/* Interactive controls */}
          <div className="mt-8 flex items-center justify-center gap-4 w-full max-w-sm">
            {!timerActive ? (
              // Start controls
              <button
                onClick={() => startTimer(selectedTime)}
                className="w-full py-4 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Start Focus Session
              </button>
            ) : (
              // Active controls
              <div className="flex items-center gap-3 w-full">
                {timerPaused ? (
                  <button
                    onClick={resumeTimer}
                    className="flex-1 py-3 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-2xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Play className="w-4 h-4 fill-slate-950" /> Resume
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="flex-1 py-3 text-sm font-bold bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-2xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Pause className="w-4 h-4 fill-slate-200" /> Pause
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm('Cancel this focus session? No XP will be awarded.')) {
                      cancelTimer();
                    }
                  }}
                  className="px-5 py-3 text-sm font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center gap-1.5 transition-all"
                  title="Cancel focus session"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Configurations Sidebar (Right) */}
        <div className="space-y-6">
          {/* Duration Config Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Timer className="w-5 h-5 text-emerald-400" /> Select Duration
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  disabled={timerActive}
                  onClick={() => {
                    setSelectedTime(mins);
                  }}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    timerActive 
                      ? 'opacity-40 cursor-not-allowed border-slate-850'
                      : selectedTime === mins
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <div className="text-lg font-black">{mins}</div>
                  <div className="text-[10px] uppercase font-bold tracking-wider">Minutes</div>
                </button>
              ))}
            </div>
            
            <div className="text-[11px] text-slate-500 text-center leading-relaxed">
              ⭐ Completing any session awards you <strong>+30 XP</strong> and counts towards daily streak goals.
            </div>
          </div>

          {/* Audio Synthesizer Controls */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-200 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-400" /> Focus Sounds
              </h3>
              {activeSound !== 'none' ? (
                <span className="text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold animate-pulse">
                  Synthesized Live
                </span>
              ) : null}
            </div>

            <div className="space-y-2">
              {/* Sound list */}
              <button
                type="button"
                onClick={() => handleSoundToggle('none')}
                className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  activeSound === 'none'
                    ? 'bg-slate-800 border-slate-700 text-slate-200'
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center">
                  <VolumeX className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <div className="text-xs font-bold">Silence</div>
                  <div className="text-[9px] text-slate-500">Pure focus without audio</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSoundToggle('rain')}
                className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  activeSound === 'rain'
                    ? 'bg-blue-500/10 border-blue-500/40 text-blue-400 font-bold'
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="w-7 h-7 rounded bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <CloudRain className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Soothing Rain</div>
                  <div className="text-[9px] text-slate-500">Filtered brownian rumble</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSoundToggle('binaural')}
                className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${
                  activeSound === 'binaural'
                    ? 'bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold'
                    : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="w-7 h-7 rounded bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Binaural Hum</div>
                  <div className="text-[9px] text-slate-500">Deep waves for brain syncing</div>
                </div>
              </button>
            </div>

            {/* Volume slider */}
            {activeSound !== 'none' && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-bold">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
