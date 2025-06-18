"use client";

import { Button } from "@/components/ui/button";
import { PoweredBy } from "@/components/powered-by";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { BOLT_URL } from "@/lib/constants";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FocusTracker } from "@/components/focus-tracker";
import { MoodTracker } from "@/components/mood-tracker";
import { Timer } from "@/components/timer";
import { Leaderboard } from "@/components/leaderboard";
import { Navigation } from "@/components/navigation";
import { Achievements } from "@/components/achievements";
import { LoadingScreen } from "@/components/loading-screen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    checkAuth();

    // Listen to auth state changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;
        setUserId(user.id);
        setUserEmail(user.email);
        setIsLoggedIn(true);
        setIsGuest(false);

        // Save user to DB if not exist
        await saveUserToDB(user.id, user.email);

        // If guest before, migrate data here (optional)
        migrateGuestDataToUser(user.id);
      } else if (event === "SIGNED_OUT") {
        setUserId(null);
        setUserEmail(null);
        setIsLoggedIn(false);
        setIsGuest(false);
      }
    });

    return () => {
      clearTimeout(loadingTimer);
      subscription?.unsubscribe();
    };
  }, []);

  async function checkAuth() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setUserId(session.user.id);
      setUserEmail(session.user.email);
      setIsLoggedIn(true);
      setIsGuest(false);

      await saveUserToDB(session.user.id, session.user.email);

      return;
    }

    // Check for guest session
    const guestId = localStorage.getItem("guestId");
    if (guestId) {
      setUserId(guestId);
      setIsLoggedIn(true);
      setIsGuest(true);
    }
  }

  // Insert or update user in your "users" table
  async function saveUserToDB(id: string, email: string) {
    if (!email) return;

    // 2. Cek apakah user_stats sudah ada
    const { data: statsData, error: statsCheckError } = await supabase
      .from("user_stats")
      .select("id, email")
      .eq("user_id", id)
      .maybeSingle();

    if (statsCheckError) {
      console.error("Failed to check user_stats:", statsCheckError);
      return;
    }

    // 3. Jika belum ada, insert baru
    if (!statsData) {
      const { error: statsInsertError } = await supabase
        .from("user_stats")
        .insert({
          user_id: id,
          email: email,
          xp: 0,
          level: 1,
          created_at: new Date().toISOString(),
        });

      if (statsInsertError) {
        console.error("Failed to insert into user_stats:", statsInsertError);
      }
    }
    // 4. Jika ada tapi email kosong/null, update email-nya
    else if (!statsData.email) {
      const { error: statsUpdateError } = await supabase
        .from("user_stats")
        .update({ email: email })
        .eq("user_id", id);

      if (statsUpdateError) {
        console.error(
          "Failed to update email in user_stats:",
          statsUpdateError
        );
      }
    }
  }

  // Example: migrate guest localStorage data to new user id (adjust as needed)
  function migrateGuestDataToUser(newUserId: string) {
    const guestId = localStorage.getItem("guestId");
    if (!guestId) return;

    // List your keys that store guest data
    const keys = [
      `focusSessions_${guestId}`,
      `tasks_${guestId}`,
      `moodEntries_${guestId}`,
      `userStats_${guestId}`,
      `userSettings_${guestId}`,
    ];

    keys.forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        const newKey = key.replace(guestId, newUserId);
        localStorage.setItem(newKey, data);
        localStorage.removeItem(key);
      }
    });

    localStorage.removeItem("guestId");
    setIsGuest(false);
    toast.success("Progress saved to your account!");
  }

  const handleGuestLogin = () => {
    const guestId = `guest_${Date.now()}`;
    localStorage.setItem("guestId", guestId);
    setUserId(guestId);
    setIsLoggedIn(true);
    setIsGuest(true);
  };

  const handleLogout = async () => {
    if (isGuest) {
      setShowLogoutDialog(true);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUserId(null);
      setUserEmail(null);
      setIsLoggedIn(false);
      setIsGuest(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleGuestLogoutConfirm = async (saveProgress: boolean) => {
    setShowLogoutDialog(false);

    if (saveProgress) {
      // Trigger SSO login to save progress to user account
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error("Failed to sign in with Google");
        console.error("Error signing in:", error);
      }
      return;
    }

    // Clear all guest data and logout guest
    localStorage.removeItem("guestId");
    localStorage.removeItem(`focusSessions_${userId}`);
    localStorage.removeItem(`tasks_${userId}`);
    localStorage.removeItem(`moodEntries_${userId}`);
    localStorage.removeItem(`userStats_${userId}`);
    localStorage.removeItem(`userSettings_${userId}`);

    setUserId(null);
    setIsLoggedIn(false);
    setIsGuest(false);
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isLoggedIn && userId) {
    return (
      <div className="animate-fade-in">
        <Navigation
          userId={userId}
          isGuest={isGuest}
          onLogout={handleLogout}
          userEmail={userEmail}
        />
        <div className="container mx-auto px-4 pb-20 md:pb-6">
          <Tabs defaultValue="focus" className="mt-6">
            <TabsList className="hidden md:grid w-full grid-cols-5 animate-slide-up">
              <TabsTrigger value="focus" className="hover-lift">
                Focus Timer
              </TabsTrigger>
              <TabsTrigger value="tasks" className="hover-lift">
                Daily Tasks
              </TabsTrigger>
              <TabsTrigger value="mood" className="hover-lift">
                Mood Tracker
              </TabsTrigger>
              <TabsTrigger value="achievements" className="hover-lift">
                Achievements
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="hover-lift">
                Leaderboard
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid md:hidden w-full grid-cols-5 animate-slide-up">
              <TabsTrigger value="focus" className="hover-bounce">
                ⏱️
              </TabsTrigger>
              <TabsTrigger value="tasks" className="hover-bounce">
                📝
              </TabsTrigger>
              <TabsTrigger value="mood" className="hover-bounce">
                😊
              </TabsTrigger>
              <TabsTrigger value="achievements" className="hover-bounce">
                🏆
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="hover-bounce">
                📊
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="focus"
              className="mt-6 animate-slide-up-delay-1"
            >
              <Timer userId={userId} />
            </TabsContent>
            <TabsContent
              value="tasks"
              className="mt-6 animate-slide-up-delay-1"
            >
              <FocusTracker userId={userId} isGuest={isGuest} />
            </TabsContent>
            <TabsContent value="mood" className="mt-6 animate-slide-up-delay-1">
              <MoodTracker userId={userId} />
            </TabsContent>
            <TabsContent
              value="achievements"
              className="mt-6 animate-slide-up-delay-1"
            >
              <Achievements userId={userId} isGuest={isGuest} />
            </TabsContent>
            <TabsContent
              value="leaderboard"
              className="mt-6 animate-slide-up-delay-1"
            >
              <Leaderboard userId={userId} isGuest={isGuest} />
            </TabsContent>
          </Tabs>
        </div>

        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogContent className="animate-scale-in">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to logout?
              </AlertDialogTitle>
              <AlertDialogDescription>
                All your progress will be lost if you logout as a guest. Would
                you like to create an account to save your progress?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleGuestLogoutConfirm(true)}
                className="hover-lift"
              >
                Save Progress & Create Account
              </AlertDialogAction>
              <AlertDialogAction
                onClick={() => handleGuestLogoutConfirm(false)}
                variant="destructive"
                className="hover-shake"
              >
                Logout & Delete Progress
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end animate-slide-down">
            <Link href={BOLT_URL} target="_blank" rel="noopener noreferrer">
              <Image
                src={
                  theme === "dark"
                    ? "/white_circle_360x360.png"
                    : "/black_circle_360x360.png"
                }
                alt="Bolt Logo"
                width={100}
                height={100}
                className="transition-all duration-300 hover:opacity-80 hover:scale-110 hover:rotate-12"
              />
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 animate-gradient-text animate-slide-up">
            ADaptly
          </h1>
          <p className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up-delay-1">
            A gamified focus & emotional self-management tool for ADHD and
            productivity, designed to work without expert systems — fun, fast,
            and frictionless.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto animate-slide-up-delay-2">
            <Button
              className="w-full py-8 text-lg border-2 border-teal-600 hover:bg-teal-900/30 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover-glow"
              size="lg"
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signInWithOAuth({
                    provider: "google",
                    options: {
                      redirectTo: window.location.origin,
                    },
                  });
                  if (error) throw error;
                } catch (error) {
                  console.error("Error signing in:", error);
                  toast.error("Failed to sign in with Google");
                }
              }}
            >
              Sign In with Google
            </Button>

            <Button
              variant="outline"
              className="w-full py-8 text-lg bg-transparent border-2 border-teal-600 text-teal-600 dark:text-teal-300 hover:bg-teal-900/30 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover-pulse"
              size="lg"
              onClick={handleGuestLogin}
            >
              Continue as Guest
            </Button>
          </div>

          <div className="mt-12 flex justify-center animate-slide-up-delay-3">
            <PoweredBy />
          </div>
        </div>
      </div>
    </div>
  );
}
