import React from "react";

const LiveIndicator: React.FC<{ label?: string }> = ({ label = "LIVE" }) => (
  <div className="flex items-center gap-1.5">
    <span className="relative flex h-2.5 w-2.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-alert" />
    </span>
    <span className="text-xs font-bold uppercase tracking-wider text-alert">{label}</span>
  </div>
);

export default LiveIndicator;
