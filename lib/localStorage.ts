import { FocusSession, Task, MoodEntry, UserStats, Achievement } from "./types";

export const LocalStorage = {
  getFocusSessions: (userId: string): FocusSession[] => {
    return JSON.parse(localStorage.getItem(`focusSessions_${userId}`) || "[]");
  },

  saveFocusSession: (userId: string, session: FocusSession) => {
    const sessions = LocalStorage.getFocusSessions(userId);
    sessions.push(session);
    localStorage.setItem(`focusSessions_${userId}`, JSON.stringify(sessions));
  },

  getTasks: (userId: string): Task[] => {
    return JSON.parse(localStorage.getItem(`tasks_${userId}`) || "[]");
  },

  saveTasks: (userId: string, tasks: Task[]) => {
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
  },

  getMoodEntries: (userId: string): MoodEntry[] => {
    return JSON.parse(localStorage.getItem(`moodEntries_${userId}`) || "[]");
  },

  saveMoodEntry: (userId: string, entry: MoodEntry) => {
    const entries = LocalStorage.getMoodEntries(userId);
    entries.push(entry);
    localStorage.setItem(`moodEntries_${userId}`, JSON.stringify(entries));
  },

  getUserStats: (userId: string): UserStats => {
    return JSON.parse(
      localStorage.getItem(`userStats_${userId}`) ||
        JSON.stringify({
          user_id: userId,
          xp: 0,
          level: 1,
          tasks_completed: 0,
          focus_sessions_completed: 0,
          achievements: [],
        })
    );
  },

  updateUserStats: (userId: string, stats: UserStats) => {
    localStorage.setItem(`userStats_${userId}`, JSON.stringify(stats));
  },

  addXP: (userId: string, amount: number) => {
    const stats = LocalStorage.getUserStats(userId);
    stats.xp += amount;
    stats.level = Math.floor(stats.xp / 1000) + 1;
    LocalStorage.updateUserStats(userId, stats);
    return stats;
  },

  unlockAchievement: (userId: string, achievementId: string) => {
    const stats = LocalStorage.getUserStats(userId);
    if (!stats.achievements) stats.achievements = [];

    if (!stats.achievements.find((a) => a.id === achievementId)) {
      stats.achievements.push({
        id: achievementId,
        unlockedAt: new Date().toISOString(),
        title: "",
        description: "",
        category: "time",
        tier: "bronze",
        animal: "penguin",
        condition: {
          type: "special",
          value: 0,
          timeframe: undefined,
        },
        xpReward: 0,
      });
      LocalStorage.updateUserStats(userId, stats);
    }
  },
};
