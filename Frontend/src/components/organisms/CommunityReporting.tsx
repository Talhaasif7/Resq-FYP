import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Mic, 
  ImageIcon, 
  Send, 
  Loader2, 
  Languages, 
  MapPin, 
  Sparkles,
  Zap,
  Info,
  Radio
} from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

type ReportMode = "text" | "voice" | "image";

interface CommunityReportingProps {
  onVerification?: (result: any, newReport?: any) => void;
}

const CommunityReporting: React.FC<CommunityReportingProps> = ({ onVerification }) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<ReportMode>("text");
  const [isBilingual, setIsBilingual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionUr, setDescriptionUr] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("flood");

  const isVerifiedVolunteer = isAuthenticated && user?.role === "volunteer" && user?.verificationStatus === "verified";

  const handleSubmit = async () => {
    if (!title || !description || !location) {
      toast.error("Required fields missing", {
        description: "Please provide a title, description, and location.",
        className: "glass-card border-alert/20",
      });
      return;
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      // Send high priority trust score of 98 for volunteers, or default 70 for standard citizens
      const reporterScore = highPriority ? 98 : 70;
      
      const response = await fetch(`${apiUrl}/verify/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          description_ur: isBilingual ? descriptionUr : null,
          category,
          location,
          reporter_trust_score: reporterScore,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Verification service failed");
      }

      const result = await response.json();
      const verification = result.verification;
      const newReport = result.new_report;

      localStorage.setItem("last_ai_trust_rating", verification.ai_trust_rating.toString());
      
      if (highPriority) {
        toast.success("📢 HIGH-PRIORITY BROADCAST COMPLETE", {
          description: `Trust Rating: ${verification.ai_trust_rating}% - Incident immediately verified and broadcasted live!`,
          icon: <Radio className="h-4 w-4 text-safety animate-pulse" />,
        });
      } else {
        toast.success("AI Verification Complete", {
          description: `Trust Rating: ${verification.ai_trust_rating}% - ${verification.tier}`,
          icon: <Sparkles className="h-4 w-4 text-primary" />,
        });
      }
      
      if (onVerification) onVerification(verification, newReport);
      
      // Clear form on success
      setTitle("");
      setDescription("");
      setDescriptionUr("");
      setLocation("");
    } catch (error: any) {
      console.error(error);
      toast.error("System Error", {
        description: error.message || "Failed to process verification",
      });
    } finally {
      setLoading(false);
    }
  };

  const modes: { key: ReportMode; icon: React.ReactNode; label: string }[] = [
    { key: "text", icon: <FileText className="h-4 w-4" />, label: "Text" },
    { key: "voice", icon: <Mic className="h-4 w-4" />, label: "Voice" },
    { key: "image", icon: <ImageIcon className="h-4 w-4" />, label: "Image" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card group relative flex h-full flex-col overflow-hidden p-6 border-white/5"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-[80px] transition-all group-hover:bg-primary/20" />
      <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-secondary/10 blur-[80px] transition-all group-hover:bg-secondary/20" />

      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Zap className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">{t("communityReporting")}</h2>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsBilingual(!isBilingual)}
          className={`h-9 gap-2 rounded-full px-4 border-white/10 transition-all ${
            isBilingual 
              ? "bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]" 
              : "bg-white/5 text-muted-foreground hover:bg-white/10"
          }`}
        >
          <Languages className={`h-4 w-4 ${isBilingual ? "animate-pulse" : ""}`} />
          <span className="text-xs font-semibold">{isBilingual ? "Bilingual: ON" : "Add Urdu"}</span>
        </Button>
      </div>

      {/* Mode Selector - Premium Pill Style */}
      <div className="relative z-10 mb-6 flex gap-1 rounded-2xl bg-black/20 p-1.5 border border-white/5">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`relative flex flex-1 items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              mode === m.key
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            {mode === m.key && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-primary shadow-lg shadow-primary/20 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{m.icon}</span>
            <span className="relative z-10 hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col gap-5 overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === "text" ? (
            <motion.div
              key="text-form"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex flex-1 flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground ml-1">Incident Title</label>
                <Input
                  placeholder="e.g., Flash flood near Ravi River"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 rounded-2xl border-white/5 bg-white/5 px-4 focus-visible:ring-primary/40 focus-visible:bg-white/10 transition-all text-sm"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground ml-1">Category</label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="flex h-12 w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none cursor-pointer"
                    >
                      <option value="flood">Flood</option>
                      <option value="earthquake">Earthquake</option>
                      <option value="protest">Protest</option>
                      <option value="roadblock">Roadblock</option>
                      <option value="fire">Fire Incident</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                      <Zap className="h-3 w-3" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="City/Area"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 rounded-2xl border-white/5 bg-white/5 pl-11 pr-4 focus-visible:ring-primary/40 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="flex-1 min-h-[140px] relative group/desc">
                  <label className="absolute left-4 top-2 text-[10px] uppercase font-bold tracking-wider text-primary/60 opacity-0 group-focus-within/desc:opacity-100 transition-opacity z-20">Description</label>
                  <Textarea
                    placeholder={isBilingual ? "Detailed report in English..." : t("enterDescription")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-full min-h-[140px] resize-none rounded-2xl border-white/5 bg-white/5 p-4 pt-4 text-sm leading-relaxed focus-visible:ring-primary/40"
                  />
                </div>

                <AnimatePresence>
                  {isBilingual && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative group/urdu"
                    >
                      <label className="absolute right-4 top-2 text-[10px] uppercase font-bold tracking-wider text-primary/60 opacity-0 group-focus-within/urdu:opacity-100 transition-opacity z-20">اردو تفصیل</label>
                      <Textarea
                        placeholder="صورتحال اردو میں بیان کریں..."
                        dir="rtl"
                        value={descriptionUr}
                        onChange={(e) => setDescriptionUr(e.target.value)}
                        className="min-h-[120px] resize-none rounded-2xl border-primary/10 bg-primary/5 p-4 text-sm font-urdu leading-loose focus-visible:ring-primary/40"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : mode === "voice" ? (
            <motion.div
              key="voice-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-1 flex-col items-center justify-center rounded-3xl bg-primary/5 border border-primary/10 p-8"
            >
              <div className="relative mb-12">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                />
                <div className="relative h-20 w-20 flex items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                  <Mic className="h-10 w-10 text-primary-foreground" />
                </div>
              </div>
              <div className="flex items-end gap-1.5 h-12 mb-6">
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 rounded-full bg-primary/40"
                    animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + Math.random() * 0.4,
                      delay: i * 0.04,
                    }}
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-primary animate-pulse">Recording Audio...</p>
              <p className="text-xs text-muted-foreground mt-2">AI will transcribe and analyze sentiment</p>
            </motion.div>
          ) : (
            <motion.div
              key="image-mode"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-1 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:border-primary/30"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50 mb-4">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">Visual Evidence</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                  Upload photos for AI-powered damage assessment & location verification
                </p>
              </div>
              <Button variant="secondary" size="sm" className="mt-6 rounded-xl border-white/5">
                Browse Files
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="relative z-10 mt-8 space-y-4">
        {isBilingual && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10"
          >
            <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
              <span className="text-primary font-bold">Smart Analysis:</span> AI will compare English and Urdu versions for semantic consistency to boost the report trust score.
            </p>
          </motion.div>
        )}
        {isVerifiedVolunteer && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-safety/10 border border-safety/20 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-safety animate-pulse" />
              <div className="text-left">
                <p className="text-xs font-bold text-safety">High-Priority Volunteer Broadcast</p>
                <p className="text-[9px] text-muted-foreground">Skip verification queues and broadcast immediately</p>
              </div>
            </div>
            <button
              onClick={() => setHighPriority(!highPriority)}
              className={`relative h-6 w-11 shrink-0 rounded-full p-0.5 transition-colors focus:outline-none ${
                highPriority ? "bg-safety" : "bg-white/10 border border-white/5"
              }`}
            >
              <motion.div
                layout
                className="h-5 w-5 rounded-full bg-white shadow-md"
                animate={{ x: highPriority ? 18 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </motion.div>
        )}

        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          className="group relative w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_10px_30px_rgba(var(--primary-rgb),0.2)] transition-all active:scale-[0.98] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          
          <div className="flex items-center justify-center gap-3">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="tracking-wide">Analyzing Authenticity...</span>
              </>
            ) : (
              <>
                <span className="tracking-wide">{t("submitReport")}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  <Send className="h-4 w-4" />
                </div>
              </>
            )}
          </div>
        </Button>
      </div>
    </motion.div>
  );
};

export default CommunityReporting;
