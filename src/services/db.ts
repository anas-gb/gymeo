import { 
  UserProfile, 
  Workout, 
  Habit, 
  FocusSession, 
  Achievement, 
  Friend, 
  FriendActivity, 
  LeaderboardUser,
  WeightEntry,
  WaterLog
} from '../types';

interface AppState {
  profile: UserProfile;
  workouts: Workout[];
  habits: Habit[];
  focusSessions: FocusSession[];
  achievements: Achievement[];
  friends: Friend[];
  activities: FriendActivity[];
  weightHistory: WeightEntry[];
  waterLogs: WaterLog[];
}

const INITIAL_PROFILE: UserProfile = {
  id: 'user-1',
  username: 'fit_champ',
  displayName: 'Alex Rivers',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256',
  bio: 'Consistency is key. Training for my first half marathon! 🏃‍♂️',
  age: 26,
  height: 180,
  weight: 76.5,
  fitnessGoal: 'stay_fit',
  xp: 2850,
  level: 8,
  currentStreak: 6,
  longestStreak: 14,
  joinDate: '2026-06-01',
  waterIntakeGoal: 2500, // 2.5L
  waterIntakeToday: 1500, // 1.5L
  walkGoalSteps: 10000,
  walkStepsToday: 6840
};

const INITIAL_WEIGHT_HISTORY: WeightEntry[] = [
  { date: '2026-06-01', weight: 79.2 },
  { date: '2026-06-08', weight: 78.5 },
  { date: '2026-06-15', weight: 78.1 },
  { date: '2026-06-22', weight: 77.4 },
  { date: '2026-06-29', weight: 76.8 },
  { date: '2026-07-02', weight: 76.5 }
];

const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w-1',
    userId: 'user-1',
    category: 'Running',
    title: 'Morning Trail Run',
    duration: 35,
    calories: 420,
    exercises: [
      {
        name: 'Running',
        sets: [{ reps: 1, distance: 5.2, completed: true }]
      }
    ],
    notes: 'Felt great today. Weather was perfect.',
    date: '2026-06-28'
  },
  {
    id: 'w-2',
    userId: 'user-1',
    category: 'Strength',
    title: 'Push Day Upper Body',
    duration: 50,
    calories: 380,
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { reps: 10, weight: 60, completed: true },
          { reps: 8, weight: 65, completed: true },
          { reps: 6, weight: 70, completed: true }
        ]
      },
      {
        name: 'Overhead Press',
        sets: [
          { reps: 10, weight: 40, completed: true },
          { reps: 8, weight: 45, completed: true }
        ]
      },
      {
        name: 'Incline Dumbbell Flyes',
        sets: [
          { reps: 12, weight: 14, completed: true },
          { reps: 12, weight: 14, completed: true }
        ]
      }
    ],
    notes: 'Increased bench press weight to 70kg!',
    date: '2026-06-29'
  },
  {
    id: 'w-3',
    userId: 'user-1',
    category: 'Home Workout',
    title: 'Core & Stretch Session',
    duration: 20,
    calories: 140,
    exercises: [
      {
        name: 'Plank',
        sets: [
          { reps: 1, distance: 0, completed: true },
          { reps: 1, distance: 0, completed: true }
        ]
      },
      {
        name: 'Crunches',
        sets: [{ reps: 20, completed: true }, { reps: 20, completed: true }]
      }
    ],
    notes: 'Quick stretch after work.',
    date: '2026-07-01'
  }
];

const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-1',
    userId: 'user-1',
    name: 'Drink Water (2.5L)',
    icon: 'Droplet',
    color: 'from-blue-400 to-blue-600',
    streak: 6,
    completedDates: ['2026-06-27', '2026-06-28', '2026-06-29', '2026-06-30', '2026-07-01', '2026-07-02'],
    createdAt: '2026-06-20'
  },
  {
    id: 'h-2',
    userId: 'user-1',
    name: '10k Steps Walk',
    icon: 'Footprints',
    color: 'from-emerald-400 to-emerald-600',
    streak: 2,
    completedDates: ['2026-06-28', '2026-06-30', '2026-07-01'],
    createdAt: '2026-06-20'
  },
  {
    id: 'h-3',
    userId: 'user-1',
    name: 'Read 15 Mins',
    icon: 'BookOpen',
    color: 'from-amber-400 to-amber-600',
    streak: 1,
    completedDates: ['2026-06-28', '2026-06-29', '2026-07-02'],
    createdAt: '2026-06-20'
  },
  {
    id: 'h-4',
    userId: 'user-1',
    name: 'Meditate 10 Mins',
    icon: 'Wind',
    color: 'from-purple-400 to-purple-600',
    streak: 0,
    completedDates: ['2026-06-29', '2026-07-01'],
    createdAt: '2026-06-20'
  }
];

const INITIAL_FOCUS_SESSIONS: FocusSession[] = [
  { id: 'fs-1', userId: 'user-1', duration: 25, date: '2026-06-28', xpEarned: 30 },
  { id: 'fs-2', userId: 'user-1', duration: 45, date: '2026-06-29', xpEarned: 30 },
  { id: 'fs-3', userId: 'user-1', duration: 25, date: '2026-07-01', xpEarned: 30 }
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-1', title: 'First Workout', description: 'Log your first workout in Gymeo', icon: 'Dumbbell', category: 'workout', xpReward: 100, unlockedAt: '2026-06-21', progress: 1, maxProgress: 1 },
  { id: 'ach-2', title: 'Consistency King', description: 'Maintain a 7-day daily streak', icon: 'Flame', category: 'streak', xpReward: 200, progress: 6, maxProgress: 7 },
  { id: 'ach-3', title: 'Deep Focus', description: 'Complete 10 Focus Sessions', icon: 'Timer', category: 'focus', xpReward: 150, progress: 3, maxProgress: 10 },
  { id: 'ach-4', title: 'Long Road', description: 'Walk a total of 100k Steps', icon: 'Compass', category: 'walk', xpReward: 250, progress: 48500, maxProgress: 100000 },
  { id: 'ach-5', title: 'Social Butterfly', description: 'Add 5 friends', icon: 'Users', category: 'friends', xpReward: 150, progress: 3, maxProgress: 5 },
  { id: 'ach-6', title: 'Profile Complete', description: 'Set up your bio, height, and weight', icon: 'UserCheck', category: 'profile', xpReward: 50, unlockedAt: '2026-06-21', progress: 1, maxProgress: 1 },
  { id: 'ach-7', title: 'Power User', description: 'Reach Level 10', icon: 'Zap', category: 'level', xpReward: 300, progress: 8, maxProgress: 10 }
];

const INITIAL_FRIENDS: Friend[] = [
  { id: 'f-1', username: 'sarah_spin', displayName: 'Sarah Connor', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256', bio: 'Spin instructor & smoothie enthusiast 🥤', level: 12, currentStreak: 8, status: 'online' },
  { id: 'f-2', username: 'john_lift', displayName: 'John Doe', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256', bio: 'Powerlifter. Heavy weights only.', level: 15, currentStreak: 3, status: 'offline' },
  { id: 'f-3', username: 'emma_run', displayName: 'Emma Watson', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256&h=256', bio: 'Running is a mental sport, and we are all athletes.', level: 9, currentStreak: 5, status: 'online' }
];

const INITIAL_ACTIVITIES: FriendActivity[] = [
  { id: 'act-1', userId: 'f-1', username: 'sarah_spin', displayName: 'Sarah Connor', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256', activityType: 'workout', activityDetail: 'completed a 45 min Cycling workout', timestamp: '2 hours ago', xpEarned: 50 },
  { id: 'act-2', userId: 'f-2', username: 'john_lift', displayName: 'John Doe', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256', activityType: 'achievement', activityDetail: 'unlocked the "Iron Giant" achievement (500 kg total lift)', timestamp: '5 hours ago', xpEarned: 250 },
  { id: 'act-3', userId: 'f-3', username: 'emma_run', displayName: 'Emma Watson', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256&h=256', activityType: 'streak', activityDetail: 'reached a 5-day daily streak!', timestamp: 'Yesterday', xpEarned: 100 }
];

const LOCAL_STORAGE_KEY = 'gymeo_app_state';

// XP required calculation (quadratic scale for Duolingo-like gaming leveling)
// Level 1: 0 - 100 XP
// Level 2: 100 - 250 XP (+150 XP)
// Level 3: 250 - 450 XP (+200 XP)
// Level 4: 450 - 700 XP (+250 XP)
// Level 5: 700 - 1000 XP (+300 XP)
// Level N: cumulative sum
export function getXPForLevel(lvl: number): number {
  if (lvl <= 1) return 100;
  return lvl * 100 + (lvl - 1) * 50;
}

export function getCumulativeXPForLevel(lvl: number): number {
  let total = 0;
  for (let i = 1; i < lvl; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

class GymeoDatabase {
  private state: AppState | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.load();
    }
  }

  private load() {
    try {
      const serialized = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (serialized) {
        this.state = JSON.parse(serialized);
        this.checkStreakIntegrity();
      } else {
        this.resetToDefaults();
      }
    } catch (e) {
      console.error('Failed to load Gymeo state from localstorage', e);
      this.resetToDefaults();
    }
  }

  private save() {
    if (typeof window !== 'undefined' && this.state) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
    }
  }

  private checkStreakIntegrity() {
    if (!this.state) return;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Check if the user has completed at least one activity yesterday or today
    const activitiesOnDate = (date: string) => {
      const hasWorkout = this.state!.workouts.some(w => w.date === date);
      const hasFocus = this.state!.focusSessions.some(fs => fs.date === date);
      const hasWater = this.state!.waterLogs.some(wl => wl.date === date && wl.amount >= this.state!.profile.waterIntakeGoal);
      const hasHabit = this.state!.habits.some(h => h.completedDates.includes(date));
      return hasWorkout || hasFocus || hasWater || hasHabit;
    };

    const doneToday = activitiesOnDate(today);
    const doneYesterday = activitiesOnDate(yesterday);

    if (!doneToday && !doneYesterday && this.state.profile.currentStreak > 0) {
      // Streak broken! Reset streak, but keep longest streak
      if (this.state.profile.currentStreak > this.state.profile.longestStreak) {
        this.state.profile.longestStreak = this.state.profile.currentStreak;
      }
      this.state.profile.currentStreak = 0;
      this.save();
    }
  }

  public resetToDefaults() {
    this.state = {
      profile: { ...INITIAL_PROFILE },
      workouts: [...INITIAL_WORKOUTS],
      habits: [...INITIAL_HABITS],
      focusSessions: [...INITIAL_FOCUS_SESSIONS],
      achievements: [...INITIAL_ACHIEVEMENTS],
      friends: [...INITIAL_FRIENDS],
      activities: [...INITIAL_ACTIVITIES],
      weightHistory: [...INITIAL_WEIGHT_HISTORY],
      waterLogs: [
        { date: new Date().toISOString().split('T')[0], amount: 1500 },
        { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], amount: 2600 }
      ]
    };
    this.save();
  }

  public getProfile(): UserProfile {
    this.load();
    return this.state!.profile;
  }

  public updateProfile(updates: Partial<UserProfile>): UserProfile {
    this.load();
    this.state!.profile = { ...this.state!.profile, ...updates };
    
    // Check profile completion achievement
    if (this.state!.profile.bio && this.state!.profile.height && this.state!.profile.weight) {
      this.updateAchievementProgress('profile', 1);
    }
    
    this.save();
    return this.state!.profile;
  }

  public getWorkouts(): Workout[] {
    this.load();
    return this.state!.workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public addWorkout(workout: Omit<Workout, 'id' | 'userId'>): Workout {
    this.load();
    const newWorkout: Workout = {
      ...workout,
      id: `w-${Date.now()}`,
      userId: this.state!.profile.id
    };
    this.state!.workouts.push(newWorkout);
    
    // Add XP
    this.addXP(50);
    
    // Increment streak check
    this.checkAndIncrementStreak(workout.date);
    
    // Update achievements
    this.updateAchievementProgress('workout', this.state!.workouts.length);
    
    // Add activity
    this.addFriendActivity({
      activityType: 'workout',
      activityDetail: `completed a ${workout.duration} min ${workout.category} workout ("${workout.title}")`,
      xpEarned: 50
    });
    
    this.save();
    return newWorkout;
  }

  public getHabits(): Habit[] {
    this.load();
    return this.state!.habits;
  }

  public createHabit(name: string, icon: string, color: string): Habit {
    this.load();
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      userId: this.state!.profile.id,
      name,
      icon,
      color,
      streak: 0,
      completedDates: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    this.state!.habits.push(newHabit);
    this.save();
    return newHabit;
  }

  public deleteHabit(id: string): void {
    this.load();
    this.state!.habits = this.state!.habits.filter(h => h.id !== id);
    this.save();
  }

  public toggleHabit(id: string, date: string): { habit: Habit; completed: boolean } {
    this.load();
    const habit = this.state!.habits.find(h => h.id === id);
    if (!habit) throw new Error('Habit not found');

    const index = habit.completedDates.indexOf(date);
    let completed = false;

    if (index >= 0) {
      habit.completedDates.splice(index, 1);
      habit.streak = Math.max(0, habit.streak - 1);
    } else {
      habit.completedDates.push(date);
      habit.streak += 1;
      completed = true;
      
      // Award XP
      this.addXP(20);
      
      // Update streak
      this.checkAndIncrementStreak(date);
      
      // Check walk achievement if name matches steps
      if (habit.name.toLowerCase().includes('steps') || habit.name.toLowerCase().includes('walk')) {
        this.updateAchievementProgress('walk', 10000); // 10k step equivalency
      }
    }

    this.save();
    return { habit, completed };
  }

  public addFocusSession(duration: number): FocusSession {
    this.load();
    const today = new Date().toISOString().split('T')[0];
    const session: FocusSession = {
      id: `fs-${Date.now()}`,
      userId: this.state!.profile.id,
      duration,
      date: today,
      xpEarned: 30
    };
    
    this.state!.focusSessions.push(session);
    
    // Add XP
    this.addXP(30);
    
    // Update streak
    this.checkAndIncrementStreak(today);
    
    // Achievements update
    this.updateAchievementProgress('focus', this.state!.focusSessions.length);
    
    // Add activity
    this.addFriendActivity({
      activityType: 'focus',
      activityDetail: `completed a ${duration}-minute Deep Focus Session 🧘‍♂️`,
      xpEarned: 30
    });

    this.save();
    return session;
  }

  public getFocusSessions(): FocusSession[] {
    this.load();
    return this.state!.focusSessions;
  }

  public getAchievements(): Achievement[] {
    this.load();
    return this.state!.achievements;
  }

  public getFriends(): Friend[] {
    this.load();
    return this.state!.friends;
  }

  public getActivities(): FriendActivity[] {
    this.load();
    return this.state!.activities.sort((a, b) => b.id.localeCompare(a.id));
  }

  public getLeaderboard(type: 'global' | 'friends'): LeaderboardUser[] {
    this.load();
    
    const currentUser: LeaderboardUser = {
      rank: 1, // Will be computed
      id: this.state!.profile.id,
      username: this.state!.profile.username,
      displayName: this.state!.profile.displayName,
      avatarUrl: this.state!.profile.avatarUrl,
      xp: this.state!.profile.xp,
      level: this.state!.profile.level,
      currentStreak: this.state!.profile.currentStreak,
      isCurrentUser: true
    };

    let users: Omit<LeaderboardUser, 'rank'>[] = [currentUser];

    // Mock other users on leaderboard
    const mockCompetitors: Omit<LeaderboardUser, 'rank'>[] = [
      { id: 'f-1', username: 'sarah_spin', displayName: 'Sarah Connor', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256', xp: 3950, level: 12, currentStreak: 8 },
      { id: 'f-2', username: 'john_lift', displayName: 'John Doe', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256', xp: 5200, level: 15, currentStreak: 3 },
      { id: 'f-3', username: 'emma_run', displayName: 'Emma Watson', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256&h=256', xp: 2600, level: 9, currentStreak: 5 },
    ];

    if (type === 'global') {
      const extraGlobalCompetitors: Omit<LeaderboardUser, 'rank'>[] = [
        { id: 'g-1', username: 'goku_ultra', displayName: 'Son Goku', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256', xp: 12400, level: 32, currentStreak: 45 },
        { id: 'g-2', username: 'vegeta_pride', displayName: 'Prince Vegeta', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=256&h=256', xp: 11800, level: 30, currentStreak: 30 },
        { id: 'g-3', username: 'rocky_balboa', displayName: 'Rocky Balboa', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256', xp: 4500, level: 13, currentStreak: 12 },
        { id: 'g-4', username: 'chloe_fit', displayName: 'Chloe Ting', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256', xp: 3200, level: 10, currentStreak: 7 }
      ];
      users = [...users, ...mockCompetitors, ...extraGlobalCompetitors];
    } else {
      // Friends only
      users = [...users, ...mockCompetitors];
    }

    // Sort by XP descending and set rank
    users.sort((a, b) => b.xp - a.xp);
    return users.map((user, idx) => ({ ...user, rank: idx + 1 })) as LeaderboardUser[];
  }

  public getWeightHistory(): WeightEntry[] {
    this.load();
    return this.state!.weightHistory;
  }

  public addWeightEntry(weight: number): WeightEntry {
    this.load();
    const today = new Date().toISOString().split('T')[0];
    const index = this.state!.weightHistory.findIndex(w => w.date === today);
    const entry = { date: today, weight };
    
    if (index >= 0) {
      this.state!.weightHistory[index] = entry;
    } else {
      this.state!.weightHistory.push(entry);
    }
    
    this.state!.profile.weight = weight;
    this.save();
    return entry;
  }

  public logWater(amount: number): number {
    this.load();
    const today = new Date().toISOString().split('T')[0];
    const index = this.state!.waterLogs.findIndex(w => w.date === today);
    let currentAmount = 0;
    
    if (index >= 0) {
      this.state!.waterLogs[index].amount += amount;
      currentAmount = this.state!.waterLogs[index].amount;
    } else {
      this.state!.waterLogs.push({ date: today, amount });
      currentAmount = amount;
    }

    this.state!.profile.waterIntakeToday = currentAmount;
    
    // Check if daily water goal reached
    if (currentAmount >= this.state!.profile.waterIntakeGoal) {
      this.checkAndIncrementStreak(today);
      this.addXP(20); // Award goal completion XP
    }

    this.save();
    return currentAmount;
  }

  public addSteps(steps: number): number {
    this.load();
    const today = new Date().toISOString().split('T')[0];
    this.state!.profile.walkStepsToday += steps;
    
    const stepsToday = this.state!.profile.walkStepsToday;
    this.updateAchievementProgress('walk', steps);

    // Goal reached
    if (stepsToday >= this.state!.profile.walkGoalSteps && (stepsToday - steps) < this.state!.profile.walkGoalSteps) {
      this.checkAndIncrementStreak(today);
      this.addXP(20);
    }

    this.save();
    return stepsToday;
  }

  // Add friend
  public searchUsers(query: string): Friend[] {
    // Return mock users that could be added
    const pool: Friend[] = [
      { id: 's-1', username: 'mike_tyson', displayName: 'Mike Tyson', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256', bio: 'Iron Mike. Push your limits.', level: 25, currentStreak: 12, status: 'offline' },
      { id: 's-2', username: 'arnold_flex', displayName: 'Arnold S.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256', bio: 'Get to the chopper! (And the gym)', level: 40, currentStreak: 30, status: 'online' },
      { id: 's-3', username: 'serena_tennis', displayName: 'Serena Williams', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256', bio: 'Champion mindset.', level: 18, currentStreak: 9, status: 'online' }
    ];

    if (!query) return [];
    return pool.filter(f => 
      f.username.toLowerCase().includes(query.toLowerCase()) || 
      f.displayName.toLowerCase().includes(query.toLowerCase())
    );
  }

  public sendFriendRequest(id: string): void {
    this.load();
    // Add mock pending friendship
    const updatedFriends = this.state!.friends;
    const isAlreadyFriend = updatedFriends.some(f => f.id === id);
    if (!isAlreadyFriend) {
      // Find in search pool
      const mockResult = this.searchUsers('').find(u => u.id === id) || {
        id, username: 'new_friend', displayName: 'New Friend', avatarUrl: '', bio: 'Fitness lover', level: 1, currentStreak: 0, status: 'offline' as const
      };
      
      this.state!.friends.push({
        ...mockResult,
        isRequestSent: true
      });
      this.save();
    }
  }

  public acceptFriendRequest(id: string): void {
    this.load();
    const friend = this.state!.friends.find(f => f.id === id);
    if (friend) {
      friend.isRequestReceived = false;
      friend.isRequestSent = false;
      
      // Update achievements
      this.updateAchievementProgress('friends', this.state!.friends.filter(f => !f.isRequestSent && !f.isRequestReceived).length);
      
      this.save();
    }
  }

  public removeFriend(id: string): void {
    this.load();
    this.state!.friends = this.state!.friends.filter(f => f.id !== id);
    this.save();
  }

  // --- PRIVATE UTILITIES ---

  private addXP(amount: number) {
    const profile = this.state!.profile;
    profile.xp += amount;
    
    // Level up calculation
    let currentLevel = profile.level;
    let xpNeeded = getXPForLevel(currentLevel);
    let cumulative = getCumulativeXPForLevel(currentLevel);
    let xpInCurrentLevel = profile.xp - cumulative;

    while (xpInCurrentLevel >= xpNeeded) {
      currentLevel += 1;
      xpNeeded = getXPForLevel(currentLevel);
      cumulative = getCumulativeXPForLevel(currentLevel);
      xpInCurrentLevel = profile.xp - cumulative;
    }

    if (currentLevel !== profile.level) {
      profile.level = currentLevel;
      // Achievement level check
      this.updateAchievementProgress('level', currentLevel);
      
      // Add level up activity
      this.addFriendActivity({
        activityType: 'achievement',
        activityDetail: `leveled up to Level ${currentLevel}! 🎉`,
        xpEarned: 100
      });
    }
  }

  private checkAndIncrementStreak(date: string) {
    const profile = this.state!.profile;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Check if streak was already updated today
    const activitiesOnDate = (d: string) => {
      const hasWorkout = this.state!.workouts.some(w => w.date === d && w.id !== `w-${Date.now()}`); // exclude currently added workout in this event loop if needed
      const hasFocus = this.state!.focusSessions.some(fs => fs.date === d);
      const hasWater = this.state!.waterLogs.some(wl => wl.date === d && wl.amount >= this.state!.profile.waterIntakeGoal);
      const hasHabit = this.state!.habits.some(h => h.completedDates.includes(d));
      return hasWorkout || hasFocus || hasWater || hasHabit;
    };

    // If they already did something today, the streak was already updated.
    const alreadyCompletedGoalToday = activitiesOnDate(today);
    if (alreadyCompletedGoalToday) return; // Already secured today's streak!

    // If yesterday was completed, increment streak.
    const completedYesterday = activitiesOnDate(yesterday);
    
    if (completedYesterday || profile.currentStreak === 0) {
      profile.currentStreak += 1;
      if (profile.currentStreak > profile.longestStreak) {
        profile.longestStreak = profile.currentStreak;
      }
      
      // Reward XP for Daily Goal completion (+20 XP)
      this.addXP(20);
      
      // 7-day streak bonus (+100 XP)
      if (profile.currentStreak % 7 === 0) {
        this.addXP(100);
        this.addFriendActivity({
          activityType: 'streak',
          activityDetail: `reached a massive ${profile.currentStreak}-day daily streak! 🔥`,
          xpEarned: 100
        });
      }

      this.updateAchievementProgress('streak', profile.currentStreak);
    }
  }

  private updateAchievementProgress(category: Achievement['category'], value: number) {
    let unlockedAny = false;
    this.state!.achievements.forEach(ach => {
      if (ach.category === category && !ach.unlockedAt) {
        if (category === 'walk') {
          ach.progress += value;
        } else {
          ach.progress = value;
        }

        if (ach.progress >= ach.maxProgress) {
          ach.progress = ach.maxProgress;
          ach.unlockedAt = new Date().toISOString().split('T')[0];
          unlockedAny = true;
          this.addXP(ach.xpReward);
          
          this.addFriendActivity({
            activityType: 'achievement',
            activityDetail: `unlocked the achievement "${ach.title}" (+${ach.xpReward} XP)`,
            xpEarned: ach.xpReward
          });
        }
      }
    });
    
    if (unlockedAny) {
      this.save();
    }
  }

  private addFriendActivity(item: Omit<FriendActivity, 'id' | 'userId' | 'username' | 'displayName' | 'avatarUrl' | 'timestamp'>) {
    const profile = this.state!.profile;
    const newActivity: FriendActivity = {
      ...item,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      timestamp: 'Just now'
    };
    this.state!.activities.unshift(newActivity);
    
    // Cap activity feed at 30 items
    if (this.state!.activities.length > 30) {
      this.state!.activities.pop();
    }
  }
}

// Singleton database instance
export const db = new GymeoDatabase();
export default db;
