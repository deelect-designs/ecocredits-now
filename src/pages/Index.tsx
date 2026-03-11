import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Smartphone, Coins, TrendingUp, Globe, Users, Leaf, ArrowRight, Camera, Cpu, Award, Wallet } from "lucide-react";

const stats = [
  { icon: Recycle, value: "2.5M+", label: "kg Waste Recycled", color: "text-primary" },
  { icon: Users, value: "50K+", label: "Active Collectors", color: "text-secondary" },
  { icon: Globe, value: "12", label: "Cities Active", color: "text-eco-orange" },
  { icon: Leaf, value: "1.2M", label: "kg CO₂ Saved", color: "text-primary" },
];

const steps = [
  { icon: Camera, title: "Upload Photo", desc: "Take a photo of your collected recyclable waste" },
  { icon: Cpu, title: "AI Verifies", desc: "Our AI identifies the waste type and quality" },
  { icon: Award, title: "Earn Credits", desc: "Get EcoCredits based on waste type and quantity" },
  { icon: Wallet, title: "Convert Value", desc: "Convert credits to cash, airtime, or savings" },
];

export default function Index() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="container relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-accent px-4 py-1.5 rounded-full text-sm font-medium text-accent-foreground">
            <Leaf className="w-4 h-4" /> Turning waste into opportunity
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Turn Waste into <span className="text-gradient">Financial Opportunity</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            EcoCredit AI rewards people for recycling waste and creating a cleaner planet. Earn digital credits, convert to real value.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto gap-2 gradient-primary border-0 text-primary-foreground">
                Start Recycling <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-16 bg-muted/50">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-destructive">The Problem</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 2 billion tons of waste generated annually worldwide</li>
                  <li>• Informal waste pickers earn less than $2/day</li>
                  <li>• 91% of plastic is never recycled</li>
                  <li>• Financial & digital exclusion for waste collectors</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary/20 gradient-card">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-primary">Our Solution</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AI-powered waste identification & tracking</li>
                  <li>• Digital credit rewards for every collection</li>
                  <li>• Mobile money, airtime, and savings conversion</li>
                  <li>• Financial inclusion for underserved communities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="container max-w-5xl mx-auto text-center space-y-10">
          <div>
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">Four simple steps to start earning</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">Step {i + 1}</span>
                <h4 className="font-semibold text-sm">{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-muted/50">
        <div className="container max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-3xl font-bold">Our Global Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6 flex flex-col items-center gap-2">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  <span className="text-2xl font-extrabold">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Make an Impact?</h2>
          <p className="text-muted-foreground">Join thousands of eco-warriors turning waste into financial opportunity.</p>
          <Link to="/signup">
            <Button size="lg" className="gradient-primary border-0 text-primary-foreground gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Recycle className="w-5 h-5 text-primary" /> EcoCredit AI
          </div>
          <p>© 2026 EcoCredit AI. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-primary">About</Link>
            <Link to="/impact" className="hover:text-primary">Impact</Link>
            <Link to="/how-it-works" className="hover:text-primary">How It Works</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
