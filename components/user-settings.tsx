"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Settings, User, Bell, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserSettings {
  username: string;
  notifications_enabled: boolean;
  focus_duration: number;
  break_duration: number;
  theme_preference: string;
}

export function UserSettings({
  userId,
  isGuest,
}: {
  userId: string;
  isGuest: boolean;
}) {
  const [settings, setSettings] = useState<UserSettings>({
    username: "",
    notifications_enabled: true,
    focus_duration: 25,
    break_duration: 5,
    theme_preference: "system",
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  async function loadUserSettings() {
    if (isGuest) {
      const savedSettings = localStorage.getItem(`userSettings_${userId}`);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      return;
    }

    const { data, error } = await supabase
      .from("user_stats")
      .select(
        "username, notifications_enabled, focus_duration, break_duration, theme_preference"
      )
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error loading settings from user_stat:", error);
      return;
    }

    if (data) {
      setSettings({
        username: data.username || "",
        notifications_enabled: data.notifications_enabled ?? true,
        focus_duration: data.focus_duration ?? 25,
        break_duration: data.break_duration ?? 5,
        theme_preference: data.theme_preference || "system",
      });
    }
  }

  async function saveSettings() {
    if (isGuest) {
      localStorage.setItem(`userSettings_${userId}`, JSON.stringify(settings));
      toast.success("Settings saved successfully");
      return;
    }

    const { error } = await supabase
      .from("user_stats")
      .update({
        username: settings.username,
        notifications_enabled: settings.notifications_enabled,
        focus_duration: settings.focus_duration,
        break_duration: settings.break_duration,
        theme_preference: settings.theme_preference,
      })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to save settings");
      console.error(error);
      return;
    }

    toast.success("Settings saved successfully");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            User Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Username
            </Label>
            <Input
              id="username"
              value={settings.username}
              onChange={(e) =>
                setSettings({ ...settings, username: e.target.value })
              }
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </Label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Enable notifications
              </span>
              <Switch
                checked={settings.notifications_enabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifications_enabled: checked })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timer Settings
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Focus Duration (minutes)</Label>
                <Select
                  value={settings.focus_duration.toString()}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      focus_duration: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 25, 30, 45, 60].map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Break Duration (minutes)</Label>
                <Select
                  value={settings.break_duration.toString()}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      break_duration: parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button className="w-full" onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
