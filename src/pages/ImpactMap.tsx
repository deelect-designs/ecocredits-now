import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Flame, TrendingUp, Recycle, Leaf } from "lucide-react";

interface ImpactLocation {
  location: string;
  totalKg: number;
  submissions: number;
  wasteTypes: string[];
}

const DEMO_LOCATIONS: ImpactLocation[] = [
  { location: "Wuse, Abuja", totalKg: 45, submissions: 12, wasteTypes: ["Plastic Bottle", "Aluminium Can"] },
  { location: "Ikeja, Lagos", totalKg: 78, submissions: 20, wasteTypes: ["Cardboard", "Metal", "Plastic Bottle"] },
  { location: "Westlands, Nairobi", totalKg: 32, submissions: 8, wasteTypes: ["Plastic Bottle"] },
  { location: "Lekki, Lagos", totalKg: 56, submissions: 15, wasteTypes: ["Aluminium Can", "Metal"] },
  { location: "Garki, Abuja", totalKg: 23, submissions: 6, wasteTypes: ["Cardboard"] },
];

const HEATMAP_CITIES = [
  { city: "Lagos", status: "improving" as const, change: "+18%", collectors: 320 },
  { city: "Abuja", status: "improving" as const, change: "+24%", collectors: 185 },
  { city: "Nairobi", status: "improving" as const, change: "+12%", collectors: 210 },
  { city: "Accra", status: "stable" as const, change: "+3%", collectors: 95 },
  { city: "Mumbai", status: "improving" as const, change: "+15%", collectors: 280 },
  { city: "Jakarta", status: "declining" as const, change: "-2%", collectors: 140 },
  { city: "São Paulo", status: "stable" as const, change: "+5%", collectors: 120 },
  { city: "Dhaka", status: "improving" as const, change: "+9%", collectors: 165 },
];

export default function ImpactMap() {
  const { user } = useAuth();
  const [locations, setLocations] = useState<ImpactLocation[]>(DEMO_LOCATIONS);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("waste_submissions")
      .select("location, quantity, waste_type")
      .eq("user_id", user.id)
      .not("location", "eq", "")
      .then(({ data }) => {
        if (data && data.length > 0) {
          const grouped: Record<string, ImpactLocation> = {};
          data.forEach(sub => {
            const loc = sub.location || "Unknown";
            if (!grouped[loc]) grouped[loc] = { location: loc, totalKg: 0, submissions: 0, wasteTypes: [] };
            grouped[loc].totalKg += Number(sub.quantity);
            grouped[loc].submissions += 1;
            if (!grouped[loc].wasteTypes.includes(sub.waste_type)) grouped[loc].wasteTypes.push(sub.waste_type);
          });
          const userLocations = Object.values(grouped);
          setLocations([...userLocations, ...DEMO_LOCATIONS]);
        }
      });
  }, [user]);

  const statusColor = (s: string) => {
    if (s === "improving") return "bg-primary/10 text-primary border-primary/20";
    if (s === "declining") return "bg-destructive/10 text-destructive border-destructive/20";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-lg mx-auto py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Impact Map</h1>
          <p className="text-sm text-muted-foreground">See where your actions make a difference</p>
        </div>

        {/* User impact locations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Your Impact Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {locations.slice(0, 6).map((loc, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b last:border-0">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{loc.location}</p>
                  <p className="text-xs text-muted-foreground">
                    You helped clean <span className="font-bold text-primary">{loc.totalKg}kg</span> of waste
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {loc.wasteTypes.map(wt => (
                      <Badge key={wt} variant="outline" className="text-[10px] py-0">{wt}</Badge>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{loc.submissions} actions</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Community Heatmap */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="w-4 h-4 text-eco-orange" /> Community Heatmap
            </CardTitle>
            <p className="text-xs text-muted-foreground">Which areas are improving or need help</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {HEATMAP_CITIES.map(city => (
                <div key={city.city} className={`rounded-lg border p-3 ${statusColor(city.status)}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{city.city}</p>
                    <span className="text-xs font-semibold">{city.change}</span>
                  </div>
                  <p className="text-[10px] mt-1">{city.collectors} collectors</p>
                  <div className="flex items-center gap-1 mt-1">
                    {city.status === "improving" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : city.status === "declining" ? (
                      <TrendingUp className="w-3 h-3 rotate-180" />
                    ) : (
                      <Recycle className="w-3 h-3" />
                    )}
                    <span className="text-[10px] capitalize">{city.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Impact Summary */}
        <Card className="gradient-card border-0">
          <CardContent className="p-6 text-center space-y-3">
            <Leaf className="w-10 h-10 text-primary mx-auto" />
            <h3 className="text-lg font-bold">Global Impact</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className="text-xl font-extrabold text-primary">2.5M</p>
                <p className="text-[10px] text-muted-foreground">kg Recycled</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-secondary">12</p>
                <p className="text-[10px] text-muted-foreground">Cities Active</p>
              </div>
              <div>
                <p className="text-xl font-extrabold text-eco-orange">50K+</p>
                <p className="text-[10px] text-muted-foreground">Collectors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
