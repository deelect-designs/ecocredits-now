import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Coins, TreePine, WifiOff, Shield, Video, Building2, GraduationCap, Rocket } from "lucide-react";

const features = [
  {
    icon: ShoppingCart,
    title: "Waste-to-Cash Marketplace",
    description: "Sell recyclables directly to local vendors and scrap dealers. Connect with the eco-merchant network for discounts.",
    tags: ["Marketplace", "Local Economy"],
    color: "bg-primary",
  },
  {
    icon: Coins,
    title: "Carbon Credit Tokenization",
    description: "Convert your verified eco-actions into micro carbon credits. Sell to companies or trade on the marketplace.",
    tags: ["Carbon Credits", "Trading"],
    color: "bg-secondary",
  },
  {
    icon: TreePine,
    title: "Green Micro-Investments",
    description: "Invest your EcoCredits into real projects: tree planting, solar installations, and recycling plants. Track environmental + financial ROI.",
    tags: ["Investment", "Impact"],
    color: "bg-eco-green",
  },
  {
    icon: WifiOff,
    title: "Offline Mode & USSD",
    description: "Log eco-actions without internet. SMS/USSD integration for feature phones. Sync when connectivity returns.",
    tags: ["Offline", "Accessibility"],
    color: "bg-eco-orange",
  },
  {
    icon: Shield,
    title: "Advanced Fraud Detection",
    description: "AI-powered fraud detection with random verification tasks and reputation penalties. Build a trust-first ecosystem.",
    tags: ["Security", "Trust"],
    color: "bg-destructive",
  },
  {
    icon: Video,
    title: "Storytelling Engine",
    description: "Share your impact stories with short videos. Highlight Eco Heroes in the community and build emotional loyalty.",
    tags: ["Social", "Stories"],
    color: "bg-secondary",
  },
  {
    icon: Building2,
    title: "Eco-Merchant Network",
    description: "Businesses give discounts for high Eco Scores — transport, food vendors, supermarkets. Your eco reputation has real value.",
    tags: ["Partnerships", "Rewards"],
    color: "bg-primary",
  },
  {
    icon: GraduationCap,
    title: "School & Church Integration",
    description: "Groups compete in eco challenges. Powerful community engagement in schools, churches, and social organizations.",
    tags: ["Community", "Groups"],
    color: "bg-eco-green",
  },
];

export default function ComingSoon() {
  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-lg mx-auto py-6 space-y-6">
        <div className="text-center space-y-2">
          <Rocket className="w-10 h-10 text-secondary mx-auto" />
          <h1 className="text-2xl font-bold">Coming Soon</h1>
          <p className="text-sm text-muted-foreground">
            The future of EcoCredit AI — features in development
          </p>
        </div>

        <div className="space-y-3">
          {features.map((feature, i) => (
            <Card key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${feature.color} flex items-center justify-center shrink-0`}>
                    <feature.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-bold">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {feature.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] py-0">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
