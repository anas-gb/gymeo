-- GYMEO SUPABASE POSTGRESQL SCHEMA
-- Paste this script into the SQL Editor of your Supabase project dashboard to set up all tables and security policies.

-- 1. Enable UUID generation extension if not present
create extension if not exists "uuid-ossp";

-- 2. Create User Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  bio text,
  age integer check (age > 0),
  height numeric check (height > 0), -- in cm
  weight numeric check (weight > 0), -- in kg
  fitness_goal text default 'stay_fit' check (fitness_goal in ('lose_weight', 'gain_muscle', 'stay_fit', 'build_endurance')),
  xp integer default 0 not null,
  level integer default 1 not null,
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  water_intake_goal integer default 2000 not null, -- ml
  water_intake_today integer default 0 not null,
  walk_goal_steps integer default 10000 not null,
  walk_steps_today integer default 0 not null,
  join_date date default current_date not null
);

-- 3. Create Workouts table
create table public.workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category text not null check (category in ('Strength', 'Cardio', 'Running', 'Cycling', 'Home Workout', 'Custom')),
  title text not null,
  duration integer not null check (duration > 0), -- minutes
  calories integer not null check (calories >= 0),
  exercises jsonb default '[]'::jsonb not null, -- array of sets/reps details
  notes text,
  date date default current_date not null
);

-- 4. Create Habits table
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text default 'Droplet' not null,
  color text default 'from-blue-400 to-blue-600' not null,
  streak integer default 0 not null,
  completed_dates text[] default '{}'::text[] not null, -- array of YYYY-MM-DD strings
  created_at date default current_date not null
);

-- 5. Create Focus Sessions table
create table public.focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  duration integer not null check (duration > 0), -- minutes
  xp_earned integer default 30 not null,
  date date default current_date not null
);

-- 6. Create Weight History table
create table public.weight_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  weight numeric not null check (weight > 0), -- kg
  date date default current_date not null
);

-- 7. Create Water Logs table
create table public.water_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  amount integer not null check (amount > 0), -- ml
  date date default current_date not null
);

-- 8. Create Friends / Followers table (Bidirectional request tracking)
create table public.friendships (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references auth.users on delete cascade not null,
  receiver_id uuid references auth.users on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(sender_id, receiver_id)
);

-- 9. Create Global Activity Feed
create table public.friend_activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  activity_type text not null check (activity_type in ('workout', 'focus', 'habit', 'achievement', 'streak')),
  activity_detail text not null,
  xp_earned integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ========================================================
-- ENABLE ROW LEVEL SECURITY (RLS) - For absolute security
-- ========================================================

alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.habits enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.weight_history enable row level security;
alter table public.water_logs enable row level security;
alter table public.friendships enable row level security;
alter table public.friend_activities enable row level security;

-- ========================================================
-- DEFINE SECURITY POLICIES (Users can only modify their own data)
-- ========================================================

-- Profile Policies
create policy "Allow public read access to profiles" on public.profiles 
  for select using (true);

create policy "Allow users to update their own profile" on public.profiles 
  for update using (auth.uid() = id);

create policy "Allow users to insert their own profile" on public.profiles 
  for insert with check (auth.uid() = id);

-- Workouts Policies
create policy "Users can view their own workouts" on public.workouts 
  for select using (auth.uid() = user_id);

create policy "Users can insert their own workouts" on public.workouts 
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own workouts" on public.workouts 
  for delete using (auth.uid() = user_id);

-- Habits Policies
create policy "Users can view their own habits" on public.habits 
  for select using (auth.uid() = user_id);

create policy "Users can insert their own habits" on public.habits 
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own habits" on public.habits 
  for update using (auth.uid() = user_id);

create policy "Users can delete their own habits" on public.habits 
  for delete using (auth.uid() = user_id);

-- Focus Sessions Policies
create policy "Users can view their own focus sessions" on public.focus_sessions 
  for select using (auth.uid() = user_id);

create policy "Users can insert their own focus sessions" on public.focus_sessions 
  for insert with check (auth.uid() = user_id);

-- Weight History Policies
create policy "Users can view their own weight logs" on public.weight_history 
  for select using (auth.uid() = user_id);

create policy "Users can insert their own weight logs" on public.weight_history 
  for insert with check (auth.uid() = user_id);

-- Friendships Policies
create policy "Users can view friendships they are part of" on public.friendships 
  for select using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can initiate friendships" on public.friendships 
  for insert with check (auth.uid() = sender_id);

create policy "Users can update friendships they receive" on public.friendships 
  for update using (auth.uid() = receiver_id);

create policy "Users can delete friendships they are part of" on public.friendships 
  for delete using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- Friend Activities Policies (Readable by anyone authenticated, insertable by the user)
create policy "Authenticated users can read activities" on public.friend_activities 
  for select using (auth.role() = 'authenticated');

create policy "Users can insert their own activities" on public.friend_activities 
  for insert with check (auth.uid() = user_id);

-- ========================================================
-- AUTOMATE USER PROFILE CREATION UPON SIGN UP
-- ========================================================
-- Create a trigger that automatically adds a profile entry when a user registers on Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url, fitness_goal, xp, level)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', 'Gym Warrior'),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256'),
    'stay_fit',
    0,
    1
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
