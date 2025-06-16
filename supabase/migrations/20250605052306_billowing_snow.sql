/*
  # Add updated_at column to user_stats table

  1. Changes
    - Add updated_at column to user_stats table with default value now()
  
  2. Security
    - Maintains existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_stats' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.user_stats 
    ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;
END $$;