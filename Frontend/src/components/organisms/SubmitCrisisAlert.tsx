import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Upload,
  ShieldCheck,
  X,
  AlertTriangle,
  MapPin,
  FileText,
  Square,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const SubmitCrisisAlert: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const toggleRecording = () => {
    // Voice recording API integration point
    setIsRecording((r) => !r);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    // NLP verification API integration point — submit payload for AI processing
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      setDescription("");
      setLocation("");
      setFiles([]);
      setIsRecording(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="gap-2 rounded-2xl">
            <AlertTriangle className="h-4 w-4" />
            Submit Crisis Alert
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-border bg-card p-0 sm:max-w-lg">
        {/* Header */}
        <DialogHeader className="border-b border-border px-5 py-4 sm:px-6">
          <DialogTitle className="flex items-center gap-2.5 text-lg font-bold text-foreground">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            Submit Crisis Alert
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6">
          {/* Description */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              Describe the situation
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is happening? Be as specific as possible..."
              className="min-h-[120px] resize-none rounded-2xl border-border bg-secondary/30 text-sm placeholder:text-muted-foreground focus:bg-secondary/50"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter area, city, or landmark..."
              className="rounded-2xl border-border bg-secondary/30 text-sm placeholder:text-muted-foreground focus:bg-secondary/50"
            />
          </div>

          {/* Drag & Drop Zone */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Upload className="h-3.5 w-3.5" />
              Upload Image / Video
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-secondary/20 hover:border-muted-foreground hover:bg-secondary/30"
              }`}
            >
              <Upload className={`mb-2 h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-sm font-medium text-foreground">
                Drag & drop files here
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                or tap to browse · Images & Videos
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* File list */}
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 flex flex-wrap gap-2"
              >
                {files.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-foreground"
                  >
                    {f.name.length > 18 ? f.name.slice(0, 15) + "…" : f.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="rounded-full p-0.5 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          {/* Voice Memo */}
          <button
            onClick={toggleRecording}
            className={`flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-4 text-sm font-semibold transition-all ${
              isRecording
                ? "bg-destructive text-destructive-foreground animate-pulse"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            {isRecording ? (
              <>
                <Square className="h-5 w-5" />
                Stop Recording
                {/* Waveform dots */}
                <span className="ml-1 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="inline-block h-3 w-1 rounded-full bg-current"
                      animate={{ scaleY: [0.4, 1, 0.4] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    />
                  ))}
                </span>
              </>
            ) : (
              <>
                <Mic className="h-6 w-6" />
                Record Voice Memo
              </>
            )}
          </button>

          {/* Disclaimer */}
          <div className="flex items-start gap-2.5 rounded-2xl bg-primary/5 px-4 py-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">AI-Verified Reports.</span>{" "}
              All reports are verified by AI before publishing to ensure accuracy and prevent misinformation.
            </p>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={(!description.trim() && files.length === 0 && !isRecording) || submitting}
            className="w-full gap-2 rounded-2xl py-6 text-base font-bold"
            size="lg"
          >
            {submitting ? (
              <motion.div
                className="h-5 w-5 rounded-full border-2 border-current border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
              />
            ) : (
              <ShieldCheck className="h-5 w-5" />
            )}
            {submitting ? "Submitting…" : "Submit for Verification"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitCrisisAlert;
