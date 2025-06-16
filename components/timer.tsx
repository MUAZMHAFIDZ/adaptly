'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase, supabaseHelpers } from '@/lib/supabase';
import { LocalStorage } from '@/lib/localStorage';
import { Play, Pause, RotateCcw, BellRing, BellOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

export function Timer({ userId, isGuest }: { userId: string; isGuest: boolean }) {
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [dndEnabled, setDndEnabled] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    requestNotificationPermission();
    return () => {
      if (notification) notification.close();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  async function requestNotificationPermission() {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  }

  function sendNotification(title: string, body: string) {
    if (dndEnabled) return;
    
    if ('Notification' in window && Notification.permission === 'granted') {
      if (notification) notification.close();
      const newNotification = new Notification(title, {
        body,
        icon: '/icon-192x192.png'
      });
      setNotification(newNotification);
    }
  }

  async function handleTimerComplete() {
    setIsRunning(false);

    if (!isBreak) {
      // Record completed focus session
      if (isGuest) {
        LocalStorage.saveFocusSession(userId, {
          user_id: userId,
          duration: FOCUS_TIME,
          completed_at: new Date().toISOString()
        });
        LocalStorage.addXP(userId, 200);
      } else {
        await supabaseHelpers.saveFocusSession(userId, {
          duration: FOCUS_TIME,
          completed_at: new Date().toISOString()
        });
        await supabaseHelpers.addXP(userId, 200);
      }

      sendNotification(
        'Focus Session Complete!',
        'Great work! Take a short break.'
      );

      // Switch to break time
      setIsBreak(true);
      setTimeLeft(BREAK_TIME);
    } else {
      sendNotification(
        'Break Time Over',
        'Ready to focus again?'
      );

      // Switch back to focus time
      setIsBreak(false);
      setTimeLeft(FOCUS_TIME);
    }
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const progress = Math.round(
    ((isBreak ? BREAK_TIME : FOCUS_TIME) - timeLeft) /
      (isBreak ? BREAK_TIME : FOCUS_TIME) *
      100
  );

  return (
    <Card className="p-6 card-hover animate-slide-up">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {isBreak ? 'Break Time' : 'Focus Time'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Do Not Disturb</span>
            <Switch
              checked={dndEnabled}
              onCheckedChange={setDndEnabled}
              size="sm"
              className="transition-smooth"
            />
          </div>
        </div>

        <div className="text-center">
          <p className="text-4xl font-bold tracking-tighter animate-pulse">
            {formatTime(timeLeft)}
          </p>
          <p className="text-sm text-muted-foreground mt-1 animate-fade-in">
            {isBreak ? 'Time to recharge!' : 'Stay focused!'}
          </p>
        </div>

        <Progress value={progress} className="h-3 animate-glow" />

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setTimeLeft(isBreak ? BREAK_TIME : FOCUS_TIME);
              setIsRunning(false);
            }}
            className="hover-bounce btn-ripple"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => setIsRunning(!isRunning)}
            className={`hover-lift btn-ripple ${isRunning ? 'animate-heartbeat' : ''}`}
          >
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDndEnabled(!dndEnabled)}
            className="hover-bounce btn-ripple"
          >
            {dndEnabled ? (
              <BellOff className="h-4 w-4" />
            ) : (
              <BellRing className="h-4 w-4" />
            )}
          </Button>
        </div>

        {isRunning && (
          <p className="text-center text-sm text-muted-foreground animate-fade-in">
            {isBreak ? 'Break ends in' : 'Focus session ends in'} {formatTime(timeLeft)}
          </p>
        )}
      </div>
    </Card>
  );
}