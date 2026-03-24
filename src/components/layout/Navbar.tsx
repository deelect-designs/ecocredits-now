import { Link, useLocation } from "react-router-dom";
import { Recycle, Menu, X, LogOut, User, Map, Swords, Bot, Rocket, Trophy, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { useState } from "react";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/impact", label: "Impact" },
  { to: "/about", label: "About" },
];

const appLinks = [
  { to: "/dashboard", label: "Dashboard", icon: User },
  { to: "/eco-profile", label: "Eco Score", icon: Shield },
  { to: "/impact-map", label: "Impact Map", icon: Map },
  { to: "/challenges", label: "Challenges", icon: Swords },
  { to: "/eco-coach", label: "AI Coach", icon: Bot },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/coming-soon", label: "Coming Soon", icon: Rocket },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { isDemoMode, toggleDemoMode } = useDemo();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Recycle className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-gradient">EcoCredit</span>
          <span className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4">
          {publicLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === l.to ? "text-primary" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          {user && appLinks.slice(0, 4).map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === l.to ? "text-primary" : "text-muted-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={toggleDemoMode} className={isDemoMode ? "border-eco-orange text-eco-orange" : ""}>
            {isDemoMode ? "Exit Demo" : "Demo Mode"}
          </Button>
          {user ? (
            <>
              <Link to="/eco-profile">
                <Button variant="ghost" size="sm"><Shield className="w-4 h-4 mr-1" /> Eco Score</Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}><LogOut className="w-4 h-4" /></Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/signup"><Button size="sm">Get Started</Button></Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-card p-4 space-y-2 animate-fade-in">
          {publicLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary">
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <hr className="my-2" />
              {appLinks.map(l => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary">
                  <l.icon className="w-4 h-4" /> {l.label}
                </Link>
              ))}
            </>
          )}
          <hr className="my-2" />
          <Button variant="outline" size="sm" className="w-full" onClick={() => { toggleDemoMode(); setOpen(false); }}>
            {isDemoMode ? "Exit Demo" : "Demo Mode"}
          </Button>
          {user ? (
            <Button variant="ghost" size="sm" className="w-full" onClick={() => { signOut(); setOpen(false); }}>Logout</Button>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}><Button variant="ghost" size="sm" className="w-full">Login</Button></Link>
              <Link to="/signup" onClick={() => setOpen(false)}><Button size="sm" className="w-full">Get Started</Button></Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
