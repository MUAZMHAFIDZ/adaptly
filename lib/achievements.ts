import { Achievement } from "./types";

// Generate 1000+ achievements programmatically
export const ACHIEVEMENTS: Achievement[] = [
  // TASK COMPLETION ACHIEVEMENTS (200 achievements)
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `task_novice_${i + 1}`,
    title: `Task ${
      ["Apprentice", "Novice", "Beginner", "Starter", "Rookie"][i % 5]
    } ${Math.floor(i / 5) + 1}`,
    description: `Complete ${(i + 1) * 5} tasks`,
    category: "tasks" as const,
    tier: "bronze" as const,
    animal: ["cat", "dog", "rabbit", "fox", "penguin"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "tasks_completed" as const,
      value: (i + 1) * 5,
    },
    xpReward: 100 + i * 10,
  })),

  ...Array.from({ length: 30 }, (_, i) => ({
    id: `task_expert_${i + 1}`,
    title: `Task ${
      ["Expert", "Master", "Champion", "Legend", "Grandmaster"][i % 5]
    } ${Math.floor(i / 5) + 1}`,
    description: `Complete ${(i + 1) * 50 + 250} tasks`,
    category: "tasks" as const,
    tier: "silver" as const,
    animal: ["bear", "lion", "tiger", "wolf", "owl"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "tasks_completed" as const,
      value: (i + 1) * 50 + 250,
    },
    xpReward: 500 + i * 25,
  })),

  ...Array.from({ length: 20 }, (_, i) => ({
    id: `task_legendary_${i + 1}`,
    title: `Task ${
      ["Legendary", "Mythical", "Divine", "Cosmic", "Eternal"][i % 5]
    } ${Math.floor(i / 5) + 1}`,
    description: `Complete ${(i + 1) * 100 + 1500} tasks`,
    category: "tasks" as const,
    tier: "gold" as const,
    animal: ["panda", "koala", "elephant", "giraffe", "deer"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "tasks_completed" as const,
      value: (i + 1) * 100 + 1500,
    },
    xpReward: 1000 + i * 50,
  })),

  // FOCUS SESSION ACHIEVEMENTS (150 achievements)
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `focus_beginner_${i + 1}`,
    title: `Focus ${
      ["Starter", "Beginner", "Learner", "Student", "Trainee"][i % 5]
    } ${Math.floor(i / 5) + 1}`,
    description: `Complete ${(i + 1) * 2} focus sessions`,
    category: "focus" as const,
    tier: "bronze" as const,
    animal: ["cat", "rabbit", "fox", "penguin", "dog"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "focus_sessions" as const,
      value: (i + 1) * 2,
    },
    xpReward: 150 + i * 15,
  })),

  ...Array.from({ length: 50 }, (_, i) => ({
    id: `focus_advanced_${i + 1}`,
    title: `Focus ${["Advanced", "Expert", "Master", "Guru", "Sage"][i % 5]} ${
      Math.floor(i / 5) + 1
    }`,
    description: `Complete ${(i + 1) * 10 + 100} focus sessions`,
    category: "focus" as const,
    tier: "silver" as const,
    animal: ["bear", "owl", "lion", "tiger", "wolf"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "focus_sessions" as const,
      value: (i + 1) * 10 + 100,
    },
    xpReward: 300 + i * 20,
  })),

  ...Array.from({ length: 50 }, (_, i) => ({
    id: `focus_master_${i + 1}`,
    title: `Focus ${
      ["Grandmaster", "Legend", "Titan", "God", "Supreme"][i % 5]
    } ${Math.floor(i / 5) + 1}`,
    description: `Complete ${(i + 1) * 25 + 600} focus sessions`,
    category: "focus" as const,
    tier: "gold" as const,
    animal: ["panda", "elephant", "giraffe", "koala", "deer"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "focus_sessions" as const,
      value: (i + 1) * 25 + 600,
    },
    xpReward: 750 + i * 30,
  })),

  // STREAK ACHIEVEMENTS (200 achievements)
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `task_streak_${i + 1}`,
    title: `${
      ["Consistent", "Reliable", "Steady", "Persistent", "Dedicated"][i % 5]
    } ${["Cat", "Dog", "Rabbit", "Fox", "Penguin"][i % 5]} ${
      Math.floor(i / 5) + 1
    }`,
    description: `Complete tasks for ${i + 2} consecutive days`,
    category: "streak" as const,
    tier: "bronze" as const,
    animal: ["cat", "dog", "rabbit", "fox", "penguin"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "task_streak" as const,
      value: i + 2,
      timeframe: "consecutive" as const,
    },
    xpReward: 200 + i * 25,
  })),

  ...Array.from({ length: 30 }, (_, i) => ({
    id: `focus_streak_${i + 1}`,
    title: `${
      ["Focused", "Concentrated", "Mindful", "Zen", "Meditative"][i % 5]
    } ${["Bear", "Owl", "Lion", "Tiger", "Wolf"][i % 5]} ${
      Math.floor(i / 5) + 1
    }`,
    description: `Complete focus sessions for ${i + 3} consecutive days`,
    category: "streak" as const,
    tier: "silver" as const,
    animal: ["bear", "owl", "lion", "tiger", "wolf"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "focus_sessions" as const,
      value: i + 3,
      timeframe: "consecutive" as const,
    },
    xpReward: 400 + i * 35,
  })),

  ...Array.from({ length: 40 }, (_, i) => ({
    id: `mood_streak_${i + 1}`,
    title: `${["Happy", "Joyful", "Cheerful", "Positive", "Radiant"][i % 5]} ${
      ["Panda", "Koala", "Elephant", "Giraffe", "Deer"][i % 5]
    } ${Math.floor(i / 5) + 1}`,
    description: `Track mood for ${i + 3} consecutive days`,
    category: "mood" as const,
    tier: "bronze" as const,
    animal: ["panda", "koala", "elephant", "giraffe", "deer"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "mood_streak" as const,
      value: i + 3,
      timeframe: "consecutive" as const,
    },
    xpReward: 150 + i * 20,
  })),

  // LEVEL ACHIEVEMENTS (100 achievements)
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `level_${i + 1}`,
    title: `Level ${i + 1} ${
      [
        "Warrior",
        "Knight",
        "Champion",
        "Hero",
        "Legend",
        "Master",
        "Sage",
        "Guardian",
        "Titan",
        "God",
      ][i % 10]
    }`,
    description: `Reach level ${i + 1}`,
    category: "level" as const,
    tier: (i < 20
      ? "bronze"
      : i < 50
      ? "silver"
      : i < 80
      ? "gold"
      : i < 95
      ? "platinum"
      : "legendary") as Achievement["tier"],
    animal: [
      "cat",
      "dog",
      "rabbit",
      "fox",
      "penguin",
      "bear",
      "owl",
      "lion",
      "tiger",
      "wolf",
      "panda",
      "koala",
      "elephant",
      "giraffe",
      "deer",
    ][i % 15] as Achievement["animal"],
    condition: {
      type: "level_reached" as const,
      value: i + 1,
    },
    xpReward: (i + 1) * 100,
  })),

  // XP ACHIEVEMENTS (100 achievements)
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `xp_${i + 1}`,
    title: `${
      ["Collector", "Gatherer", "Accumulator", "Hoarder", "Magnate"][i % 5]
    } ${
      [
        "Cat",
        "Dog",
        "Rabbit",
        "Fox",
        "Penguin",
        "Bear",
        "Owl",
        "Lion",
        "Tiger",
        "Wolf",
      ][i % 10]
    } ${Math.floor(i / 10) + 1}`,
    description: `Earn ${(i + 1) * 1000} total XP`,
    category: "level" as const,
    tier: (i < 25
      ? "bronze"
      : i < 50
      ? "silver"
      : i < 75
      ? "gold"
      : i < 90
      ? "platinum"
      : "legendary") as Achievement["tier"],
    animal: [
      "cat",
      "dog",
      "rabbit",
      "fox",
      "penguin",
      "bear",
      "owl",
      "lion",
      "tiger",
      "wolf",
      "panda",
      "koala",
      "elephant",
      "giraffe",
      "deer",
    ][i % 15] as Achievement["animal"],
    condition: {
      type: "xp_earned" as const,
      value: (i + 1) * 1000,
    },
    xpReward: 500 + i * 25,
  })),

  // TIME-BASED ACHIEVEMENTS (100 achievements)
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `daily_${i + 1}`,
    title: `Daily ${
      ["Visitor", "Regular", "Devotee", "Fanatic", "Addict"][i % 5]
    } ${Math.floor(i / 5) + 1}`,
    description: `Log in for ${i + 1} consecutive days`,
    category: "time" as const,
    tier: "bronze" as const,
    animal: ["cat", "dog", "rabbit", "fox", "penguin"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "login_streak" as const,
      value: i + 1,
      timeframe: "consecutive" as const,
    },
    xpReward: 100 + i * 15,
  })),

  ...Array.from({ length: 20 }, (_, i) => ({
    id: `weekly_${i + 1}`,
    title: `Weekly ${["Champion", "Master", "Legend", "Titan", "God"][i % 5]} ${
      Math.floor(i / 5) + 1
    }`,
    description: `Complete weekly goals for ${i + 1} consecutive weeks`,
    category: "time" as const,
    tier: "silver" as const,
    animal: ["bear", "owl", "lion", "tiger", "wolf"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "task_streak" as const,
      value: (i + 1) * 7,
      timeframe: "consecutive" as const,
    },
    xpReward: 500 + i * 50,
  })),

  ...Array.from({ length: 12 }, (_, i) => ({
    id: `monthly_${i + 1}`,
    title: `Monthly ${
      ["Achiever", "Conqueror", "Dominator", "Emperor"][i % 4]
    } ${Math.floor(i / 4) + 1}`,
    description: `Complete monthly goals for ${i + 1} consecutive months`,
    category: "time" as const,
    tier: "gold" as const,
    animal: ["panda", "koala", "elephant", "giraffe"][
      i % 4
    ] as Achievement["animal"],
    condition: {
      type: "task_streak" as const,
      value: (i + 1) * 30,
      timeframe: "consecutive" as const,
    },
    xpReward: 1000 + i * 100,
  })),

  // SPECIAL ACHIEVEMENTS (150 achievements)
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `special_combo_${i + 1}`,
    title: `${["Combo", "Multi", "Super", "Ultra", "Mega"][i % 5]} ${
      [
        "Cat",
        "Dog",
        "Rabbit",
        "Fox",
        "Penguin",
        "Bear",
        "Owl",
        "Lion",
        "Tiger",
        "Wolf",
      ][i % 10]
    } ${Math.floor(i / 10) + 1}`,
    description: `Complete ${i + 2} different types of activities in one day`,
    category: "special" as const,
    tier: "platinum" as const,
    animal: [
      "cat",
      "dog",
      "rabbit",
      "fox",
      "penguin",
      "bear",
      "owl",
      "lion",
      "tiger",
      "wolf",
      "panda",
      "koala",
      "elephant",
      "giraffe",
      "deer",
    ][i % 15] as Achievement["animal"],
    condition: {
      type: "special" as const,
      value: i + 2,
    },
    xpReward: 750 + i * 40,
  })),

  ...Array.from({ length: 25 }, (_, i) => ({
    id: `perfect_week_${i + 1}`,
    title: `Perfect ${
      ["Week", "Fortnight", "Month", "Season", "Year"][i % 5]
    } ${Math.floor(i / 5) + 1}`,
    description: `Complete all daily goals for ${(i + 1) * 7} consecutive days`,
    category: "special" as const,
    tier: "diamond" as const,
    animal: ["panda", "koala", "elephant", "giraffe", "deer"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "task_streak" as const,
      value: (i + 1) * 7,
      timeframe: "consecutive" as const,
    },
    xpReward: 1500 + i * 75,
  })),

  ...Array.from({ length: 25 }, (_, i) => ({
    id: `speed_demon_${i + 1}`,
    title: `Speed ${["Demon", "Racer", "Lightning", "Flash", "Sonic"][i % 5]} ${
      Math.floor(i / 5) + 1
    }`,
    description: `Complete ${(i + 1) * 5} tasks in one day`,
    category: "special" as const,
    tier: "legendary" as const,
    animal: ["cat", "dog", "rabbit", "fox", "penguin"][
      i % 5
    ] as Achievement["animal"],
    condition: {
      type: "tasks_completed" as const,
      value: (i + 1) * 5,
      timeframe: "daily" as const,
    },
    xpReward: 2000 + i * 100,
  })),

  // SEASONAL & HOLIDAY ACHIEVEMENTS (50 achievements)
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `seasonal_${i + 1}`,
    title: `${["Spring", "Summer", "Autumn", "Winter"][i % 4]} ${
      ["Blossom", "Sunshine", "Harvest", "Frost"][i % 4]
    } ${Math.floor(i / 4) + 1}`,
    description: `Complete seasonal challenges during ${
      ["Spring", "Summer", "Autumn", "Winter"][i % 4]
    }`,
    category: "special" as const,
    tier: "gold" as const,
    animal: ["rabbit", "lion", "fox", "bear"][i % 4] as Achievement["animal"],
    condition: {
      type: "special" as const,
      value: 100,
    },
    xpReward: 1000,
  })),

  // Add more creative achievements...
  {
    id: "night_owl",
    title: "Night Owl Scholar",
    description: "Complete 50 focus sessions after 10 PM",
    category: "special" as const,
    tier: "silver" as const,
    animal: "owl" as const,
    condition: { type: "special" as const, value: 50 },
    xpReward: 800,
  },
  {
    id: "early_bird",
    title: "Early Bird Champion",
    description: "Complete 50 tasks before 8 AM",
    category: "special" as const,
    tier: "silver" as const,
    animal: "cat" as const,
    condition: { type: "special" as const, value: 50 },
    xpReward: 800,
  },
  {
    id: "weekend_warrior",
    title: "Weekend Warrior",
    description: "Complete tasks on 20 consecutive weekends",
    category: "special" as const,
    tier: "gold" as const,
    animal: "lion" as const,
    condition: { type: "special" as const, value: 20 },
    xpReward: 1200,
  },
];
