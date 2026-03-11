import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Medal } from "lucide-react";
import { DEMO_LEADERBOARD } from "@/lib/credits";

interface LeaderEntry {
  name: string;
  city: string;
  credits: number;
}

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>(DEMO_LEADERBOARD);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("name, city, total_credits")
      .order("total_credits", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) {
          const dbLeaders = data.map(d => ({ name: d.name || "Anonymous", city: d.city || "Unknown", credits: d.total_credits }));
          // Merge with demo data
          setLeaders([...dbLeaders, ...DEMO_LEADERBOARD].sort((a, b) => b.credits - a.credits).slice(0, 20));
        }
      });
  }, []);

  const medalColor = (i: number) => {
    if (i === 0) return "text-eco-yellow";
    if (i === 1) return "text-muted-foreground";
    if (i === 2) return "text-eco-orange";
    return "text-transparent";
  };

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-md mx-auto py-6 space-y-6">
        <div className="text-center space-y-2">
          <Trophy className="w-10 h-10 text-eco-yellow mx-auto" />
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top recyclers this week</p>
        </div>

        <div className="space-y-2">
          {leaders.map((entry, i) => (
            <Card key={i} className={i < 3 ? "border-primary/20 shadow-md" : ""}>
              <CardContent className="flex items-center gap-3 p-3">
                <div className="w-8 text-center">
                  {i < 3 ? <Medal className={`w-5 h-5 mx-auto ${medalColor(i)}`} /> : <span className="text-sm text-muted-foreground font-bold">{i + 1}</span>}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.city}</p>
                </div>
                <span className="text-sm font-bold text-primary">{entry.credits}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
