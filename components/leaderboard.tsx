import { Card } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { LeaderboardEntry } from "@/lib/types";
import { LocalStorage } from "@/lib/localStorage";
import { toast } from "sonner";

export function Leaderboard({
  userId,
  isGuest,
}: {
  userId: string;
  isGuest: boolean;
}) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [userId]);

  async function loadLeaderboard() {
    try {
      setLoading(true);

      if (isGuest) {
        const stats = LocalStorage.getUserStats(userId);
        const mockData = [
          {
            user_id: userId,
            username: "Guest User",
            xp: stats.xp,
            level: stats.level,
            rank: 1,
          },
          ...Array.from({ length: 9 }, (_, i) => ({
            user_id: `user_${i}`,
            username: `Player ${i + 1}`,
            xp: Math.floor(Math.random() * 10000),
            level: Math.floor(Math.random() * 20) + 1,
            rank: i + 2,
          })),
        ];
        setLeaderboard(mockData);
        setUserRank(1);
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("user_stats")
        .select("user_id, username, email, xp, level")
        .order("xp", { ascending: false });

      if (userError) {
        throw userError;
      }

      const rankedData = userData.map((entry, index) => ({
        ...entry,
        username: entry.username || entry.email || `User ${index + 1}`,
        rank: index + 1,
      }));

      setLeaderboard(rankedData);

      // Find user's rank
      const userRankIndex = rankedData.findIndex(
        (entry) => entry.user_id === userId
      );
      if (userRankIndex !== -1) {
        setUserRank(userRankIndex + 1);
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }

  function getRankIcon(rank: number) {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 text-center">{rank}</span>;
    }
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Global Leaderboard</h3>
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Global Leaderboard</h3>
          {isGuest ? (
            <span className="text-sm text-muted-foreground">
              Create an account to compete globally!
            </span>
          ) : (
            userRank && (
              <span className="text-sm">
                Your Rank: <strong>#{userRank}</strong>
              </span>
            )
          )}
        </div>

        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.user_id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                entry.user_id === userId ? "bg-primary/10 border-primary" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankIcon(entry.rank)}
                <span className="font-medium">{entry.username}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">Level {entry.level}</span>
                <span className="text-sm text-muted-foreground">
                  {entry.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
