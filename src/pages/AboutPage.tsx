import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Globe, TrendingUp, Building2, Leaf, Banknote } from "lucide-react";

const futureIntegrations = [
  { icon: Building2, title: "Recycling Companies", desc: "Partner with industrial recyclers for verified waste processing" },
  { icon: Globe, title: "Carbon Credit Markets", desc: "Connect waste collection to tradeable carbon credits" },
  { icon: Banknote, title: "Government Programs", desc: "Integrate with municipal waste management initiatives" },
];

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="container max-w-3xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold">About EcoCredit AI</h1>
          <p className="text-muted-foreground text-lg">Building a circular economy where waste becomes financial opportunity.</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            EcoCredit AI aims to create a world where no recyclable material goes to waste and no waste collector goes uncompensated.
            We use artificial intelligence to verify waste collection, reward participants with digital credits, and provide pathways to financial inclusion for millions of informal waste pickers in developing cities worldwide.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            By addressing environmental pollution, financial exclusion, and digital exclusion simultaneously, EcoCredit AI creates a triple-impact solution that benefits people, planet, and economy.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Future Scalability</h2>
          </div>
          <div className="grid gap-4">
            {futureIntegrations.map((item, i) => (
              <Card key={i}>
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="gradient-card border-0">
          <CardContent className="p-8 text-center space-y-4">
            <Leaf className="w-10 h-10 text-primary mx-auto" />
            <h3 className="text-xl font-bold">UN Sustainable Development Goals</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              EcoCredit AI directly contributes to SDG 1 (No Poverty), SDG 11 (Sustainable Cities), SDG 12 (Responsible Consumption), and SDG 13 (Climate Action).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
