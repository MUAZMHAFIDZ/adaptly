"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase, supabaseHelpers } from "@/lib/supabase";
import { LocalStorage } from "@/lib/localStorage";
import {
  CheckCircle,
  Circle,
  Plus,
  Trophy,
  Calendar,
  ArrowRight,
  XCircle,
  Clock,
} from "lucide-react";
import { Task } from "@/lib/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function FocusTracker({
  userId,
  isGuest,
}: {
  userId: string;
  isGuest?: boolean;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [weeklyProgress, setWeeklyProgress] = useState<any[]>([]);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [taskDate, setTaskDate] = useState<"today" | "tomorrow">("today");
  const [badges, setBadges] = useState<string[]>([]);

  // Use the isGuest prop if provided, otherwise fall back to checking if userId is empty
  const isGuestUser = isGuest !== undefined ? isGuest : !userId;

  useEffect(() => {
    loadTasks();
    loadWeeklyProgress();
    checkBadges();

    // Show add task dialog on first load if no tasks
    const hasSeenDialog = localStorage.getItem("hasSeenAddTaskDialog");
    if (!hasSeenDialog) {
      setShowAddTaskDialog(true);
      localStorage.setItem("hasSeenAddTaskDialog", "true");
    }
  }, [userId]);

  async function loadTasks() {
    if (isGuestUser) {
      setTasks(LocalStorage.getTasks(userId));
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks");
      setTasks([]);
    }
  }

  async function loadWeeklyProgress() {
    if (isGuestUser) {
      const tasks = LocalStorage.getTasks(userId);
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayTasks = tasks.filter(
          (t) => new Date(t.created_at!).toDateString() === date.toDateString()
        );
        return {
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          completed: dayTasks.filter((t) => t.completed).length,
          total: dayTasks.length,
          xp: dayTasks
            .filter((t) => t.completed)
            .reduce((sum, t) => sum + (t.xp || 0), 0),
        };
      }).reverse();
      setWeeklyProgress(weeklyData);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        );

      if (error) throw error;

      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayTasks = data.filter(
          (t) => new Date(t.created_at!).toDateString() === date.toDateString()
        );
        return {
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          completed: dayTasks.filter((t) => t.completed).length,
          total: dayTasks.length,
          xp: dayTasks
            .filter((t) => t.completed)
            .reduce((sum, t) => sum + (t.xp || 0), 0),
        };
      }).reverse();

      setWeeklyProgress(weeklyData);
    } catch (error) {
      console.error("Error loading weekly progress:", error);
      setWeeklyProgress([]);
    }
  }

  async function addTask(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!newTask.trim()) return;

    const createdAt =
      taskDate === "tomorrow"
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : new Date().toISOString();

    const task: Task = {
      user_id: userId,
      title: newTask,
      completed: false,
      created_at: createdAt,
      xp: 100,
      status: "pending",
    };

    try {
      if (isGuestUser) {
        const localTask = { ...task, id: `local_${Date.now()}` };
        const updatedTasks = [...tasks, localTask];

        LocalStorage.saveTasks(userId, updatedTasks);
        setTasks(updatedTasks);
      } else {
        const { data, error } = await supabase
          .from("tasks")
          .insert([task])
          .select()
          .single();

        if (error) throw error;
        setTasks([...tasks, data]);
      }

      setNewTask("");
      setShowAddTaskDialog(false);
      toast.success(`Task scheduled for ${taskDate}`);
      loadWeeklyProgress();
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  }

  async function updateTaskStatus(
    taskId: string,
    status: "completed" | "skipped" | "postponed"
  ) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask = { ...task, status, completed: status === "completed" };

    try {
      if (isGuestUser) {
        const updatedTasks = tasks.map((t) =>
          t.id === taskId ? updatedTask : t
        );
        LocalStorage.saveTasks(userId, updatedTasks);
        setTasks(updatedTasks);
        if (status === "completed") {
          LocalStorage.addXP(userId, task.xp || 100);
          checkBadges();
        }
      } else {
        const { error } = await supabase
          .from("tasks")
          .update({ status, completed: status === "completed" })
          .eq("id", taskId);

        if (error) throw error;

        if (status === "completed") {
          await supabaseHelpers.addXP(userId, task.xp || 100);
          checkBadges();
        }

        setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
      }

      loadWeeklyProgress();

      if (status === "completed") {
        toast.success("Task completed! +100 XP");
      } else if (status === "skipped") {
        toast.info("Task skipped");
      } else {
        toast.info("Task postponed to tomorrow");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  }

  function checkBadges() {
    const newBadges: string[] = [];

    // Daily completion badge
    const completedToday = tasks.filter(
      (t) =>
        t.completed &&
        new Date(t.created_at!).toDateString() === new Date().toDateString()
    ).length;

    if (completedToday >= 3) {
      newBadges.push("Daily Champion");
    }

    // Weekly streak badge
    const streak = weeklyProgress.reduce((count, day) => {
      return day.completed > 0 ? count + 1 : 0;
    }, 0);

    if (streak >= 3) {
      newBadges.push("3-Day Streak");
    }
    if (streak >= 5) {
      newBadges.push("5-Day Streak");
    }

    setBadges(newBadges);
  }

  const progress = Math.round(
    (tasks.filter((t) => t.completed).length / Math.max(tasks.length, 1)) * 100
  );

  const todaysTasks = tasks.filter(
    (t) => new Date(t.created_at!).toDateString() === new Date().toDateString()
  );

  const tomorrowsTasks = tasks.filter(
    (t) =>
      new Date(t.created_at!).toDateString() ===
      new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString()
  );

  return (
    <Card className="p-6 card-hover animate-slide-up">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Daily Focus Tasks</h3>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500 animate-wiggle" />
            <span className="text-sm text-muted-foreground">
              {tasks.filter((t) => t.completed).length}/{tasks.length} completed
            </span>
          </div>
        </div>

        <Progress value={progress} className="h-3 animate-glow" />

        <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
          <DialogTrigger asChild>
            <Button className="w-full hover-lift btn-ripple">
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="animate-scale-in">
            <DialogHeader>
              <DialogTitle>Add New Focus Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={addTask} className="space-y-4">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What would you like to focus on?"
                maxLength={100}
                className="focus-ring"
              />
              <Select
                value={taskDate}
                onValueChange={(value: "today" | "tomorrow") =>
                  setTaskDate(value)
                }
              >
                <SelectTrigger className="focus-ring">
                  <SelectValue placeholder="Select when" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full hover-lift btn-ripple">
                Add Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {badges.length > 0 && (
          <div className="flex gap-2 flex-wrap animate-slide-up">
            {badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="hover-bounce">
                <Trophy className="h-3 w-3 mr-1" />
                {badge}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today's Tasks
            </h4>
            {todaysTasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-2 rounded-lg border p-3 transition-smooth hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateTaskStatus(task.id!, "completed")}
                    disabled={task.status !== "pending"}
                    className="hover-bounce"
                  >
                    <CheckCircle
                      className={`h-5 w-5 ${
                        task.status === "completed" ? "text-green-500" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateTaskStatus(task.id!, "skipped")}
                    disabled={task.status !== "pending"}
                    className="hover-shake"
                  >
                    <XCircle
                      className={`h-5 w-5 ${
                        task.status === "skipped" ? "text-red-500" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateTaskStatus(task.id!, "postponed")}
                    disabled={task.status !== "pending"}
                    className="hover-bounce"
                  >
                    <Clock
                      className={`h-5 w-5 ${
                        task.status === "postponed" ? "text-yellow-500" : ""
                      }`}
                    />
                  </Button>
                </div>
                <span
                  className={
                    task.status === "completed" ? "line-through opacity-50" : ""
                  }
                >
                  {task.title}
                </span>
                <span className="ml-auto text-sm text-muted-foreground">
                  {task.xp || 100} XP
                </span>
              </div>
            ))}
          </div>

          {tomorrowsTasks.length > 0 && (
            <div className="space-y-2 animate-slide-up-delay-1">
              <h4 className="font-medium flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Tomorrow's Tasks
              </h4>
              {tomorrowsTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 rounded-lg border p-3 bg-muted/50 transition-smooth hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Circle className="h-5 w-5" />
                  <span>{task.title}</span>
                  <span className="ml-auto text-sm text-muted-foreground">
                    {task.xp || 100} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 animate-slide-up-delay-2">
          <h4 className="text-sm font-medium">Weekly Progress</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyProgress}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="completed"
                    fill="hsl(var(--primary))"
                    name="Tasks Completed"
                    className="animate-fade-in"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="xp"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="XP Earned"
                    className="animate-fade-in"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
