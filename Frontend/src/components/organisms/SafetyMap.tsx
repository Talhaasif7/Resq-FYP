import React from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

const SafetyMap: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card relative flex h-full flex-col overflow-hidden p-5"
    >
      <h2 className="mb-3 text-lg font-bold text-foreground">{t("safetyMap")}</h2>

      {/* GIS API integration point — replace this placeholder with your map provider (e.g., Mapbox, Google Maps, Leaflet) */}
      <div className="relative flex-1 rounded-2xl bg-secondary/30 overflow-hidden">
        {/* Mock map grid */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Mock markers */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute left-[30%] top-[40%] flex flex-col items-center"
        >
          <MapPin className="h-6 w-6 text-alert drop-shadow-lg" />
          <span className="mt-0.5 rounded bg-alert/80 px-1.5 py-0.5 text-[9px] font-bold text-alert-foreground">Crisis</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          className="absolute left-[60%] top-[30%] flex flex-col items-center"
        >
          <MapPin className="h-6 w-6 text-safety drop-shadow-lg" />
          <span className="mt-0.5 rounded bg-safety/80 px-1.5 py-0.5 text-[9px] font-bold text-safety-foreground">Shelter</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          className="absolute left-[50%] top-[60%] flex flex-col items-center"
        >
          <Navigation className="h-5 w-5 text-info drop-shadow-lg" />
          <span className="mt-0.5 rounded bg-info/80 px-1.5 py-0.5 text-[9px] font-bold text-info-foreground">Route</span>
        </motion.div>

        {/* Placeholder text */}
        <div className="absolute inset-0 flex items-end justify-center pb-4">
          <p className="rounded-xl bg-background/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
            {t("mapPlaceholder")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SafetyMap;
