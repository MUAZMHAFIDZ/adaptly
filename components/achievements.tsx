import { Card } from '@/components/ui/card';
import { Achievement, ACHIEVEMENTS } from '@/lib/types';
import { Trophy, Lock } from 'lucide-react';
import { LocalStorage } from '@/lib/localStorage';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AchievementBadge } from './achievement-badge';

export function Achievements({ userId, isGuest }: { userId: string; isGuest: boolean }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const stats = LocalStorage.getUserStats(userId);

  useEffect(() => {
    checkAchievements();
  }, []);

  function checkAchievements() {
    const newUnlocked = ACHIEVEMENTS.filter(achievement => {
      switch (achievement.id) {
        case 'novice_knight':
          return stats.tasks_completed >= 5;
        case 'focus_master':
          return stats.focus_sessions_completed >= 10;
        case 'legendary_warrior':
          return stats.level >= 10;
        case 'clairvoyant':
          // Check mood tracking streak
          const moodEntries = LocalStorage.getMoodEntries(userId);
          let streak = 0;
          let lastDate = null;
          
          for (const entry of moodEntries) {
            const currentDate = new Date(entry.created_at).toDateString();
            if (lastDate) {
              const prevDate = new Date(lastDate);
              prevDate.setDate(prevDate.getDate() + 1);
              if (currentDate === prevDate.toDateString()) {
                streak++;
              } else {
                streak = 0;
              }
            }
            lastDate = currentDate;
          }
          return streak >= 7;
        case 'grand_master':
          // Check daily task completion streak
          const tasks = LocalStorage.getTasks(userId);
          let taskStreak = 0;
          let lastTaskDate = null;
          
          for (const task of tasks) {
            if (!task.completed) continue;
            const currentDate = new Date(task.created_at!).toDateString();
            if (lastTaskDate) {
              const prevDate = new Date(lastTaskDate);
              prevDate.setDate(prevDate.getDate() + 1);
              if (currentDate === prevDate.toDateString()) {
                taskStreak++;
              } else {
                taskStreak = 0;
              }
            }
            lastTaskDate = currentDate;
          }
          return taskStreak >= 5;
        default:
          return false;
      }
    });

    setUnlockedAchievements(newUnlocked);
  }

  return (
    <Card className="p-6 card-hover animate-slide-up">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Achievements</h3>
          <Trophy className="h-5 w-5 text-yellow-500 animate-wiggle" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ACHIEVEMENTS.map((achievement, index) => {
            const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
            
            return (
              <Dialog key={achievement.id}>
                <DialogTrigger asChild>
                  <div 
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <AchievementBadge
                      achievement={achievement}
                      isUnlocked={isUnlocked}
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="animate-scale-in">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {achievement.title}
                      {isUnlocked && <Trophy className="h-5 w-5 text-yellow-500" />}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center py-6">
                    <AchievementBadge
                      achievement={achievement}
                      isUnlocked={isUnlocked}
                    />
                  </div>
                  <p className="text-muted-foreground text-center">{achievement.description}</p>
                  {!isUnlocked && (
                    <p className="text-sm text-muted-foreground text-center">
                      Keep going! This achievement is still locked.
                    </p>
                  )}
                  {isUnlocked && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <Trophy className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          Achievement Unlocked!
                        </span>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            );
          })}
        </div>

        {unlockedAchievements.length > 0 && (
          <div className="text-center animate-slide-up-delay-1">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-full">
              <Trophy className="h-5 w-5 text-yellow-600 animate-bounce" />
              <span className="font-medium text-yellow-700 dark:text-yellow-300">
                {unlockedAchievements.length} of {ACHIEVEMENTS.length} achievements unlocked!
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}