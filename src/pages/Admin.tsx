import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Users, Recycle, Coins, ShieldCheck } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ users: 0, submissions: 0, totalCredits: 0 });
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    // Check admin role
    supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").then(({ data }) => {
      setIsAdmin(!!data && data.length > 0);
    });

    // Fetch stats
    supabase.from("profiles").select("total_credits").then(({ data }) => {
      if (data) {
        setStats(prev => ({
          ...prev,
          users: data.length,
          totalCredits: data.reduce((s, p) => s + (p.total_credits ?? 0), 0),
        }));
      }
    });

    supabase.from("waste_submissions").select("*").order("created_at", { ascending: false }).limit(10).then(({ data }) => {
      if (data) {
        setStats(prev => ({ ...prev, submissions: data.length }));
        setRecentSubmissions(data);
      }
    });
  }, [user]);

  if (!isAdmin) {
    return (
      <div className="container max-w-md mx-auto py-16 text-center">
        <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-xl font-bold">Admin Access Required</h1>
        <p className="text-sm text-muted-foreground mt-2">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8">
      <div className="container max-w-4xl mx-auto py-6 space-y-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>

        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4 flex flex-col items-center gap-1">
              <Users className="w-6 h-6 text-secondary" />
              <span className="text-xl font-extrabold">{stats.users}</span>
              <span className="text-[10px] text-muted-foreground">Total Users</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center gap-1">
              <Recycle className="w-6 h-6 text-primary" />
              <span className="text-xl font-extrabold">{stats.submissions}</span>
              <span className="text-[10px] text-muted-foreground">Submissions</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center gap-1">
              <Coins className="w-6 h-6 text-eco-yellow" />
              <span className="text-xl font-extrabold">{stats.totalCredits}</span>
              <span className="text-[10px] text-muted-foreground">Credits Issued</span>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No submissions yet.</p>
            ) : (
              <div className="space-y-2">
                {recentSubmissions.map((sub: any) => (
                  <div key={sub.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                    <div>
                      <p className="font-medium">{sub.waste_type}</p>
                      <p className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleString()}</p>
                    </div>
                    <span className="font-bold text-primary">+{sub.credits_earned}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
