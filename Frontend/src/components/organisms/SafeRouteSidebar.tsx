import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, XCircle, Clock, Ruler } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { mockRoutes } from "@/data/mockData";

const SafeRouteSidebar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card flex h-full flex-col p-5"
    >
      <h2 className="mb-4 text-lg font-bold text-foreground">{t("safeRoutes")}</h2>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {mockRoutes.map((route, i) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="rounded-2xl bg-secondary/30 p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              {route.status === "clear" ? (
                <CheckCircle className="h-4 w-4 text-safety" />
              ) : (
                <XCircle className="h-4 w-4 text-alert" />
              )}
              <span className="text-sm font-medium text-foreground">
                {route.from}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {route.to}
              </span>
              <span
                className={`ms-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  route.status === "clear"
                    ? "bg-safety/20 text-safety"
                    : "bg-alert/20 text-alert"
                }`}
              >
                {route.status === "clear" ? t("clear") : t("blocked")}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Ruler className="h-3 w-3" />{route.distance}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{route.time}</span>
            </div>
            {route.reason && (
              <p className="mt-1 text-[10px] text-alert/80">{route.reason}</p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SafeRouteSidebar;
