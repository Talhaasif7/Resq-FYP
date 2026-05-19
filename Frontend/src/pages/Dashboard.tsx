import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { LanguageProvider, useTranslation } from "@/contexts/LanguageContext";
import VoiceLanguageSettings from "@/components/molecules/VoiceLanguageSettings";
import LiveCrisisFeed from "@/components/organisms/LiveCrisisFeed";
import AITrustPanel from "@/components/organisms/AITrustPanel";
import InteractiveMap from "@/components/organisms/InteractiveMap";
import ErrorBoundary from "@/components/ErrorBoundary";
import CommunityReporting from "@/components/organisms/CommunityReporting";
import SafeRouteSidebar from "@/components/organisms/SafeRouteSidebar";
import CrisisMapRoutes from "@/components/organisms/CrisisMapRoutes";
import VoiceAlertWaveform from "@/components/organisms/VoiceAlertWaveform";
import QuickStats from "@/components/organisms/QuickStats";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { AlertOctagon, Phone, UserCheck, X, ShieldAlert } from "lucide-react";

const DashboardContent: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [lastVerification, setLastVerification] = React.useState<any>(null);
  
  const [crises, setCrises] = React.useState<any[]>([]);
  const [loadingCrises, setLoadingCrises] = React.useState(true);
  
  // SOS States
  const [sosModalOpen, setSosModalOpen] = React.useState(false);
  const [sosCountdown, setSosCountdown] = React.useState(5);
  const sosIntervalRef = React.useRef<any>(null);

  // Fetch live crisis reports from backend
  const fetchCrises = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/verify/feed`);
      if (res.ok) {
        const data = await res.json();
        setCrises(data);
      }
    } catch (err) {
      console.error("Failed to fetch live feed:", err);
    } finally {
      setLoadingCrises(false);
    }
  };

  React.useEffect(() => {
    fetchCrises();
  }, []);

  // Sync state upvote/downvote to live backend
  const handleVote = async (reportId: string, action: "upvote" | "downvote") => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/verify/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: reportId, action })
      });
      if (res.ok) {
        const updatedReport = await res.json();
        setCrises(prev => prev.map(c => c.id === reportId ? updatedReport : c));
        toast.success(`Report verified: Trust score updated to ${updatedReport.trustScore}%`, {
          className: "glass-card border-safety/20"
        });
        return true;
      }
    } catch (err) {
      console.error("Error casting vote:", err);
      toast.error("Failed to cast vote. Try again.");
    }
    return false;
  };

  // SOS handler
  const triggerSOSSignal = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/verify/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: 33.6844,
          longitude: 73.0479,
          user_name: user?.name || "Aam Shehri (Citizen)",
          phone: user?.email || "Emergency Contact"
        })
      });
      if (res.ok) {
        toast.error("🚨 SOS TRIGGERED!", {
          description: "Emergency signals broadcasted to Rescue 1122 and all nearby ResQ Volunteers.",
          duration: 8000,
        });
      }
    } catch (err) {
      console.error("SOS trigger error:", err);
    }
  };

  const startSOSCountdown = () => {
    setSosCountdown(5);
    setSosModalOpen(true);
    
    if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
    
    sosIntervalRef.current = setInterval(() => {
      setSosCountdown(prev => {
        if (prev <= 1) {
          clearInterval(sosIntervalRef.current);
          setSosModalOpen(false);
          triggerSOSSignal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    if (sosIntervalRef.current) {
      clearInterval(sosIntervalRef.current);
    }
    setSosModalOpen(false);
    toast.info("SOS countdown cancelled.");
  };

  React.useEffect(() => {
    return () => {
      if (sosIntervalRef.current) clearInterval(sosIntervalRef.current);
    };
  }, []);

  const isVerifiedVolunteer = isAuthenticated && user?.role === "volunteer" && user?.verificationStatus === "verified";

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0%,transparent_70%)] -z-10" />

      {/* header remains same */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        {/* Header content */}
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 lg:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground tracking-tight">{t("appName")}</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="flex w-full items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-2.5 focus-within:border-primary/30 transition-all">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("search")}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Glowing SOS Button for Citizens */}
            {(!isAuthenticated || user?.role === "citizen") && (
              <button
                onClick={startSOSCountdown}
                className="relative inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-black bg-destructive text-destructive-foreground hover:bg-destructive/95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse"
              >
                <ShieldAlert className="h-3.5 w-3.5 mr-1" />
                SOS EMERGENCY
              </button>
            )}

            {/* Volunteer Badge */}
            {isVerifiedVolunteer && (
              <div className="inline-flex items-center gap-1 rounded-full border border-safety/20 bg-safety/10 px-2.5 py-1 text-[10px] font-bold text-safety tracking-wide shadow-sm">
                <UserCheck className="h-3 w-3" />
                VERIFIED VOLUNTEER
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Link to="/shelters" className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-foreground transition-all">Shelters</Link>
              <Link to="/qa" className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-foreground transition-all">Q&A</Link>
            </div>
            <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />
            <ThemeToggle />
            <VoiceLanguageSettings />
            {isAuthenticated ? (
              <Link to="/profile">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 text-xs font-black text-primary shadow-lg shadow-primary/10">
                  {user?.name?.[0] || "U"}
                </div>
              </Link>
            ) : (
              <Link to="/signin">
                <Button size="sm" variant="outline" className="text-xs rounded-xl border-white/10">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Bento Grid Dashboard */}
      <main className="mx-auto max-w-[1600px] p-4 lg:p-6 relative z-10">
        <div className="grid gap-4 lg:gap-6">
          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            <div className="md:col-span-2 min-h-[400px]">
              <LiveCrisisFeed 
                crises={crises} 
                loading={loadingCrises} 
                onVote={handleVote} 
                isVolunteer={isVerifiedVolunteer} 
              />
            </div>
            <div className="min-h-[400px]">
              <AITrustPanel 
                score={lastVerification?.ai_trust_rating} 
                tier={lastVerification?.tier}
                analysis={lastVerification?.analysis}
                recommendation={lastVerification?.recommendation}
              />
            </div>
          </div>

          {/* Crisis Map & Safe Routes — full width */}
          <div className="min-h-[420px]">
            <CrisisMapRoutes />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            <div className="min-h-[350px]">
              <ErrorBoundary>
                <InteractiveMap />
              </ErrorBoundary>
            </div>
            <div className="min-h-[350px]">
              <CommunityReporting 
                onVerification={(res, newReport) => {
                  setLastVerification(res);
                  if (newReport) {
                    setCrises(prev => [newReport, ...prev]);
                  }
                }} 
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
            <div className="min-h-[300px]">
              <SafeRouteSidebar />
            </div>
            <div className="min-h-[300px]">
              <VoiceAlertWaveform />
            </div>
            <div className="min-h-[300px]">
              <QuickStats />
            </div>
          </div>
        </div>
      </main>

      {/* Premium Glassmorphic SOS Countdown Overlay */}
      <AnimatePresence>
        {sosModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-destructive/20 bg-card p-8 text-center shadow-2xl"
            >
              {/* Radar Pulsing Circle */}
              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive/15 opacity-75" />
                <span className="absolute inline-flex h-20 w-20 animate-pulse rounded-full bg-destructive/20" />
                <AlertOctagon className="relative h-12 w-12 text-destructive" />
              </div>

              <h2 className="mb-2 font-display text-2xl font-black text-destructive tracking-wide uppercase">
                EMERGENCY SOS INITIATED
              </h2>
              <p className="mb-6 text-sm text-muted-foreground">
                Broadcasting your emergency location to nearby rescue services and volunteers in...
              </p>

              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-destructive/20 bg-destructive/5 font-display text-4xl font-black text-destructive">
                {sosCountdown}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={cancelSOS}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-foreground hover:bg-white/10 transition-all"
                >
                  Cancel SOS
                </button>
                <a
                  href="tel:1122"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-destructive py-3 text-sm font-bold text-destructive-foreground hover:bg-destructive/90 transition-all"
                >
                  <Phone className="h-4 w-4" />
                  Call 1122
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dashboard: React.FC = () => (
  <LanguageProvider>
    <DashboardContent />
  </LanguageProvider>
);

export default Dashboard;
