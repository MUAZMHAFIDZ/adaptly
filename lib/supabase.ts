import { createClient } from '@supabase/supabase-js';
import { MoodEntry, Task } from '@/lib/types';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const supabaseHelpers = {
  async saveTask(userId: string, task: Task) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: userId }])
      .select()
      .single();

    return { data, error };
  },

  async saveMood(userId: string, entry: MoodEntry) {
    const { error } = await supabase
      .from('moods')
      .insert([{ ...entry, user_id: userId }]);

    return { error };
  },

  async saveFocusSession(userId: string, session: { duration: number; completed_at: string }) {
    const { error } = await supabase
      .from('focus_sessions')
      .insert([{ ...session, user_id: userId }]);

    return { error };
  },

  async addXP(userId: string, amount: number) {
    // First get current stats
    const { data: currentStats, error: fetchError } = await supabase
      .from('user_stats')
      .select('xp')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows found
      return { error: fetchError };
    }

    const currentXP = currentStats?.xp || 0;
    const newXP = currentXP + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;

    // If stats exist, update them
    if (currentStats) {
      const { error } = await supabase
        .from('user_stats')
        .update({ 
          xp: newXP,
          level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      return { error };
    }

    // If no stats exist, create new entry
    const { error } = await supabase
      .from('user_stats')
      .insert([{ 
        user_id: userId,
        xp: amount,
        level: Math.floor(amount / 1000) + 1,
        tasks_completed: 0,
        focus_sessions_completed: 0
      }]);

    return { error };
  },

  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  }
};

export default supabase;