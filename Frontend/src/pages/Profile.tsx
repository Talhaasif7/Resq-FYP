import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Shield, User, Mail, MapPin, CheckCircle, Clock, XCircle, LogOut, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const Profile: React.FC = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Please sign in to view your profile</p>
          <Link to="/signin"><Button>Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    verified: { icon: CheckCircle, color: "text-safety", bg: "bg-safety/10", label: "Verified Volunteer" },
    pending: { icon: Clock, color: "text-trust", bg: "bg-trust/10", label: "Pending Review" },
    rejected: { icon: XCircle, color: "text-alert", bg: "bg-alert/10", label: "Rejected" },
    unsubmitted: { icon: User, color: "text-muted-foreground", bg: "bg-secondary", label: "Not Submitted" },
  };

  const st = statusConfig[user.verificationStatus];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      <nav className="fixed left-0 right-0 top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary"><Shield className="h-4 w-4 text-primary-foreground" /></div>
            <span className="font-display text-lg font-bold text-foreground">ResQ</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/dashboard"><Button variant="outline" size="sm">Dashboard</Button></Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-2xl pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-border bg-card p-8 shadow-xl">
          {/* Avatar & Name */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-10 w-10" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
            <div className={`mt-2 flex items-center gap-1.5 rounded-full px-3 py-1 ${st.bg}`}>
              <st.icon className={`h-3.5 w-3.5 ${st.color}`} />
              <span className={`text-xs font-semibold ${st.color}`}>{st.label}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-secondary/50 p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground">{user.reportsSubmitted}</p>
              <p className="text-xs text-muted-foreground">Reports</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground">{user.trustScore}%</p>
              <p className="text-xs text-muted-foreground">Trust Score</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground capitalize">{user.role}</p>
              <p className="text-xs text-muted-foreground">Role</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", value: user.email },
              { icon: MapPin, label: "City", value: user.city || "Not provided" },
              { icon: Award, label: "Member Since", value: user.joinedAt },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 rounded-xl bg-secondary/30 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            {user.verificationStatus === "unsubmitted" && user.role === "volunteer" && (
              <Link to="/verification" className="flex-1">
                <Button className="w-full gap-2 rounded-xl">Verify Account <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            )}
            <Button variant="outline" onClick={() => { signOut(); navigate("/"); }} className="flex-1 gap-2 rounded-xl text-alert hover:text-alert">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
