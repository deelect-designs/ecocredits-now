import { Camera, Cpu, Award, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { icon: Camera, title: "1. Upload Waste Photo", desc: "Use your phone camera or gallery to snap a picture of recyclable waste you've collected. Works with plastic, metal, cardboard, and more.", color: "bg-primary" },
  { icon: Cpu, title: "2. AI Verifies Waste Type", desc: "Our AI engine instantly analyzes the image and identifies the waste category — Plastic Bottle, Aluminium Can, Cardboard, or Metal — with a confidence score.", color: "bg-secondary" },
  { icon: Award, title: "3. Earn EcoCredits", desc: "Based on waste type and quantity, you earn EcoCredits. Plastic bottles earn 10 credits, aluminium cans 12, cardboard 8, and metal 15 per unit.", color: "bg-eco-orange" },
  { icon: Wallet, title: "4. Convert Credits", desc: "Redeem your EcoCredits for mobile money payouts, airtime top-ups, digital savings, or even microloan eligibility.", color: "bg-primary" },
];

export default function HowItWorks() {
  return (
    <div className="py-16">
      <div className="container max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold">How EcoCredit AI Works</h1>
          <p className="text-muted-foreground text-lg">Start earning in 4 simple steps</p>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => (
            <Card key={i} className="overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
              <CardContent className="flex items-start gap-5 p-6">
                <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center flex-shrink-0`}>
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{step.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{step.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link to="/signup">
            <Button size="lg" className="gradient-primary border-0 text-primary-foreground gap-2">
              Start Recycling Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
