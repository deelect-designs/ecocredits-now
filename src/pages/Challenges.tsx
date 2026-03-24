import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEMO_CHALLENGES, type Challenge } from "@/lib/challenges";
import { Swords, Clock, Trophy, Users, Zap, CalendarDays } from "lucide-react";
import { toast } from "sonner";

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const statusBadge = {
    active: { label: "Live Now", className: "bg-primary text-primary-foreground" },
    upcoming: { label: "Coming Soon", className: "bg-secondary text-secondary-foreground" },
    completed: { label: "Completed", className: "bg-muted text-muted-foreground" },
  }[challenge.status];

  const totalCredits = challenge.teams.reduce((s, t) => s + t.credits, 0);
  const leader = challenge.teams.length > 0
    ? challenge.teams.reduce((a, b) => a.credits > b.credits ? a : b)
    : null;

  return (
    <Card className={challenge.status === "active" ? "border-primary shadow-md" : ""}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">{challenge.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{challenge.description}</p>
          </div>
          <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}</span>
          {challenge.participants > 0 && (
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {challenge.participants}</span>
          )}
        </div>

        {/* Team progress */}
        {challenge.teams.length === 2 && (
          <div className="space-y-2">
            {challenge.teams.map((team, i) => {
              const pct = totalCredits > 0 ? (team.credits / totalCredits) * 100 : 50;
              const isLeader = leader?.name === team.name;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {team.avatar} {team.name} {isLeader && challenge.status !== "upcoming" && <Trophy className="w-3 h-3 inline text-eco-yellow" />}
                    </span>
                    <span className="text-xs text-muted-foreground">{team.credits.toLocaleString()} credits</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </div>
        )}

        {challenge.status === "active" && (
          <Button className="w-full gradient-primary border-0 text-primary-foreground gap-2" size="sm" onClick={() => toast.success("You joined the challenge! Start uploading waste to contribute.")}>
            <Zap className="w-4 h-4" /> Join Challenge
          </Button>
        )}
        {challenge.status === "upcoming" && (
          <Button variant="outline" className="w-full gap-2" size="sm" onClick={() => toast.info("We'll notify you when this challenge starts!")}>
            <Clock className="w-4 h-4" /> Get Notified
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function Challenges() {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? DEMO_CHALLENGES : DEMO_CHALLENGES.filter(c => c.status === tab);

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-lg mx-auto py-6 space-y-6">
        <div className="text-center space-y-2">
          <Swords className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-2xl font-bold">Community Challenges</h1>
          <p className="text-sm text-muted-foreground">Compete as a community for real impact</p>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Past</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No challenges in this category yet.</p>
          ) : (
            filtered.map(c => <ChallengeCard key={c.id} challenge={c} />)
          )}
        </div>

        {/* Sponsored Rewards Card */}
        <Card className="gradient-card border-0">
          <CardContent className="p-6 text-center space-y-2">
            <Trophy className="w-8 h-8 text-eco-yellow mx-auto" />
            <h3 className="font-bold">Sponsored Rewards</h3>
            <p className="text-xs text-muted-foreground">Top challengers win phones, scholarships, and grants from our sponsor partners.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
