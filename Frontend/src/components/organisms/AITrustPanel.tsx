import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Globe, 
  History, 
  Sparkles,
  Zap,
  Activity,
  Shield
} from "lucide-react";
import TrustRing from "@/components/atoms/TrustRing";
import { useTranslation } from "@/contexts/LanguageContext";

interface AITrustPanelProps {
  score?: number;
  tier?: string;
  analysis?: {
    linguistic?: { score: number };
    nlp?: { score: number };
    historical?: { score: number };
    consistency?: { score: number };
  };
  recommendation?: string;
}

const AITrustPanel: React.FC<AITrustPanelProps> = ({ 
  score, 
  tier, 
  analysis,
  recommendation 
}) => {
  const { t } = useTranslation();
  
  const isInitial = score === undefined;
  const displayScore = score ?? 0;
  const displayTier = tier ?? "Waiting";

  const getTierConfig = (t: string) => {
    switch(t) {
      case "Verified": 
        return { color: "text-safety", bg: "bg-safety/10", border: "border-safety/20", icon: CheckCircle2 };
      case "Needs Review": 
        return { color: "text-trust", bg: "bg-trust/10", border: "border-trust/20", icon: AlertTriangle };
      case "Waiting": 
        return { color: "text-muted-foreground", bg: "bg-white/5", border: "border-white/10", icon: Activity };
      default: 
        return { color: "text-alert", bg: "bg-alert/10", border: "border-alert/20", icon: Shield };
    }
  };

  const tierConfig = getTierConfig(displayTier);

  const layers = [
    { name: "Linguistic", score: analysis?.linguistic?.score ?? 85, icon: Zap, desc: "Linguistic authenticity" },
    { name: "NLP Model", score: analysis?.nlp?.score ?? 92, icon: ShieldCheck, desc: "Neural consistency" },
    { name: "Historical", score: analysis?.historical?.score ?? 78, icon: History, desc: "Regional plausibility" },
    { name: "Bilingual", score: analysis?.consistency?.score ?? 95, icon: Globe, desc: "Semantic alignment" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card relative flex h-full flex-col overflow-hidden p-6 border-white/5"
    >
      {/* Premium Accents */}
      <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">{t("aiTrustScore")}</h2>
        </div>
        
        <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${tierConfig.bg} ${tierConfig.color} ${tierConfig.border}`}>
          <tierConfig.icon className={`h-3 w-3 ${displayTier === "Waiting" ? "animate-pulse" : ""}`} />
          {displayTier}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-4">
        <div className="relative">
          {/* Pulsing ring background */}
          {!isInitial && (
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
            />
          )}
          <TrustRing 
            percentage={displayScore} 
            size={160} 
            strokeWidth={12} 
            className="drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-foreground">{Math.round(displayScore)}%</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Confidence</span>
            </div>
          </TrustRing>
        </div>

        <div className="mt-8 text-center max-w-[280px]">
          <p className="text-sm font-medium leading-relaxed text-foreground/90">
            {isInitial 
              ? "Awaiting incident report for deep-layered AI verification analysis." 
              : (recommendation || "Our neural models indicate high reliability based on cross-verification.")}
          </p>
          {!isInitial && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              <Activity className="h-3 w-3" />
              Live Verification Feed Active
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-10 space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Neural Analysis Layers</h3>
        <div className="grid grid-cols-2 gap-3">
          {layers.map((layer, index) => (
            <motion.div 
              key={layer.name} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`group flex flex-col gap-2 rounded-2xl p-4 transition-all duration-500 border border-transparent ${
                isInitial 
                  ? "bg-white/5 opacity-40" 
                  : "bg-white/5 hover:bg-white/10 hover:border-white/10 hover:translate-y-[-2px]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground group-hover:text-primary transition-colors">
                  <layer.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-black text-foreground">{isInitial ? "--" : `${Math.round(layer.score)}%`}</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-foreground mb-0.5">{layer.name}</p>
                <p className="text-[9px] text-muted-foreground leading-none">{layer.desc}</p>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/30 p-[1px]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isInitial ? 0 : `${layer.score}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" 
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AITrustPanel;
