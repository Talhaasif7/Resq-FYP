import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Home, Navigation } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { mockStats } from "@/data/mockData";

const stats = [
  { key: "activeCrises" as const, icon: AlertTriangle, color: "text-alert", value: mockStats.activeCrises },
  { key: "verifiedReports" as const, icon: ShieldCheck, color: "text-safety", value: mockStats.verifiedReports },
  { key: "sheltersOpen" as const, icon: Home, color: "text-trust", value: mockStats.sheltersOpen },
  { key: "routesUpdated" as const, icon: Navigation, color: "text-info", value: mockStats.routesUpdated },
];

const QuickStats: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card flex h-full flex-col p-5"
    >
      <h2 className="mb-4 text-lg font-bold text-foreground">{t("quickStats")}</h2>
      <div className="grid flex-1 grid-cols-2 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="flex flex-col items-center justify-center rounded-2xl bg-secondary/30 p-3"
          >
            <stat.icon className={`mb-1 h-5 w-5 ${stat.color}`} />
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            <span className="text-[10px] text-center text-muted-foreground">{t(stat.key)}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickStats;
