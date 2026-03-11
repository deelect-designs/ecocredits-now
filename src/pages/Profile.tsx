import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { User, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { profile, updateProfile, signOut } = useAuth();
  const [name, setName] = useState(profile?.name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, phone, city });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-md mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Card>
          <CardHeader>
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-accent-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              <Input value={city} onChange={e => setCity(e.target.value)} className="mt-1" />
            </div>
            <Button className="w-full gradient-primary border-0 text-primary-foreground gap-2" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
            </Button>
            <Button variant="outline" className="w-full" onClick={signOut}>Sign Out</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
