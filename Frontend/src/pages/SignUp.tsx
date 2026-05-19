import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, User, MapPin, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react";
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

const stepVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

const InputField = ({ icon: Icon, label, id, focusedField, setFocusedField, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">{label}</label>
    <div className={`relative rounded-xl transition-all duration-300 ${focusedField === id ? "ring-2 ring-primary/40" : ""}`}>
      <Icon className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${focusedField === id ? "text-primary" : "text-muted-foreground"}`} />
      <Input
        {...props}
        onFocus={() => setFocusedField(id)}
        onBlur={() => setFocusedField(null)}
        className="rounded-xl border-border/60 bg-background/50 pl-10 pr-10 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  </div>
);

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    role: "citizen" as "volunteer" | "citizen",
  });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const result = await signUp({
      name: form.name,
      email: form.email,
      password: form.password,
      city: form.city,
      role: form.role,
    });
    setLoading(false);
    
    if (result.success) {
      setIsSuccess(true);
      toast.success("Account created! Verification email sent.");
    } else {
      toast.error(result.error || "Something went wrong. Please try again.");
    }
  };

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const goNext = () => { setDirection(1); setStep(2); };
  const goBack = () => { setDirection(-1); setStep(1); };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <FloatingOrb delay={0} size={350} x="65%" y="-5%" />
      <FloatingOrb delay={2} size={280} x="5%" y="55%" />
      <FloatingOrb delay={1} size={200} x="40%" y="70%" />

      <div className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
      />

      <div className="fixed right-4 top-4 z-50"><ThemeToggle /></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-safety/20 opacity-50 blur-xl" />

        <div className="relative rounded-3xl border border-border/60 bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {/* Logo */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                >
                  <Link to="/" className="mb-6 flex items-center justify-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
                      <Shield className="h-6 w-6 text-primary-foreground" />
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-primary/50"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      />
                    </div>
                    <span className="font-display text-3xl font-bold text-foreground tracking-tight">ResQ</span>
                  </Link>
                </motion.div>

                {/* Step indicator */}
                <div className="mb-6 flex items-center justify-center gap-3">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <motion.div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                        animate={step === s ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                      </motion.div>
                      {s < 2 && (
                        <div className={`h-0.5 w-8 rounded-full transition-colors duration-500 ${step > 1 ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>

                <h1 className="mb-1 text-center font-display text-2xl font-bold text-foreground">Create Account</h1>
                <p className="mb-6 text-center text-sm text-muted-foreground">
                  {step === 1 ? "Set up your credentials" : "Tell us about yourself"}
                </p>

                {/* Role selector */}
                <div className="mb-6 flex gap-1.5 rounded-xl bg-muted/60 p-1">
                  {(["citizen", "volunteer"] as const).map((r) => (
                    <motion.button
                      key={r}
                      type="button"
                      onClick={() => update("role", r)}
                      className={`relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
                        form.role === r ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                      whileTap={{ scale: 0.97 }}
                    >
                      {form.role === r && (
                        <motion.div
                          layoutId="roleHighlight"
                          className="absolute inset-0 rounded-lg bg-primary shadow-md"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{r === "citizen" ? "👤 Citizen" : "🤝 Volunteer"}</span>
                    </motion.button>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait" custom={direction}>
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-4"
                      >
                        <InputField icon={User} label="Full Name *" id="name" placeholder="Your full name" value={form.name} onChange={(e: any) => update("name", e.target.value)} focusedField={focusedField} setFocusedField={setFocusedField} />
                        <InputField icon={Mail} label="Email *" id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e: any) => update("email", e.target.value)} focusedField={focusedField} setFocusedField={setFocusedField} />

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Password *</label>
                          <div className={`relative rounded-xl transition-all duration-300 ${focusedField === "password" ? "ring-2 ring-primary/40" : ""}`}>
                            <Lock className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${focusedField === "password" ? "text-primary" : "text-muted-foreground"}`} />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Min 8 characters"
                              value={form.password}
                              onChange={(e) => update("password", e.target.value)}
                              onFocus={() => setFocusedField("password")}
                              onBlur={() => setFocusedField(null)}
                              className="rounded-xl border-border/60 bg-background/50 pl-10 pr-10 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {form.password.length > 0 && form.password.length < 8 && (
                            <p className="text-xs text-alert">Password must be at least 8 characters</p>
                          )}
                        </div>

                        <Button
                          type="button"
                          onClick={() => {
                            if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
                              toast.error("Fill all required fields");
                              return;
                            }
                            if (!validateEmail(form.email)) {
                              toast.error("Please enter a valid email");
                              return;
                            }
                            if (form.password.length < 8) {
                              toast.error("Password must be at least 8 characters");
                              return;
                            }
                            goNext();
                          }}
                          className="group w-full gap-2 rounded-xl"
                        >
                          Next Step
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-4"
                      >
                        <InputField icon={MapPin} label="City" id="city" placeholder="e.g. Lahore, Karachi" value={form.city} onChange={(e: any) => update("city", e.target.value)} focusedField={focusedField} setFocusedField={setFocusedField} />

                        <div className="flex gap-3 pt-2">
                          <Button type="button" variant="outline" onClick={goBack} className="flex-1 gap-2 rounded-xl">
                            <ArrowLeft className="h-4 w-4" /> Back
                          </Button>
                          <Button type="submit" className="group flex-1 gap-2 rounded-xl" disabled={loading}>
                            {loading ? (
                              <>
                                <motion.div
                                  className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                />
                                Creating...
                              </>
                            ) : (
                              <>
                                Create Account
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 text-center text-sm text-muted-foreground"
                >
                  Already have an account?{" "}
                  <Link to="/signin" className="font-medium text-primary transition-colors hover:text-primary/80 hover:underline">Sign In</Link>
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                key="success-screen"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-8"
              >
                <div className="relative mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-primary"
                  >
                    <CheckCircle2 className="h-10 w-10" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary/30"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-foreground">Verify Your Email</h2>
                <p className="mb-8 text-muted-foreground">
                  We've sent a verification link to <span className="font-semibold text-foreground">{form.email}</span>. 
                  Please check your inbox (and spam folder) to activate your account.
                </p>
                <div className="w-full space-y-3">
                  <Button asChild className="w-full rounded-xl py-6 text-lg">
                    <Link to="/signin">Continue to Sign In</Link>
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? <button onClick={() => setIsSuccess(false)} className="text-primary hover:underline">Try again</button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
