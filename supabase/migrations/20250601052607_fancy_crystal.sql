/*
  # Initial Schema Setup

  1. Tables Created
    - tasks: Stores user tasks with completion status
    - user_stats: Tracks user progress and achievements
    - moods: Records user mood entries
    - focus_sessions: Logs completed focus sessions

  2. Security
    - RLS enabled on all tables
    - Policies set for authenticated users
    - Public read access where appropriate
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  title text NOT NULL,
  completed boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  xp integer DEFAULT 100 NOT NULL,
  CONSTRAINT tasks_pkey PRIMARY KEY (id)
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" 
  ON public.tasks FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
  ON public.tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users only" 
  ON public.tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for authenticated users only" 
  ON public.tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id uuid NOT NULL,
  xp integer DEFAULT 0 NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  tasks_completed integer DEFAULT 0 NOT NULL,
  focus_sessions_completed integer DEFAULT 0 NOT NULL,
  username text,
  CONSTRAINT user_stats_pkey PRIMARY KEY (user_id)
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" 
  ON public.user_stats FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
  ON public.user_stats FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for authenticated users only" 
  ON public.user_stats FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create moods table
CREATE TABLE IF NOT EXISTS public.moods (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  value integer NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT moods_pkey PRIMARY KEY (id)
);

ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" 
  ON public.moods FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
  ON public.moods FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS public.focus_sessions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  duration integer NOT NULL,
  completed_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT focus_sessions_pkey PRIMARY KEY (id)
);

ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" 
  ON public.focus_sessions FOR SELECT 
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" 
  ON public.focus_sessions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create increment function for XP
CREATE OR REPLACE FUNCTION increment(amount integer)
RETURNS integer
LANGUAGE SQL
AS $$
  SELECT COALESCE($1, 0) + amount;
$$;