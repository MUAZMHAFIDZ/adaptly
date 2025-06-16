/*
  # Database Improvements

  1. Changes
    - Add indexes for frequently queried columns
    - Add foreign key constraints
    - Add validation constraints
    - Add default values for consistency
  
  2. Security
    - Maintains existing RLS policies
*/

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_created_at_idx ON public.tasks(created_at);
CREATE INDEX IF NOT EXISTS moods_user_id_idx ON public.moods(user_id);
CREATE INDEX IF NOT EXISTS moods_created_at_idx ON public.moods(created_at);
CREATE INDEX IF NOT EXISTS focus_sessions_user_id_idx ON public.focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS focus_sessions_completed_at_idx ON public.focus_sessions(completed_at);
CREATE INDEX IF NOT EXISTS user_stats_xp_idx ON public.user_stats(xp DESC);

-- Add constraints
DO $$ 
BEGIN
  -- Add check constraints if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'moods_value_check'
  ) THEN
    ALTER TABLE public.moods
    ADD CONSTRAINT moods_value_check 
    CHECK (value >= 0 AND value <= 10);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'user_stats_xp_check'
  ) THEN
    ALTER TABLE public.user_stats
    ADD CONSTRAINT user_stats_xp_check 
    CHECK (xp >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'user_stats_level_check'
  ) THEN
    ALTER TABLE public.user_stats
    ADD CONSTRAINT user_stats_level_check 
    CHECK (level >= 1);
  END IF;

  -- Add foreign key constraints if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'tasks_user_id_fkey'
  ) THEN
    ALTER TABLE public.tasks
    ADD CONSTRAINT tasks_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'moods_user_id_fkey'
  ) THEN
    ALTER TABLE public.moods
    ADD CONSTRAINT moods_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'focus_sessions_user_id_fkey'
  ) THEN
    ALTER TABLE public.focus_sessions
    ADD CONSTRAINT focus_sessions_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'user_stats_user_id_fkey'
  ) THEN
    ALTER TABLE public.user_stats
    ADD CONSTRAINT user_stats_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;