import React from "react";
import { motion } from "framer-motion";

interface TrustRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

const TrustRing: React.FC<TrustRingProps> = ({ percentage, size = 48, strokeWidth = 4, className, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color =
    percentage >= 80
      ? "hsl(var(--safety))"
      : percentage >= 50
      ? "hsl(var(--trust))"
      : "hsl(var(--alert))";

  return (
    <div className={`relative flex items-center justify-center ${className || ""}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      {children ? children : (
        <span className="absolute text-xs font-bold text-foreground">{percentage}%</span>
      )}
    </div>
  );
};

export default TrustRing;
