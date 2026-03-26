import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoProvider } from "@/contexts/DemoContext";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";

import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import ImpactPage from "./pages/ImpactPage";
import AboutPage from "./pages/AboutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Convert from "./pages/Convert";
import Leaderboard from "./pages/Leaderboard";
import ProfilePage from "./pages/Profile";
import EcoProfile from "./pages/EcoProfile";
import ImpactMap from "./pages/ImpactMap";
import Challenges from "./pages/Challenges";
import EcoCoach from "./pages/EcoCoach";
import ComingSoon from "./pages/ComingSoon";
import Missions from "./pages/Missions";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DemoProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/impact" element={<ImpactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/convert" element={<Convert />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/eco-profile" element={<EcoProfile />} />
              <Route path="/impact-map" element={<ImpactMap />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/eco-coach" element={<EcoCoach />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </BrowserRouter>
        </TooltipProvider>
      </DemoProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
