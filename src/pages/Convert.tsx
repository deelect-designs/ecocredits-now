import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Banknote, Smartphone, PiggyBank, HandCoins, Coins } from "lucide-react";
import { toast } from "sonner";

const options = [
  { icon: Banknote, label: "Convert to Cash", desc: "Mobile money payout", color: "bg-primary" },
  { icon: Smartphone, label: "Buy Airtime", desc: "Top up your phone", color: "bg-secondary" },
  { icon: PiggyBank, label: "Save Credits", desc: "Digital savings wallet", color: "bg-eco-orange" },
  { icon: HandCoins, label: "Request Microloan", desc: "Based on credit history", color: "bg-primary" },
];

export default function Convert() {
  const { profile } = useAuth();

  const handleConvert = (label: string) => {
    toast.info(`${label} — Feature coming soon! This is an MVP simulation.`);
  };

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-md mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Convert Credits</h1>

        <Card className="gradient-card border-0">
          <CardContent className="p-6 text-center space-y-2">
            <Coins className="w-10 h-10 text-eco-yellow mx-auto" />
            <p className="text-3xl font-extrabold">{profile?.total_credits ?? 0}</p>
            <p className="text-sm text-muted-foreground">Available EcoCredits</p>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {options.map((opt, i) => (
            <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleConvert(opt.label)}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`w-12 h-12 rounded-xl ${opt.color} flex items-center justify-center`}>
                  <opt.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{opt.label}</h3>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
                <Button variant="outline" size="sm">Select</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
