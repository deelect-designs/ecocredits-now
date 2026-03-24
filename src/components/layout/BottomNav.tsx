import { Link, useLocation } from "react-router-dom";
import { Home, Camera, Swords, Bot, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/upload", icon: Camera, label: "Upload" },
  { to: "/challenges", icon: Swords, label: "Challenges" },
  { to: "/eco-coach", icon: Bot, label: "Coach" },
  { to: "/eco-profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card border-t safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map(item => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.label} to={item.to} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <item.icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
