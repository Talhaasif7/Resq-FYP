import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Upload, CheckCircle, Clock, XCircle, FileText, Camera, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

const steps = [
  { label: "Submit Documents", icon: Upload },
  { label: "Under Review", icon: Clock },
  { label: "Verified", icon: CheckCircle },
];

const Verification: React.FC = () => {
  const { user, updateVerification } = useAuth();
  const navigate = useNavigate();
  const [idFront, setIdFront] = useState<string | null>(null);
  const [idBack, setIdBack] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);

  const status = user?.verificationStatus || "unsubmitted";
  const currentStep = status === "unsubmitted" ? 0 : status === "pending" ? 1 : status === "verified" ? 2 : 0;

  const handleFileChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File must be under 10MB");
        return;
      }
      setter(file.name);
    }
  };

  const handleSubmit = () => {
    if (!idFront || !idBack) {
      toast.error("Please upload both sides of your ID document");
      return;
    }
    updateVerification("pending");
    toast.success("Documents submitted! Review typically takes 24-48 hours.");
    setTimeout(() => {
      updateVerification("verified");
      toast.success("🎉 Congratulations! You are now a verified volunteer.");
    }, 5000);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">Please sign in to verify your account</p>
          <Link to="/signin"><Button>Sign In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-40 left-1/3 h-[500px] w-[500px] rounded-full bg-safety/8 blur-[120px]" />
      </div>

      <div className="fixed right-4 top-4 flex gap-2">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-2xl pt-16">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">ResQ</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border bg-card p-8 shadow-xl"
        >
          <h1 className="mb-2 text-center font-display text-2xl font-bold text-foreground">Volunteer Verification</h1>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Verify your identity to become a trusted ResQ volunteer
          </p>

          {/* Progress Steps */}
          <div className="mb-10 flex items-center justify-center gap-4">
            {steps.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                    i <= currentStep
                      ? "border-safety bg-safety/10 text-safety"
                      : "border-border bg-secondary/50 text-muted-foreground"
                  }`}>
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`mb-5 h-0.5 w-12 rounded ${i < currentStep ? "bg-safety" : "bg-border"}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {status === "verified" && (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-safety/10">
                <CheckCircle className="h-10 w-10 text-safety" />
              </div>
              <h2 className="mb-2 font-display text-xl font-bold text-foreground">You're Verified! ✅</h2>
              <p className="mb-6 text-sm text-muted-foreground">
                You now have full access to volunteer features including priority reporting and community moderation.
              </p>
              <Link to="/dashboard">
                <Button className="gap-2 rounded-xl">Go to Dashboard <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </motion.div>
          )}

          {status === "rejected" && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-alert/10">
                <XCircle className="h-10 w-10 text-alert" />
              </div>
              <h2 className="mb-2 font-display text-xl font-bold text-foreground">Verification Rejected</h2>
              <p className="mb-6 text-sm text-muted-foreground">Please resubmit clear documents.</p>
              <Button onClick={() => updateVerification("unsubmitted")} className="rounded-xl">Try Again</Button>
            </div>
          )}

          {status === "pending" && (
            <div className="text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-trust/10">
                <Clock className="h-10 w-10 text-trust" />
              </motion.div>
              <h2 className="mb-2 font-display text-xl font-bold text-foreground">Under Review</h2>
              <p className="mb-2 text-sm text-muted-foreground">Your documents are being reviewed by our team.</p>
              <p className="text-xs text-muted-foreground">Estimated time: 24-48 hours</p>
            </div>
          )}

          {status === "unsubmitted" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="group cursor-pointer rounded-2xl border-2 border-dashed border-border bg-secondary/20 p-6 text-center transition-colors hover:border-primary/50">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange(setIdFront)} />
                  <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground group-hover:text-primary" />
                  <p className="text-sm font-medium text-foreground">ID Front *</p>
                  <p className="mt-1 text-xs text-muted-foreground">{idFront || "Click to upload"}</p>
                </label>
                <label className="group cursor-pointer rounded-2xl border-2 border-dashed border-border bg-secondary/20 p-6 text-center transition-colors hover:border-primary/50">
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange(setIdBack)} />
                  <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground group-hover:text-primary" />
                  <p className="text-sm font-medium text-foreground">ID Back *</p>
                  <p className="mt-1 text-xs text-muted-foreground">{idBack || "Click to upload"}</p>
                </label>
              </div>

              <label className="group block cursor-pointer rounded-2xl border-2 border-dashed border-border bg-secondary/20 p-6 text-center transition-colors hover:border-primary/50">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange(setSelfie)} />
                <Camera className="mx-auto mb-2 h-8 w-8 text-muted-foreground group-hover:text-primary" />
                <p className="text-sm font-medium text-foreground">Selfie with ID (Optional)</p>
                <p className="mt-1 text-xs text-muted-foreground">{selfie || "Click to upload"}</p>
              </label>

              <Button onClick={handleSubmit} className="w-full gap-2 rounded-xl">
                Submit for Verification <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Verification;
