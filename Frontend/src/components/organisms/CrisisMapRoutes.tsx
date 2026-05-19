import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Map,
  Navigation,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Ruler,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CrisisMapRoutes: React.FC = () => {
  const [mapInitialized, setMapInitialized] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card flex h-full flex-col overflow-hidden p-0"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Map className="h-5 w-5 text-primary" />
          Crisis Map & Safe Routes
        </h2>
      </div>

      <div className="grid flex-1 grid-cols-1 md:grid-cols-5">
        {/* Map Area — 60% */}
        <div className="relative col-span-1 md:col-span-3 min-h-[300px] md:min-h-0">
          {/* Grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

          {/* Decorative markers */}
          {!mapInitialized && (
            <>
              <div className="absolute left-[25%] top-[30%] h-3 w-3 rounded-full bg-destructive/40 ring-4 ring-destructive/10" />
              <div className="absolute left-[55%] top-[50%] h-3 w-3 rounded-full bg-destructive/40 ring-4 ring-destructive/10" />
              <div className="absolute left-[40%] top-[65%] h-3 w-3 rounded-full bg-primary/50 ring-4 ring-primary/10" />
              <div className="absolute left-[70%] top-[35%] h-3 w-3 rounded-full bg-primary/50 ring-4 ring-primary/10" />
            </>
          )}

          {/* Center overlay */}
          {mapInitialized ? (
            <iframe
              title="Crisis Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.8%2C33.5%2C73.3%2C33.8&layer=mapnik&marker=33.6844%2C73.0479"
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={() => setMapInitialized(true)}
                size="lg"
                className="gap-2.5 rounded-2xl px-6 py-5 text-sm font-bold shadow-lg"
              >
                <Map className="h-5 w-5" />
                Initialize Interactive Map
              </Button>
            </div>
          )}
        </div>

        {/* Route Panel — 40% */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-4 border-t border-border p-5 md:border-l md:border-t-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Route Comparison
          </p>

          {/* Current Route — High Risk */}
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-destructive/15">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Current Route</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-destructive">
                  High Risk
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> 45 min
              </span>
              <span className="flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5" /> 12.4 km
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-destructive/80">
              Passes through active flood zone near GT Road, Rawalpindi. Road blockages reported.
            </p>
          </div>

          {/* Recommended Safe Route */}
          <div className="rounded-2xl border-2 border-primary/40 bg-primary/5 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Recommended Safe Route</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Verified Safe
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> 58 min
              </span>
              <span className="flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5" /> 18.7 km
              </span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              Via Islamabad Expressway — avoids all flagged zones. Verified by 3 community reports.
            </p>
            <Button className="mt-3 w-full gap-2 rounded-2xl" size="sm">
              <Navigation className="h-4 w-4" />
              Navigate
              <ChevronRight className="ml-auto h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CrisisMapRoutes;
