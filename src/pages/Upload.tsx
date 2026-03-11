import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { supabase } from "@/integrations/supabase/client";
import { simulateAIDetection, calculateCredits } from "@/lib/credits";
import { Camera, Upload as UploadIcon, MapPin, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Step = "upload" | "detecting" | "result" | "confirmed";

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
  const [detection, setDetection] = useState<{ wasteType: string; confidence: number } | null>(null);
  const [creditsEarned, setCreditsEarned] = useState(0);
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
    // Simulate AI processing delay
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
      setCreditsEarned(credits);

      if (!isDemoMode && user) {
        // Upload image if present
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

        // Insert submission
        await supabase.from("waste_submissions").insert({
          user_id: user.id,
          waste_type: detection!.wasteType,
          quantity,
          credits_earned: credits,
          confidence_score: detection!.confidence,
          image_url: imageUrl,
          location,
        });

        // Insert credit transaction
        await supabase.from("credit_transactions").insert({
          user_id: user.id,
          type: "earn",
          amount: credits,
          description: `${detection!.wasteType} x${quantity}`,
        });

        // Update total credits
        await supabase.from("profiles").update({
          total_credits: (await supabase.from("profiles").select("total_credits").eq("id", user.id).single()).data!.total_credits + credits,
        }).eq("id", user.id);

        await refreshProfile();
      }

      setStep("confirmed");
      toast.success(`You earned ${credits} EcoCredits!`);
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
  };

  // Get user location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
        () => setLocation("Location unavailable")
      );
    }
  };

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-md mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Upload Waste</h1>

        {step === "upload" && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {/* Image upload */}
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
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

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium">Quantity (units)</label>
                <Input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="mt-1" />
              </div>

              {/* Location */}
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
                <Sparkles className="w-4 h-4" /> Detect Waste with AI
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
              <p className="text-sm text-muted-foreground">Identifying waste type and quality</p>
            </CardContent>
          </Card>
        )}

        {step === "result" && detection && (
          <Card className="gradient-card border-0">
            <CardContent className="p-6 space-y-4 text-center">
              <Sparkles className="w-10 h-10 text-primary mx-auto" />
              <h2 className="text-xl font-bold">AI Detection Result</h2>
              <div className="bg-card rounded-xl p-4 space-y-2">
                <p className="text-lg font-bold">{detection.wasteType}</p>
                <p className="text-sm text-muted-foreground">Confidence: <span className="font-semibold text-primary">{detection.confidence}%</span></p>
              </div>
              <p className="text-sm text-muted-foreground">Quantity: {quantity} units</p>
              <p className="text-lg font-bold text-primary">Estimated: {calculateCredits(detection.wasteType, quantity)} EcoCredits</p>
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
              <p className="text-3xl font-extrabold text-primary">+{creditsEarned} EcoCredits</p>
              <p className="text-muted-foreground">Your waste submission has been recorded</p>
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
