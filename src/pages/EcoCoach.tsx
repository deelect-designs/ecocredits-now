import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Lightbulb, TrendingUp, Leaf, Flame, Target, Coins } from "lucide-react";

interface Insight {
  icon: typeof Lightbulb;
  title: string;
  description: string;
  type: "tip" | "stat" | "goal";
}

function generateInsights(params: {
  totalCredits: number;
  totalKg: number;
  submissions: number;
  name: string;
}): Insight[] {
  const { totalCredits, totalKg, submissions, name } = params;
  const co2Saved = totalKg * 0.5;
  const moneyEquiv = (totalCredits * 0.5).toFixed(0);

  const insights: Insight[] = [
    {
      icon: Coins,
      title: "Weekly Summary",
      description: `You've earned ${totalCredits} EcoCredits total — that's equivalent to ₦${moneyEquiv} in value! Keep collecting to increase your conversion power.`,
      type: "stat",
    },
    {
      icon: Leaf,
      title: `CO₂ Impact`,
      description: `You've saved ${co2Saved.toFixed(1)}kg of CO₂ — that's like planting ${Math.max(1, Math.floor(co2Saved / 20))} trees! Focus on collecting aluminium cans for higher credits.`,
      type: "stat",
    },
  ];

  if (submissions < 5) {
    insights.push({
      icon: Target,
      title: "Getting Started Goal",
      description: `You have ${submissions} submissions. Aim for 5 this week to unlock the "Active Collector" badge and boost your Eco Score by 15 points!`,
      type: "goal",
    });
  } else {
    insights.push({
      icon: Flame,
      title: "Keep the Streak",
      description: "You're building consistency! Upload at least 1 item per day to maintain your streak and maximize your Eco Score.",
      type: "goal",
    });
  }

  insights.push(
    {
      icon: Lightbulb,
      title: "Pro Tip: Metal Pays More",
      description: "Metal items earn 15 credits each — 50% more than plastic bottles. Look for scrap metal near construction sites or workshops.",
      type: "tip",
    },
    {
      icon: TrendingUp,
      title: "Optimize Your Route",
      description: "Collectors who focus on 2-3 regular collection zones earn 40% more credits. Pick your best areas and visit them consistently.",
      type: "tip",
    },
    {
      icon: Lightbulb,
      title: "Community Challenge",
      description: "Join the active community challenge to compete with other cities! Top participants win sponsored prizes.",
      type: "tip",
    },
  );

  return insights;
}

export default function EcoCoach() {
  const { profile, user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let totalKg = 0;
      let submissions = 0;

      if (user) {
        const { data } = await supabase
          .from("waste_submissions")
          .select("quantity")
          .eq("user_id", user.id);
        if (data) {
          totalKg = data.reduce((s, d) => s + Number(d.quantity), 0);
          submissions = data.length;
        }
      }

      setInsights(generateInsights({
        totalCredits: profile?.total_credits ?? 120,
        totalKg: totalKg || 25,
        submissions: submissions || 3,
        name: profile?.name || "Eco Collector",
      }));
      setLoading(false);
    })();
  }, [user, profile]);

  const typeStyles = {
    tip: { badge: "bg-eco-blue/10 text-secondary border-secondary/20", label: "Tip" },
    stat: { badge: "bg-primary/10 text-primary border-primary/20", label: "Insight" },
    goal: { badge: "bg-eco-orange/10 text-eco-orange border-eco-orange/20", label: "Goal" },
  };

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-lg mx-auto py-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto">
            <Bot className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">AI Eco Coach</h1>
          <p className="text-sm text-muted-foreground">
            Personalized insights to boost your impact
          </p>
        </div>

        {/* Greeting Card */}
        <Card className="gradient-card border-0">
          <CardContent className="p-5">
            <p className="text-sm">
              👋 Hey <span className="font-bold">{profile?.name || "there"}</span>! Here are your personalized eco-insights based on your recycling activity. Follow these to increase your earnings and environmental impact.
            </p>
          </CardContent>
        </Card>

        {/* Insights */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">Analyzing your activity...</div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, i) => {
              const styles = typeStyles[insight.type];
              return (
                <Card key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <insight.icon className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold">{insight.title}</h3>
                          <Badge variant="outline" className={`text-[10px] py-0 ${styles.badge}`}>{styles.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
