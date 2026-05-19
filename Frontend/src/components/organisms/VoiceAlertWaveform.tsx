import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2 } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";

const VoiceAlertWaveform: React.FC = () => {
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-card flex h-full flex-col p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <Volume2 className="h-5 w-5 text-info" />
        <h2 className="text-lg font-bold text-foreground">{t("voiceAlerts")}</h2>
      </div>

      {/* Voice API integration point — connect TTS/multilingual voice service here */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex items-end gap-[3px] h-16">
          {Array.from({ length: 32 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full bg-info"
              animate={
                playing
                  ? { height: [6, Math.random() * 56 + 8, 6] }
                  : { height: 6 }
              }
              transition={{
                repeat: playing ? Infinity : 0,
                duration: 0.6 + Math.random() * 0.5,
                delay: i * 0.03,
              }}
            />
          ))}
        </div>

        <button
          onClick={() => setPlaying(!playing)}
          className="flex items-center gap-2 rounded-full bg-info/20 px-5 py-2 text-sm font-medium text-info transition-colors hover:bg-info/30"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {t("playAlert")}
        </button>

        <div className="flex gap-2 text-[10px] text-muted-foreground">
          <span className="rounded-full bg-secondary/50 px-2 py-0.5">English</span>
          <span className="rounded-full bg-secondary/50 px-2 py-0.5">اردو</span>
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceAlertWaveform;
