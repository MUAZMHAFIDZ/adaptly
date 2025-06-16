'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { LocalStorage } from '@/lib/localStorage';
import {
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Calendar,
  Sun,
  Moon
} from 'lucide-react';
import { MoodEntry } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function MoodTracker({ userId, isGuest }: { userId: string; isGuest: boolean }) {
  const [mood, setMood] = useState(5);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'evening'>('morning');

  useEffect(() => {
    loadMoodHistory();
    determineTimeOfDay();
  }, []);

  function determineTimeOfDay() {
    const hour = new Date().getHours();
    setTimeOfDay(hour < 12 ? 'morning' : 'evening');
  }

  async function loadMoodHistory() {
    if (isGuest) {
      setMoodHistory(LocalStorage.getMoodEntries(userId));
      return;
    }

    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(7);

    if (error) {
      console.error('Error loading mood history:', error);
      return;
    }

    setMoodHistory(data || []);
  }

  async function saveMood() {
    const entry: MoodEntry = {
      user_id: userId,
      value: mood,
      created_at: new Date().toISOString()
    };

    if (isGuest) {
      LocalStorage.saveMoodEntry(userId, entry);
      LocalStorage.addXP(userId, 50);
      setMoodHistory([entry, ...moodHistory]);
    } else {
      const { error } = await supabaseHelpers.saveMood(userId, entry);
      if (error) {
        console.error('Error saving mood:', error);
        return;
      }
      await supabaseHelpers.addXP(userId, 50);
      await loadMoodHistory();
    }
  }

  function getMoodIcon(value: number) {
    if (value <= 3) return <Frown className="h-6 w-6 text-destructive" />;
    if (value <= 7) return <Meh className="h-6 w-6 text-warning" />;
    return <Smile className="h-6 w-6 text-success" />;
  }

  const moodData = moodHistory.map(entry => ({
    date: new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
    value: entry.value
  })).reverse();

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {timeOfDay === 'morning' ? 'Morning' : 'Evening'} Mood Check
          </h3>
          {timeOfDay === 'morning' ? (
            <Sun className="h-6 w-6 text-yellow-500" />
          ) : (
            <Moon className="h-6 w-6 text-blue-500" />
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">How are you feeling?</span>
          {getMoodIcon(mood)}
        </div>

        <Slider
          value={[mood]}
          onValueChange={(value) => setMood(value[0])}
          max={10}
          step={1}
          className="w-full"
        />

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>😢 Not Great</span>
          <span>😊 Amazing</span>
        </div>

        <Button onClick={saveMood} className="w-full">
          Save Mood
        </Button>

        {moodHistory.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <h4 className="font-medium">Mood Trends</h4>
            </div>

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {moodHistory.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(entry.created_at).toLocaleString()}
                    </span>
                  </div>
                  {getMoodIcon(entry.value)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}