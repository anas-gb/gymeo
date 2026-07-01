'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Trophy, 
  Search, 
  UserPlus, 
  UserCheck, 
  UserMinus, 
  Check, 
  X, 
  Flame, 
  Zap, 
  Award,
  Sparkles
} from 'lucide-react';
import { db } from '../../services/db';
import { Friend } from '../../types';

export default function SocialView() {
  const { 
    friends, 
    searchUsers, 
    sendFriendRequest, 
    acceptFriendRequest, 
    removeFriend,
    profile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'leaderboard' | 'friends'>('leaderboard');
  const [leaderboardType, setLeaderboardType] = useState<'global' | 'friends'>('friends');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [searched, setSearched] = useState(false);

  // Get leaderboard rankings
  const leaderboard = db.getLeaderboard(leaderboardType);

  // Handle friend search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const res = searchUsers(searchQuery);
    setSearchResults(res);
    setSearched(true);
  };

  const handleAddClick = (id: string) => {
    sendFriendRequest(id);
    // Update local search results state to reflect "Sent" status
    setSearchResults(prev => 
      prev.map(f => f.id === id ? { ...f, isRequestSent: true } : f)
    );
  };

  // Divide friends into requests vs actual friends
  const activeFriends = friends.filter(f => !f.isRequestSent && !f.isRequestReceived);
  const pendingRequests = friends.filter(f => f.isRequestReceived);

  // Render ranking icon for top 3
  const renderRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-xl">🏆</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return <span className="text-slate-500 font-bold w-6 text-center">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-500" /> Social Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">Compete with friends, climb the ranks, and push each other further.</p>
        </div>

        {/* View Tabs */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-905 self-start">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Leaderboards
            </span>
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'friends'
                ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Friends ({activeFriends.length})
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'leaderboard' ? (
        // --- LEADERBOARD VIEW ---
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-3xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              XP Leaderboard
            </h3>
            {/* Filter Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900">
              <button
                onClick={() => setLeaderboardType('friends')}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all ${
                  leaderboardType === 'friends'
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Friends Only
              </button>
              <button
                onClick={() => setLeaderboardType('global')}
                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg transition-all ${
                  leaderboardType === 'global'
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                Global
              </button>
            </div>
          </div>

          {/* Leaderboard Rows */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-md">
            <div className="divide-y divide-slate-800/60">
              {leaderboard.map((user) => (
                <div 
                  key={user.id}
                  className={`flex items-center justify-between p-4 transition-colors ${
                    user.isCurrentUser 
                      ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-l-4 border-l-emerald-500' 
                      : 'hover:bg-slate-950/20'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div className="w-8 flex justify-center items-center">
                      {renderRankBadge(user.rank)}
                    </div>
                    {/* Avatar */}
                    <img 
                      className={`w-10 h-10 rounded-xl object-cover ${user.isCurrentUser ? 'ring-2 ring-emerald-500/20' : ''}`}
                      src={user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256"} 
                      alt={user.displayName}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-200">{user.displayName}</span>
                        {user.isCurrentUser && (
                          <span className="text-[9px] font-bold text-slate-950 bg-emerald-400 px-1.5 py-0.5 rounded uppercase">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">@{user.username}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    {/* Level / Streak Mini Indicators */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-0.5 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded-lg">
                        🔥 {user.currentStreak}
                      </span>
                      <span className="flex items-center gap-0.5 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded-lg font-semibold text-emerald-400">
                        Lvl {user.level}
                      </span>
                    </div>
                    {/* XP Score */}
                    <div className="text-right min-w-[70px]">
                      <span className="font-black text-sm text-slate-100">{user.xp.toLocaleString()}</span>
                      <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Total XP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // --- FRIENDS LIST VIEW ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Friends List & Pending Requests */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Pending Requests
                </h4>
                
                <div className="space-y-2">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 bg-slate-950/40 border border-slate-900 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img 
                          className="w-10 h-10 rounded-xl object-cover" 
                          src={req.avatarUrl} 
                          alt={req.displayName} 
                        />
                        <div>
                          <h5 className="font-bold text-sm text-slate-200">{req.displayName}</h5>
                          <p className="text-[10px] text-slate-500">@{req.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptFriendRequest(req.id)}
                          className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-slate-950"
                          title="Accept request"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                        <button
                          onClick={() => removeFriend(req.id)}
                          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-400"
                          title="Decline request"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Friends Directory list */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Your Friends</h3>
              
              {activeFriends.length === 0 ? (
                <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center text-slate-500">
                  <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="font-semibold text-slate-450">No friends added yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Search competitors on the right to start your network!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeFriends.map((f) => (
                    <div 
                      key={f.id}
                      className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-3xl flex flex-col justify-between gap-4 relative overflow-hidden"
                    >
                      {/* Online dot indicator */}
                      <span className={`absolute top-4 right-4 w-2 h-2 rounded-full ${f.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />

                      <div className="flex gap-3">
                        <img 
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800" 
                          src={f.avatarUrl} 
                          alt={f.displayName} 
                        />
                        <div>
                          <h4 className="font-bold text-slate-200 text-sm">{f.displayName}</h4>
                          <span className="text-[10px] text-slate-500 block">@{f.username}</span>
                          <p className="text-[11px] text-slate-400 mt-1.5 italic">"{f.bio}"</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-800/40 pt-3">
                        <div className="flex gap-3 text-[10px] text-slate-500">
                          <span className="flex items-center gap-0.5">
                            🔥 {f.currentStreak} Days
                          </span>
                          <span className="flex items-center gap-0.5 text-emerald-400">
                            Lvl {f.level}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${f.displayName} from your friends?`)) {
                              removeFriend(f.id);
                            }
                          }}
                          className="text-slate-600 hover:text-rose-400 text-xs font-semibold flex items-center gap-0.5"
                        >
                          <UserMinus className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Find Friends Search Card (Right Column) */}
          <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" /> Find Competitors
            </h3>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-250 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-350"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {searched && searchResults.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">
                  No users found matching "{searchQuery}"
                </div>
              ) : (
                searchResults.map((user) => {
                  const isFriendAlready = friends.find(f => f.id === user.id);
                  return (
                    <div 
                      key={user.id} 
                      className="p-3 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img 
                          className="w-8 h-8 rounded-lg object-cover" 
                          src={user.avatarUrl} 
                          alt={user.displayName} 
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-200">{user.displayName}</div>
                          <div className="text-[9px] text-slate-500">Lvl {user.level} • @{user.username}</div>
                        </div>
                      </div>

                      {user.isRequestSent || isFriendAlready?.isRequestSent ? (
                        <span className="text-[10px] text-slate-550 flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5" /> Sent
                        </span>
                      ) : isFriendAlready ? (
                        <span className="text-[10px] text-emerald-500 font-bold">
                          Friend
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddClick(user.id)}
                          className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-[10px] rounded-lg flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <UserPlus className="w-3 h-3" /> Add
                        </button>
                      )}
                    </div>
                  );
                })
              )}

              {!searched && (
                <div className="text-center py-4 text-xs text-slate-550">
                  Try searching for <strong>arnold</strong> or <strong>serena</strong>!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
