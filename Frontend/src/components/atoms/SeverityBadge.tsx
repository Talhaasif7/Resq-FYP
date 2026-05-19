import React from "react";
import { cn } from "@/lib/utils";

interface SeverityBadgeProps {
  severity: "critical" | "high" | "moderate";
  verified?: boolean;
}

const severityConfig = {
  critical: { label: "Critical", className: "bg-alert/20 text-alert border-alert/30" },
  high: { label: "High", className: "bg-trust/20 text-trust border-trust/30" },
  moderate: { label: "Moderate", className: "bg-info/20 text-info border-info/30" },
};

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const config = severityConfig[severity];
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", config.className)}>
      {config.label}
    </span>
  );
};

export default SeverityBadge;
