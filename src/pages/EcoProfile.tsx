import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculateEcoScore, TIER_DESCRIPTIONS, DEMO_ECO_SCORE, type EcoScoreBreakdown } from "@/lib/eco-score";
import { Shield, Share2, Award, TrendingUp, Users, Eye, Leaf, Recycle, ExternalLink, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function EcoProfile() {
  const { profile, user } = useAuth();
  const [score, setScore] = useState<EcoScoreBreakdown>(DEMO_ECO_SCORE);
  const [stats, setStats] = useState({ submissions: 0, totalKg: 0, co2Saved: "0" });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: subs } = await supabase
        .from("waste_submissions")
        .select("quantity, confidence_score, created_at")
        .eq("user_id", user.id);

      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      const { data: rankData } = await supabase
        .from("profiles")
        .select("id, total_credits")
        .order("total_credits", { ascending: false });

      if (subs && rankData) {
        const totalSubmissions = subs.length;
        const avgConfidence = subs.length > 0
          ? subs.reduce((s, sub) => s + Number(sub.confidence_score || 0), 0) / subs.length
          : 0;
        const totalKg = subs.reduce((s, sub) => s + Number(sub.quantity), 0);
        const rank = rankData.findIndex(r => r.id === user.id) + 1;
        const dates = subs.map(s => new Date(s.created_at).toDateString());
        const uniqueDays = new Set(dates).size;
        const firstDate = subs.length > 0 ? new Date(subs[subs.length - 1].created_at) : new Date();
        const daysSinceFirst = Math.max(1, Math.floor((Date.now() - firstDate.getTime()) / 86400000));

        setStats({ submissions: totalSubmissions, totalKg, co2Saved: (totalKg * 0.5).toFixed(1) });
        setScore(calculateEcoScore({
          totalSubmissions,
          totalCredits: profile?.total_credits ?? 0,
          avgConfidence,
          leaderboardRank: rank,
          totalUsers: totalUsers ?? 1,
          daysSinceFirst,
          activeDays: uniqueDays,
        }));
      }
    })();
  }, [user, profile]);

  const handleShare = () => {
    const text = `🌱 My EcoCredit Score: ${score.overall}/100 (${score.tier})\n♻️ ${stats.submissions} recycling actions | ${stats.totalKg}kg collected\n🌍 ${stats.co2Saved}kg CO₂ saved\n\nJoin me: ${window.location.origin}`;
    if (navigator.share) {
      navigator.share({ title: "My Eco Profile", text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const scoreSegments = [
    { label: "Consistency", value: score.consistency, max: 25, icon: TrendingUp, color: "bg-primary" },
    { label: "Impact", value: score.impact, max: 30, icon: Leaf, color: "bg-secondary" },
    { label: "Authenticity", value: score.authenticity, max: 25, icon: Shield, color: "bg-eco-green" },
    { label: "Community", value: score.community, max: 20, icon: Users, color: "bg-eco-orange" },
  ];

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-lg mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Eco Profile</h1>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleShare}>
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>

        {/* Score Card */}
        <Card className="overflow-hidden">
          <div className="gradient-primary p-6 text-center text-primary-foreground space-y-3">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto">
              <span className="text-3xl font-extrabold">{score.overall}</span>
            </div>
            <div>
              <p className="text-sm opacity-80">Eco Reputation Score</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Award className="w-5 h-5" />
                <span className="text-lg font-bold">{score.tier}</span>
              </div>
              <p className="text-xs opacity-70 mt-1">{TIER_DESCRIPTIONS[score.tier]}</p>
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            {scoreSegments.map(seg => (
              <div key={seg.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <seg.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{seg.label}</span>
                  </div>
                  <span className="text-muted-foreground">{seg.value}/{seg.max}</span>
                </div>
                <Progress value={(seg.value / seg.max) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Impact CV */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Environmental Impact CV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xl font-extrabold">{stats.submissions}</p>
                <p className="text-[10px] text-muted-foreground">Verified Actions</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xl font-extrabold">{stats.totalKg}</p>
                <p className="text-[10px] text-muted-foreground">kg Collected</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xl font-extrabold">{stats.co2Saved}</p>
                <p className="text-[10px] text-muted-foreground">kg CO₂ Saved</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Verified Badges</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1"><CheckCircle2 className="w-3 h-3" /> AI Verified</Badge>
                <Badge variant="secondary" className="gap-1"><CheckCircle2 className="w-3 h-3" /> GPS Confirmed</Badge>
                {score.overall >= 50 && <Badge variant="secondary" className="gap-1"><CheckCircle2 className="w-3 h-3" /> Trusted Collector</Badge>}
                {score.overall >= 75 && <Badge className="gap-1 bg-eco-yellow text-foreground"><Award className="w-3 h-3" /> Eco Champion</Badge>}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              This profile serves as a verifiable environmental impact credential — usable for jobs, scholarships, and grants.
            </p>
          </CardContent>
        </Card>

        {/* Verified Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" /> Verified Actions System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "AI Waste Detection", desc: "Every submission verified by AI classification", icon: Eye },
              { label: "Geolocation Validation", desc: "GPS confirms collection location", icon: Recycle },
              { label: "Photo Proof", desc: "Image evidence prevents fake claims", icon: Shield },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
