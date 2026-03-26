import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEMO_MISSIONS, type Mission } from "@/lib/missions";
import { Target, MapPin, Clock, Star, Zap, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";

const difficultyColors = {
  easy: "bg-primary/10 text-primary",
  medium: "bg-eco-yellow/20 text-eco-yellow",
  hard: "bg-destructive/10 text-destructive",
};

function MissionCard({ mission }: { mission: Mission }) {
  const pct = Math.round((mission.progress / mission.target) * 100);

  return (
    <Card className={mission.status === "in_progress" ? "border-primary shadow-md" : mission.status === "completed" ? "opacity-75" : ""}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary shrink-0" />
              <h3 className="font-bold text-sm">{mission.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{mission.description}</p>
          </div>
          <Badge className={difficultyColors[mission.difficulty]}>{mission.difficulty}</Badge>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {mission.location && (
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {mission.location}</span>
          )}
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(mission.deadline).toLocaleDateString()}</span>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>{mission.progress}/{mission.target} {mission.targetUnit}</span>
            <span className="font-medium">{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>

        {/* Rewards */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-primary font-medium">
            <Star className="w-3 h-3" /> +{mission.reward.impactPoints} Impact
          </span>
          <span className="flex items-center gap-1 text-secondary font-medium">
            <Shield className="w-3 h-3" /> +{mission.reward.ecoScoreBoost} Eco Score
          </span>
          {mission.reward.badge && (
            <span className="text-muted-foreground">{mission.reward.badge}</span>
          )}
        </div>

        {/* Action */}
        {mission.status === "available" && (
          <Button className="w-full gradient-primary border-0 text-primary-foreground gap-2" size="sm"
            onClick={() => toast.success("Mission accepted! Start collecting and upload your progress.")}>
            <Zap className="w-4 h-4" /> Accept Mission
          </Button>
        )}
        {mission.status === "in_progress" && (
          <Button variant="outline" className="w-full gap-2" size="sm"
            onClick={() => toast.info("Upload waste to track progress toward this mission.")}>
            <Target className="w-4 h-4" /> Continue Mission
          </Button>
        )}
        {mission.status === "completed" && (
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
            <CheckCircle2 className="w-4 h-4" /> Completed
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Missions() {
  const [tab, setTab] = useState("all");
  const filtered = tab === "all" ? DEMO_MISSIONS : DEMO_MISSIONS.filter(m => m.status === tab);

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-lg mx-auto py-6 space-y-6">
        <div className="text-center space-y-2">
          <Target className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Collection Missions</h1>
          <p className="text-sm text-muted-foreground">
            No waste is useless. Complete missions to earn Impact Points and boost your Eco Score.
          </p>
        </div>

        {/* Info banner */}
        <Card className="gradient-card border-0">
          <CardContent className="p-4 text-center space-y-1">
            <p className="text-sm font-bold">🌍 Impact-Based Rewards</p>
            <p className="text-xs text-muted-foreground">
              Non-recyclable waste has no market value — but it has environmental value. 
              Collect it, log it, and earn Impact Points + Eco Score boosts.
            </p>
          </CardContent>
        </Card>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="available">Open</TabsTrigger>
            <TabsTrigger value="in_progress">Active</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No missions in this category.</p>
          ) : (
            filtered.map(m => <MissionCard key={m.id} mission={m} />)
          )}
        </div>
      </div>
    </div>
  );
}
