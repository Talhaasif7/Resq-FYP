import React, { useState } from "react";
import LiveIndicator from "@/components/atoms/LiveIndicator";
import CrisisCard from "@/components/molecules/CrisisCard";
import CrisisCardSkeleton from "@/components/molecules/CrisisCardSkeleton";
import { useTranslation } from "@/contexts/LanguageContext";
import type { Crisis } from "@/data/mockData";

interface LiveCrisisFeedProps {
  crises: Crisis[];
  loading: boolean;
  onVote: (reportId: string, action: "upvote" | "downvote") => Promise<boolean>;
  isVolunteer: boolean;
}

const categories = ["all", "floods", "earthquakes", "security"] as const;

const LiveCrisisFeed: React.FC<LiveCrisisFeedProps> = ({ crises, loading, onVote, isVolunteer }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("all");

  const filtered = activeTab === "all"
    ? crises
    : crises.filter((c) => c.category === activeTab);

  const tabLabels: Record<string, string> = {
    all: t("all"),
    floods: t("floods"),
    earthquakes: t("earthquakes"),
    security: t("security"),
  };

  return (
    <div className="glass-card flex h-full flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">{t("liveFeed")}</h2>
          <LiveIndicator label={t("live")} />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTab === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            }`}
          >
            {tabLabels[cat]}
          </button>
        ))}
      </div>

      {/* Crisis list */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CrisisCardSkeleton key={i} />)
          : filtered.length === 0
          ? (
            <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
              No reports active in this category.
            </div>
          )
          : filtered.map((crisis, i) => (
              <CrisisCard 
                key={crisis.id} 
                crisis={crisis} 
                index={i} 
                onVote={onVote} 
                isVolunteer={isVolunteer} 
              />
            ))}
      </div>
    </div>
  );
};

export default LiveCrisisFeed;
