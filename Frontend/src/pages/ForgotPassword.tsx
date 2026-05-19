import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

const FloatingOrb = ({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) => (
  <motion.div
    className="absolute rounded-full bg-primary/10 blur-3xl"
    style={{ width: size, height: size, left: x, top: y }}
    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const ForgotPassword: React.FC = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      toast.success("Reset instructions sent!");
    } else {
      toast.error(result.error || "Failed to send reset email");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <FloatingOrb delay={0} size={400} x="10%" y="-10%" />
      <FloatingOrb delay={1.5} size={300} x="70%" y="60%" />

      <div className="fixed right-4 top-4 z-50">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-safety/20 opacity-50 blur-xl" />

        <div className="relative rounded-3xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl text-center">
          <Link to="/" className="mb-8 flex items-center justify-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-display text-3xl font-bold text-foreground tracking-tight">ResQ</span>
          </Link>

          {!submitted ? (
            <>
              <h1 className="mb-2 text-2xl font-bold text-foreground">Forgot Password?</h1>
              <p className="mb-8 text-sm text-muted-foreground">
                Enter your email and we'll send you instructions to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <div className={`relative rounded-xl transition-all duration-300 ${focusedField === "email" ? "ring-2 ring-primary/40" : ""}`}>
                    <Mail className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${focusedField === "email" ? "text-primary" : "text-muted-foreground"}`} />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="rounded-xl border-border/60 bg-background/50 pl-10 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2 rounded-xl" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-4"
            >
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
              </div>
              <h2 className="mb-2 text-xl font-bold">Check your email</h2>
              <p className="mb-8 text-sm text-muted-foreground">
                We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
              </p>
              <Button variant="outline" className="w-full rounded-xl" onClick={() => setSubmitted(false)}>
                Try another email
              </Button>
            </motion.div>
          )}

          <Link to="/signin" className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
