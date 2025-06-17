"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ThemeToggle } from "./ui/theme-toggle";
import {
  LogOut,
  Trophy,
  AlertTriangle,
  Timer,
  Brain,
  ChartBar,
  Award,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LocalStorage } from "@/lib/localStorage";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { UserSettings } from "./user-settings";
import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function Navigation({
  userId,
  isGuest,
  onLogout,
  userEmail,
}: {
  userId: string;
  isGuest: boolean;
  onLogout: () => void;
  userEmail?: string | null;
}) {
  const { theme } = useTheme();
  const stats = LocalStorage.getUserStats(userId);
  const [showAlert, setShowAlert] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { key: "focus", icon: <Timer className="h-5 w-5" />, url: "/focus" },
    { key: "tasks", icon: <Brain className="h-5 w-5" />, url: "/tasks" },
    { key: "mood", icon: <ChartBar className="h-5 w-5" />, url: "/mood" },
    {
      key: "achievements",
      icon: <Award className="h-5 w-5" />,
      url: "/achievements",
    },
  ];

  const [activeTab, setActiveTab] = useState(() => {
    const match = tabs.find((tab) => pathname.startsWith(tab.url));
    return match ? match.key : "focus";
  });

  const handleTabChange = (key: string, url: string) => {
    setActiveTab(key);
    router.push(url);
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl px-4 font-bold">ADaptly</h1>
            <div className="hidden md:flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Level {stats.level}</span>
              <span className="text-sm text-muted-foreground">
                ({stats.xp} XP)
              </span>
              {userEmail && (
                <span className="text-sm text-muted-foreground ml-2">
                  • {userEmail}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="md:hidden flex items-center">
              <Trophy className="h-4 w-4 mr-1" />
              <span className="text-sm">{stats.level}</span>
            </div>

            <ThemeToggle />
            <UserSettings userId={userId} isGuest={isGuest} />
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isGuest && showAlert && (
          <div className="container py-2">
            <Alert variant="destructive" className="bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="ml-2 flex flex-wrap items-center gap-2">
                <span>
                  You're in guest mode. Create an account to save your progress
                  and unlock all features!
                </span>
                <Button
                  variant="link"
                  className="text-primary"
                  onClick={async () => {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: window.location.origin,
                      },
                    });
                    if (error) {
                      console.error("Error signing in:", error);
                    }
                  }}
                >
                  Sign Up Now
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAlert(false)}
                >
                  Dismiss
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation for Mobile
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <nav className="flex justify-around p-2">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="icon"
              className="h-12 w-12"
              onClick={() => handleTabChange(tab.key, tab.url)}
            >
              {tab.icon}
            </Button>
          ))}
        </nav>
      </div> */}
    </>
  );
}
