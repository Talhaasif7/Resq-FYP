import React from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

const SOSButton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="sos-pulse relative z-50 flex h-16 w-16 items-center justify-center rounded-full bg-alert text-alert-foreground shadow-2xl"
      aria-label={t("sosEmergency")}
    >
      <Phone className="h-7 w-7" />
    </motion.button>
  );
};

export default SOSButton;
