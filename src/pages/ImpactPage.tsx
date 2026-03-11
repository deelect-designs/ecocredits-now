import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Droplets, Users, Globe, TreePine, Factory } from "lucide-react";

const metrics = [
  { icon: Recycle, value: "2,500,000", unit: "kg", label: "Total Waste Recycled" },
  { icon: Droplets, value: "850,000", unit: "kg", label: "Plastic Removed" },
  { icon: Users, value: "50,000", unit: "+", label: "Active Collectors" },
  { icon: Globe, value: "12", unit: "", label: "Cities Participating" },
  { icon: TreePine, value: "1,200,000", unit: "kg", label: "CO₂ Emissions Saved" },
  { icon: Factory, value: "320", unit: "", label: "Partner Organizations" },
];

const cities = [
  { name: "Lagos", country: "Nigeria", collectors: "12,000" },
  { name: "Nairobi", country: "Kenya", collectors: "8,500" },
  { name: "Mumbai", country: "India", collectors: "10,200" },
  { name: "Jakarta", country: "Indonesia", collectors: "7,800" },
  { name: "Accra", country: "Ghana", collectors: "4,500" },
  { name: "Dhaka", country: "Bangladesh", collectors: "3,200" },
];

export default function ImpactPage() {
  return (
    <div className="py-16">
      <div className="container max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold">Environmental Impact</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time metrics showing how the EcoCredit community is making a measurable difference worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <Card key={i} className="border-0 shadow-md animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <CardContent className="p-6 flex flex-col items-center gap-2 text-center">
                <m.icon className="w-8 h-8 text-primary" />
                <span className="text-2xl font-extrabold">{m.value}<span className="text-base">{m.unit}</span></span>
                <span className="text-xs text-muted-foreground">{m.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Participating Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cities.map((city, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h3 className="font-bold">{city.name}</h3>
                  <p className="text-xs text-muted-foreground">{city.country}</p>
                  <p className="text-sm font-semibold text-primary mt-1">{city.collectors} collectors</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
