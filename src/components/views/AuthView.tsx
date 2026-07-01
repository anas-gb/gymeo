'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Zap, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface AuthViewProps {
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onRegister: (email: string, pass: string, username: string, name: string) => Promise<boolean>;
}

export default function AuthView({ onLogin, onRegister }: AuthViewProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      let success = false;
      if (isRegistering) {
        if (!username || !displayName) {
          setErrorMsg('Username and Display Name are required.');
          setLoading(false);
          return;
        }
        success = await onRegister(email, password, username, displayName);
      } else {
        success = await onLogin(email, password);
      }
      
      if (!success) {
        setErrorMsg(isRegistering ? 'Registration failed. Email/Username may be taken.' : 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock login or redirect to Supabase OAuth
    setErrorMsg('Google OAuth login initiated. Running locally, auth simulated.');
    setTimeout(() => {
      onLogin('google_user@gmail.com', 'google_mock_pass');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      {/* Dynamic background light */}
      <div className="absolute w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl -top-20 -z-10"></div>
      <div className="absolute w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl -bottom-20 -z-10"></div>

      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl space-y-6">
        
        {/* Logo and Titles */}
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 mx-auto mb-4">
            G
          </div>
          <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            {isRegistering ? 'Create your Gymeo Account' : 'Welcome back to Gymeo'}
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            {isRegistering ? 'Sign up to start tracking streaks and earning XP!' : 'Sign in to review your routines and training logs.'}
          </p>
        </div>

        {/* Error notifications */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl text-center font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Display Name (Only during registration) */}
          {isRegistering && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-550 font-bold uppercase">Display Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          {/* Username (Only during registration) */}
          {isRegistering && (
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-550 font-bold uppercase">Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. john_lift"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Sparkles className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-550 font-bold uppercase">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-slate-550 font-bold uppercase">Password</label>
              {!isRegistering && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link simulated. Check your local mailbox.')}
                  className="text-[10px] text-slate-500 hover:text-emerald-400 font-bold"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Main Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-98 transition-all disabled:opacity-40"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {isRegistering ? 'Create Free Account' : 'Sign In'}
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 text-[10px] text-slate-650 uppercase font-bold">
          <div className="h-[1px] bg-slate-850 flex-1"></div>
          <span>Or sign in with</span>
          <div className="h-[1px] bg-slate-850 flex-1"></div>
        </div>

        {/* Social Logins */}
        <button
          onClick={handleGoogleLogin}
          className="w-full py-2.5 text-xs font-bold bg-slate-950 border border-slate-850 hover:bg-slate-900 hover:border-slate-800 rounded-xl flex items-center justify-center gap-2 text-slate-350 transition-all"
        >
          <Globe className="w-4 h-4 text-slate-400" /> Sign In with Google
        </button>

        {/* Toggle auth view */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Secure marker */}
        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/40" /> SSL Encrypted & Secure Auth Ready
        </div>

      </div>
    </div>
  );
}
