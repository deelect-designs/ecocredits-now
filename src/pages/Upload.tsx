import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { supabase } from "@/integrations/supabase/client";
import { simulateAIDetection, calculateCredits, calculateImpactPoints, WASTE_CATALOG, PROCESSING_DESTINATIONS } from "@/lib/credits";
import { Camera, Upload as UploadIcon, MapPin, Loader2, CheckCircle2, Sparkles, Recycle, Flame, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Step = "upload" | "detecting" | "result" | "confirmed";

function WasteClassBadge({ category }: { category: "recyclable" | "non-recyclable" }) {
  return category === "recyclable" ? (
    <Badge className="bg-primary/10 text-primary gap-1"><Recycle className="w-3 h-3" /> Recyclable</Badge>
  ) : (
    <Badge className="bg-eco-orange/20 text-eco-orange gap-1"><Flame className="w-3 h-3" /> Non-Recyclable</Badge>
  );
}

export default function UploadPage() {
  const { user, refreshProfile } = useAuth();
  const { isDemoMode } = useDemo();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState("");
  const [detection, setDetection] = useState<ReturnType<typeof simulateAIDetection> | null>(null);
  const [creditsEarned, setCreditsEarned] = useState(0);
  const [impactEarned, setImpactEarned] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDetect = async () => {
    setStep("detecting");
    await new Promise(r => setTimeout(r, 2000));
    const result = simulateAIDetection();
    setDetection(result);
    setStep("result");
  };

  const handleSubmit = async () => {
    if (!user && !isDemoMode) return;
    setLoading(true);
    try {
      const credits = calculateCredits(detection!.wasteType, quantity);
      const impact = calculateImpactPoints(detection!.wasteType, quantity);
      setCreditsEarned(credits);
      setImpactEarned(impact);

      if (!isDemoMode && user) {
        let imageUrl = "";
        if (imageFile) {
          const ext = imageFile.name.split(".").pop();
          const path = `${user.id}/${Date.now()}.${ext}`;
          const { error: upErr } = await supabase.storage.from("waste-images").upload(path, imageFile);
          if (!upErr) {
            const { data } = supabase.storage.from("waste-images").getPublicUrl(path);
            imageUrl = data.publicUrl;
          }
        }

        await supabase.from("waste_submissions").insert({
          user_id: user.id,
          waste_type: detection!.wasteType,
          quantity,
          credits_earned: credits,
          confidence_score: detection!.confidence,
          image_url: imageUrl,
          location,
        });

        await supabase.from("credit_transactions").insert({
          user_id: user.id,
          type: "earn",
          amount: credits,
          description: `${detection!.wasteType} x${quantity}`,
        });

        const { data: profileData } = await supabase.from("profiles").select("total_credits").eq("id", user.id).single();
        await supabase.from("profiles").update({
          total_credits: (profileData?.total_credits ?? 0) + credits,
        }).eq("id", user.id);

        await refreshProfile();
      }

      setStep("confirmed");
      toast.success(`You earned ${credits} EcoCredits + ${impact} Impact Points!`);
    } catch (err: any) {
      toast.error(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("upload");
    setImageFile(null);
    setImagePreview(null);
    setDetection(null);
    setQuantity(1);
    setLocation("");
    setCreditsEarned(0);
    setImpactEarned(0);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        () => setLocation("Location unavailable")
      );
    }
  };

  const wasteInfo = detection ? WASTE_CATALOG[detection.wasteType] ?? WASTE_CATALOG["Other"] : null;

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-md mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Upload Waste</h1>

        {step === "upload" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Tap to take photo or upload image</p>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

              <div>
                <label className="text-sm font-medium">Quantity (units)</label>
                <Input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Location</label>
                <div className="flex gap-2 mt-1">
                  <Input placeholder="Auto or manual" value={location} onChange={e => setLocation(e.target.value)} />
                  <Button variant="outline" size="icon" onClick={getLocation} type="button">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button className="w-full gradient-primary border-0 text-primary-foreground gap-2" onClick={handleDetect} disabled={!imagePreview && !isDemoMode}>
                <Sparkles className="w-4 h-4" /> Detect & Classify Waste
              </Button>

              {isDemoMode && !imagePreview && (
                <Button variant="outline" className="w-full" onClick={handleDetect}>
                  Run Demo Detection
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {step === "detecting" && (
          <Card>
            <CardContent className="p-10 text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <p className="font-semibold">AI is analyzing your waste...</p>
              <p className="text-sm text-muted-foreground">Classifying as recyclable or non-recyclable</p>
            </CardContent>
          </Card>
        )}

        {step === "result" && detection && wasteInfo && (
          <Card className="gradient-card border-0">
            <CardContent className="p-6 space-y-4 text-center">
              <Sparkles className="w-10 h-10 text-primary mx-auto" />
              <h2 className="text-xl font-bold">AI Classification Result</h2>

              <div className="bg-card rounded-xl p-4 space-y-3">
                <p className="text-lg font-bold">{detection.wasteType}</p>
                <WasteClassBadge category={detection.category} />
                <p className="text-xs text-muted-foreground">{wasteInfo.description}</p>
                <p className="text-sm text-muted-foreground">
                  Confidence: <span className="font-semibold text-primary">{detection.confidence}%</span>
                </p>
              </div>

              {/* Reward breakdown */}
              <div className="bg-card rounded-xl p-4 space-y-2 text-left">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Your Rewards</p>
                <div className="flex justify-between text-sm">
                  <span>EcoCredits</span>
                  <span className="font-bold text-primary">+{calculateCredits(detection.wasteType, quantity)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Impact Points</span>
                  <span className="font-bold text-secondary">+{calculateImpactPoints(detection.wasteType, quantity)}</span>
                </div>
                {detection.category === "non-recyclable" && (
                  <p className="text-[10px] text-muted-foreground mt-2 italic">
                    Non-recyclable waste earns fewer credits but higher Impact Points — rewarding environmental responsibility.
                  </p>
                )}
              </div>

              {/* Processing destination for non-recyclable */}
              {detection.category === "non-recyclable" && (
                <div className="bg-card rounded-xl p-4 space-y-2 text-left">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Processing Destination</p>
                  {PROCESSING_DESTINATIONS.slice(0, 1).map((dest, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                      <div>
                        <span className="font-medium">{dest.name}</span>
                        <p className="text-[10px] text-muted-foreground">{dest.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={reset}>Retry</Button>
                <Button className="flex-1 gradient-primary border-0 text-primary-foreground" onClick={handleSubmit} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit & Earn"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "confirmed" && (
          <Card className="border-primary">
            <CardContent className="p-8 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">Congratulations!</h2>
              <div className="space-y-1">
                <p className="text-3xl font-extrabold text-primary">+{creditsEarned} EcoCredits</p>
                <p className="text-lg font-bold text-secondary">+{impactEarned} Impact Points</p>
              </div>
              <p className="text-muted-foreground text-sm">
                {detection?.category === "non-recyclable"
                  ? "This waste will be sent for responsible processing — no burning, no dumping."
                  : "Your recyclable waste has been logged for the marketplace."}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={reset}>Upload More</Button>
                <Button className="flex-1" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
