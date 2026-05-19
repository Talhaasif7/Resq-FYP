import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronDown, ShieldCheck, Loader2 } from "lucide-react";
import SeverityBadge from "@/components/atoms/SeverityBadge";
import { useTranslation } from "@/contexts/LanguageContext";
import type { Crisis } from "@/data/mockData";

interface CrisisCardProps {
  crisis: Crisis;
  index: number;
  onVote: (reportId: string, action: "upvote" | "downvote") => Promise<boolean>;
  isVolunteer: boolean;
}

const CrisisCard: React.FC<CrisisCardProps> = ({ crisis, index, onVote, isVolunteer }) => {
  const { language } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [voting, setVoting] = useState(false);

  const title = language === "ur" ? crisis.titleUr : crisis.title;
  const location = language === "ur" ? crisis.locationUr : crisis.location;
  const timeAgo = language === "ur" ? crisis.timeAgoUr : crisis.timeAgo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm transition-shadow hover:shadow-md"
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        {/* Left: severity color bar */}
        <div
          className={`mt-0.5 h-10 w-1 shrink-0 rounded-full ${
            crisis.severity === "critical"
              ? "bg-destructive"
              : crisis.severity === "high"
              ? "bg-[hsl(45,93%,47%)]"
              : "bg-primary"
          }`}
        />

        <div className="flex-1 min-w-0">
          {/* Top row: severity pill + AI badge */}
          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
            <SeverityBadge severity={crisis.severity} />
            {crisis.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                <ShieldCheck className="h-3 w-3" />
                AI Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Pending
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="text-sm font-semibold text-foreground leading-snug">{title}</h4>

          {/* Meta */}
          <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {timeAgo}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expandable details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-4 pb-4 pt-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-secondary/40 px-3 py-2">
                  <span className="text-muted-foreground">Trust Score</span>
                  <p className="mt-0.5 text-sm font-bold text-foreground">{crisis.trustScore}%</p>
                </div>
                <div className="rounded-xl bg-secondary/40 px-3 py-2">
                  <span className="text-muted-foreground">Category</span>
                  <p className="mt-0.5 text-sm font-bold capitalize text-foreground">{crisis.category}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {/* NLP API integration point — fetch detailed crisis description */}
                Detailed situational report is being processed by our AI verification system. Community volunteers are actively monitoring the area.
              </p>

              {isVolunteer && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border/40 pt-3">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    Incident Verification Engine:
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        setVoting(true);
                        await onVote(crisis.id, "upvote");
                        setVoting(false);
                      }}
                      disabled={voting}
                      className="inline-flex items-center gap-1 rounded-xl bg-safety/10 border border-safety/20 px-3 py-1.5 text-xs font-bold text-safety hover:bg-safety/20 transition-all disabled:opacity-50"
                    >
                      {voting ? <Loader2 className="h-3 w-3 animate-spin" /> : "👍"} Verify Report
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        setVoting(true);
                        await onVote(crisis.id, "downvote");
                        setVoting(false);
                      }}
                      disabled={voting}
                      className="inline-flex items-center gap-1 rounded-xl bg-alert/10 border border-alert/20 px-3 py-1.5 text-xs font-bold text-alert hover:bg-alert/20 transition-all disabled:opacity-50"
                    >
                      {voting ? <Loader2 className="h-3 w-3 animate-spin" /> : "👎"} Flag Misinfo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CrisisCard;
