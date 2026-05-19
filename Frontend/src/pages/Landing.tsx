import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  ArrowRight,
  Radio,
  MapPin,
  Users,
  Brain,
  Volume2,
  Navigation,
  Phone,
  ChevronRight,
  Zap,
  Globe,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Layers,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

const float3D = {
  initial: { rotateX: 8, rotateY: -5, scale: 0.95, opacity: 0 },
  animate: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    opacity: 1,
    transition: { duration: 1, ease: "easeOut" as const },
  },
};

const features = [
  {
    icon: Radio,
    title: "Live Crisis Feed",
    description: "Real-time AI-verified alerts for floods, earthquakes, and security incidents across Pakistan.",
    color: "text-alert",
    bg: "bg-alert/10",
    gradient: "from-alert/20 to-alert/5",
  },
  {
    icon: Brain,
    title: "AI Trust Scoring",
    description: "Every report is verified by AI with a trust percentage, filtering noise from genuine crises.",
    color: "text-trust",
    bg: "bg-trust/10",
    gradient: "from-trust/20 to-trust/5",
  },
  {
    icon: MapPin,
    title: "Interactive Safety Map",
    description: "GIS-powered maps showing shelters, danger zones, and evacuation routes in your area.",
    color: "text-safety",
    bg: "bg-safety/10",
    gradient: "from-safety/20 to-safety/5",
  },
  {
    icon: Users,
    title: "Community Reporting",
    description: "Submit reports via text, voice, or image. Crowdsourced intelligence for faster response.",
    color: "text-primary",
    bg: "bg-primary/10",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Navigation,
    title: "Safe Route Navigation",
    description: "Real-time alternative routes with clear/blocked status and estimated travel times.",
    color: "text-info",
    bg: "bg-info/10",
    gradient: "from-info/20 to-info/5",
  },
  {
    icon: Volume2,
    title: "Multilingual Voice Alerts",
    description: "Audio alerts in Urdu and English for maximum accessibility.",
    color: "text-primary",
    bg: "bg-primary/10",
    gradient: "from-primary/20 to-primary/5",
  },
];

const stats = [
  { value: "50M+", label: "People Protected", icon: Users },
  { value: "99.7%", label: "Uptime", icon: Activity },
  { value: "847", label: "Verified Reports Today", icon: ShieldCheck },
  { value: "< 30s", label: "Alert Delivery", icon: Zap },
];

const Landing: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [liveScore, setLiveScore] = React.useState<number | null>(null);

  React.useEffect(() => {
    const savedScore = localStorage.getItem("last_ai_trust_rating");
    if (savedScore) {
      setLiveScore(parseInt(savedScore, 10));
    } else if (isAuthenticated && user && user.trustScore > 0) {
      setLiveScore(user.trustScore);
    }
  }, [isAuthenticated, user]);

  const displayScore = liveScore !== null ? liveScore : 87;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  const tier = displayScore >= 80 ? "Verified" : displayScore >= 40 ? "Needs Review" : "Flagged";
  const badgeColor = displayScore >= 80 
    ? "border-safety/20 bg-safety/10 text-safety" 
    : displayScore >= 40 
    ? "border-trust/20 bg-trust/10 text-trust" 
    : "border-alert/20 bg-alert/10 text-alert";

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.6 }}
              style={{ perspective: 600 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25"
            >
              <Shield className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="font-display text-xl font-bold text-foreground">ResQ</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
            <Link to="/shelters" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Shelters</Link>
            <Link to="/qa" className="text-sm text-muted-foreground transition-colors hover:text-foreground">Q&A</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Dashboard
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/profile">
                <Button size="sm" className="gap-1.5">Profile</Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button size="sm" className="gap-1.5">
                  Get Started <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 top-20 h-[400px] w-[400px] rounded-full bg-safety/8 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-10 h-[300px] w-[300px] rounded-full bg-trust/8 blur-[100px]"
          />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-20 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Real-Time Crisis Intelligence for Pakistan
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-7xl"
            >
              Stay Safe.{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-trust bg-clip-text text-transparent">
                Stay Informed.
              </span>
              <br />
              Stay Connected.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground lg:text-xl"
            >
              ResQ is Pakistan's AI-powered crisis alert platform. Get real-time verified alerts,
              find safe routes, and report emergencies — all in one place, in your language.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 rounded-xl px-8 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                  Open Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2 rounded-xl px-8 text-base">
                <Phone className="h-4 w-4" />
                Emergency SOS
              </Button>
            </motion.div>
          </div>

          {/* Hero visual — Aurora glass dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto mt-24 max-w-6xl"
          >
            {/* Subtle accent glow */}
            <div className="pointer-events-none absolute -inset-6 -z-10">
              <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />
              <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-trust/15 blur-[100px]" />
            </div>

            {/* Crisp dashboard frame */}
            <div className="relative overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_30px_80px_-20px_hsl(var(--primary)/0.25)]">
              <div className="p-5 sm:p-6">
                {/* Top status bar */}
                <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-alert/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-trust/60" />
                      <span className="h-2.5 w-2.5 rounded-full bg-safety/60" />
                    </div>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      resq.live / dashboard
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-safety/20 bg-safety/10 px-2.5 py-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safety opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-safety" />
                    </span>
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-safety">
                      All Systems Operational
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-12">
                  {/* Live crisis feed */}
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="space-y-3 rounded-2xl border border-border/40 bg-gradient-to-br from-secondary/60 to-secondary/10 p-4 lg:col-span-7"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-alert opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-alert" />
                        </span>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-alert">Live</span>
                        <span className="text-xs font-medium text-foreground">Crisis Feed</span>
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">Updated 2s ago</span>
                    </div>

                    {[
                      { trust: 97, severity: "Critical", color: "alert", title: "Flash Flood — Swat Valley", meta: "KP · 2 min ago", Icon: AlertTriangle },
                      { trust: 92, severity: "High", color: "trust", title: "Earthquake 4.8M — Quetta", meta: "Balochistan · 8 min ago", Icon: Activity },
                      { trust: 88, severity: "Moderate", color: "info", title: "Road Blockage — M-2 Motorway", meta: "Punjab · 14 min ago", Icon: Navigation },
                    ].map((item, i) => {
                      const sevClasses =
                        item.color === "alert"
                          ? "bg-alert/10 text-alert"
                          : item.color === "trust"
                          ? "bg-trust/10 text-trust"
                          : "bg-info/10 text-info";
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.12 }}
                          className="group flex items-center gap-3 rounded-xl border border-border/40 bg-card/90 p-3 transition-all hover:border-primary/30 hover:shadow-md"
                        >
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <item.Icon className="h-4 w-4 text-primary" />
                            <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-card bg-safety px-1 font-mono text-[8px] font-bold text-safety-foreground">
                              {item.trust}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-foreground">{item.title}</p>
                            <p className="font-mono text-[10px] text-muted-foreground">{item.meta}</p>
                          </div>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${sevClasses}`}>
                            {item.severity}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Right column — AI Trust + Mini stats */}
                  <div className="space-y-4 lg:col-span-5">
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-primary/10 via-trust/5 to-transparent p-5"
                    >
                      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                      <motion.div
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                        className="relative mb-2 flex h-20 w-20 items-center justify-center"
                      >
                        <svg className="-rotate-90" width="80" height="80">
                          <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
                          <motion.circle
                            cx="40"
                            cy="40"
                            r="34"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                          />
                        </svg>
                        <span className="absolute font-display text-xl font-bold text-foreground">{displayScore}%</span>
                      </motion.div>
                      <span className="text-xs font-semibold text-foreground">AI Trust Score</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Cross-verified</span>
                      <div className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${badgeColor}`}>
                        <CheckCircle className="h-3 w-3" />
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider">{tier}</span>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { Icon: Users, label: "Reports", value: "847", accent: "text-primary", bg: "bg-primary/10" },
                        { Icon: Globe, label: "Regions", value: "24", accent: "text-trust", bg: "bg-trust/10" },
                      ].map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.1 + i * 0.1 }}
                          className="rounded-xl border border-border/40 bg-card/80 p-3"
                        >
                          <div className={`mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg ${s.bg}`}>
                            <s.Icon className={`h-3.5 w-3.5 ${s.accent}`} />
                          </div>
                          <p className="font-display text-lg font-bold leading-none text-foreground">{s.value}</p>
                          <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating side chips */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: "transform" }}
              className="absolute -left-6 top-16 hidden items-center gap-2.5 rounded-2xl border border-border bg-card p-3 shadow-xl shadow-safety/10 lg:flex"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-safety/10">
                <Navigation className="h-4 w-4 text-safety" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground">Safe Route Found</p>
                <p className="font-mono text-[9px] text-muted-foreground">via GT Road · 12 min</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ willChange: "transform" }}
              className="absolute -right-4 bottom-20 hidden items-center gap-2.5 rounded-2xl border border-border bg-card p-3 shadow-xl shadow-alert/10 lg:flex"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-alert/10">
                <AlertTriangle className="h-4 w-4 text-alert" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground">Flash Flood Alert</p>
                <p className="font-mono text-[9px] text-muted-foreground">Swat Valley · 2 min ago</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{ willChange: "transform" }}
              className="absolute -bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2 shadow-xl shadow-primary/10 md:flex"
            >
              <Volume2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-[11px] font-medium text-foreground">Voice alerts in</span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">Urdu · EN</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-border/50 bg-card/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-20 lg:grid-cols-4 lg:px-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group relative text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotateY: 5 }}
                className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-shadow hover:shadow-lg"
              >
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-display text-3xl font-bold text-foreground lg:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <Layers className="h-3.5 w-3.5" />
              Platform Features
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Everything You Need in a Crisis
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for Pakistan's unique challenges — from floods to earthquakes, ResQ keeps you
              informed with AI-verified intelligence and community-powered reporting.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{
                  scale: 1.03,
                  rotateX: -2,
                  rotateY: 3,
                  transition: { type: "spring", stiffness: 300 },
                }}
                style={{ perspective: 800, transformStyle: "preserve-3d" }}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Gradient accent on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} shadow-sm`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-y border-border/50 bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              <Zap className="h-3.5 w-3.5" />
              How It Works
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              From Report to Response in Seconds
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Report or Detect",
                description: "Citizens report incidents via text, voice, or image. AI also monitors official feeds and sensors.",
                icon: AlertTriangle,
                color: "text-alert",
                bg: "bg-alert/10",
              },
              {
                step: "02",
                title: "AI Verifies",
                description: "Our NLP engine cross-references reports, assigns trust scores, and filters false alarms in real-time.",
                icon: ShieldCheck,
                color: "text-trust",
                bg: "bg-trust/10",
              },
              {
                step: "03",
                title: "Alert & Navigate",
                description: "Verified alerts go live instantly. Safe routes update. Voice alerts broadcast in your language.",
                icon: Globe,
                color: "text-safety",
                bg: "bg-safety/10",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                className="relative rounded-2xl border border-border/50 bg-card p-8 text-center transition-shadow hover:shadow-xl"
              >
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <span className="font-display text-sm font-bold text-primary">{item.step}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                {i < 2 && (
                  <div className="absolute -right-7 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                    <ChevronRight className="h-8 w-8 text-primary/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-info px-8 py-16 text-center shadow-2xl shadow-primary/20 sm:px-16"
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/5 blur-3xl" />
              {/* Animated particles */}
              <motion.div
                animate={{ y: [-20, 20, -20], x: [0, 10, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute left-1/4 top-1/4 h-2 w-2 rounded-full bg-white/20"
              />
              <motion.div
                animate={{ y: [20, -20, 20], x: [0, -15, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute right-1/3 bottom-1/3 h-3 w-3 rounded-full bg-white/15"
              />
            </div>
            <div className="relative">
              <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl lg:text-5xl">
                Ready to Stay Protected?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
                Join millions of Pakistanis who rely on ResQ for real-time crisis alerts,
                safe navigation, and community-powered safety.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary" className="gap-2 rounded-xl px-8 text-base font-semibold shadow-lg">
                    Open Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="ghost" className="gap-2 rounded-xl px-8 text-base text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                    Learn More
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 md:flex-row md:justify-between lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">ResQ</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <Link to="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
            <Link to="/shelters" className="transition-colors hover:text-foreground">Shelters</Link>
            <Link to="/qa" className="transition-colors hover:text-foreground">Q&A</Link>
            <Link to="/signin" className="transition-colors hover:text-foreground">Sign In</Link>
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ResQ. Protecting Pakistan.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
