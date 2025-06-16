/*
  # Add status column to tasks table

  1. Changes
    - Add status column to tasks table with default value 'pending'
    - Valid status values: 'pending', 'completed', 'skipped', 'postponed'
  
  2. Security
    - Maintains existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'tasks' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.tasks 
    ADD COLUMN status text DEFAULT 'pending' NOT NULL;
  END IF;
END $$;