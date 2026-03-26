import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Coins, Recycle, Leaf, Camera, TrendingUp, Shield, Map, Swords, Bot, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { calculateEcoScore, DEMO_ECO_SCORE } from "@/lib/eco-score";

interface Submission {
  id: string;
  waste_type: string;
  quantity: number;
  credits_earned: number;
  created_at: string;
}

export default function Dashboard() {
  const { profile, user, refreshProfile } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [ecoScore, setEcoScore] = useState(DEMO_ECO_SCORE.overall);

  useEffect(() => {
    if (!user) return;
    refreshProfile();
    supabase
      .from("waste_submissions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data) {
          setSubmissions(data as Submission[]);
          // Calculate eco score
          const totalKg = data.reduce((s, d) => s + Number(d.quantity), 0);
          const avgConf = data.length > 0 ? data.reduce((s, d) => s + Number((d as any).confidence_score || 0), 0) / data.length : 0;
          const score = calculateEcoScore({
            totalSubmissions: data.length,
            totalCredits: profile?.total_credits ?? 0,
            avgConfidence: avgConf || 90,
            leaderboardRank: 1,
            totalUsers: 10,
            daysSinceFirst: Math.max(1, data.length > 0 ? Math.floor((Date.now() - new Date(data[data.length - 1].created_at).getTime()) / 86400000) : 1),
            activeDays: new Set(data.map(d => new Date(d.created_at).toDateString())).size || 1,
          });
          setEcoScore(score.overall);
        }
      });
  }, [user]);

  const totalKg = submissions.reduce((s, sub) => s + Number(sub.quantity), 0);
  const co2Saved = (totalKg * 0.5).toFixed(1);

  const chartData = submissions.reduce((acc, sub) => {
    const existing = acc.find(a => a.type === sub.waste_type);
    if (existing) { existing.credits += sub.credits_earned; }
    else { acc.push({ type: sub.waste_type, credits: sub.credits_earned }); }
    return acc;
  }, [] as { type: string; credits: number }[]);

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-4xl mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome{profile?.name ? `, ${profile.name}` : ""}!</h1>
          <p className="text-sm text-muted-foreground">Your eco-reputation dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Shield className="w-5 h-5 text-secondary" />
              <span className="text-lg font-extrabold">{ecoScore}</span>
              <span className="text-[10px] text-muted-foreground">Eco Score</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Coins className="w-5 h-5 text-eco-yellow" />
              <span className="text-lg font-extrabold">{profile?.total_credits ?? 0}</span>
              <span className="text-[10px] text-muted-foreground">Credits</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Recycle className="w-5 h-5 text-primary" />
              <span className="text-lg font-extrabold">{totalKg}</span>
              <span className="text-[10px] text-muted-foreground">kg</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 flex flex-col items-center gap-1">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-lg font-extrabold">{co2Saved}</span>
              <span className="text-[10px] text-muted-foreground">CO₂ Saved</span>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/upload">
            <Button className="w-full h-14 gradient-primary border-0 text-primary-foreground gap-2" size="lg">
              <Camera className="w-5 h-5" /> Upload Waste
            </Button>
          </Link>
          <Link to="/eco-profile">
            <Button className="w-full h-14 gap-2" variant="outline" size="lg">
              <Shield className="w-5 h-5" /> Eco Profile
            </Button>
          </Link>
        </div>

        {/* Feature shortcuts */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { to: "/impact-map", icon: Map, label: "Map", color: "text-primary" },
            { to: "/challenges", icon: Swords, label: "Challenges", color: "text-eco-orange" },
            { to: "/eco-coach", icon: Bot, label: "AI Coach", color: "text-secondary" },
            { to: "/missions", icon: Target, label: "Missions", color: "text-eco-green" },
            { to: "/convert", icon: TrendingUp, label: "Convert", color: "text-eco-yellow" },
          ].map(item => (
            <Link key={item.to} to={item.to}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3 flex flex-col items-center gap-1">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-[10px] font-medium text-muted-foreground">{item.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Credits by Waste Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="credits" fill="hsl(123, 38%, 33%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent submissions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No submissions yet. Start by uploading waste!</p>
            ) : (
              <div className="space-y-2">
                {submissions.slice(0, 5).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{sub.waste_type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()} · {sub.quantity} units</p>
                    </div>
                    <span className="text-sm font-bold text-primary">+{sub.credits_earned}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
