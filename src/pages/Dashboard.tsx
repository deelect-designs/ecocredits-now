import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Coins, Recycle, Leaf, Camera, TrendingUp, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

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
        if (data) setSubmissions(data as Submission[]);
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
          <p className="text-sm text-muted-foreground">Your recycling dashboard</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 flex flex-col items-center gap-1">
              <Coins className="w-6 h-6 text-eco-yellow" />
              <span className="text-xl font-extrabold">{profile?.total_credits ?? 0}</span>
              <span className="text-[10px] text-muted-foreground">EcoCredits</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 flex flex-col items-center gap-1">
              <Recycle className="w-6 h-6 text-primary" />
              <span className="text-xl font-extrabold">{totalKg}</span>
              <span className="text-[10px] text-muted-foreground">kg Collected</span>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4 flex flex-col items-center gap-1">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="text-xl font-extrabold">{co2Saved}</span>
              <span className="text-[10px] text-muted-foreground">kg CO₂ Saved</span>
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
          <Link to="/convert">
            <Button className="w-full h-14 gap-2" variant="outline" size="lg">
              <TrendingUp className="w-5 h-5" /> Convert Credits
            </Button>
          </Link>
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
