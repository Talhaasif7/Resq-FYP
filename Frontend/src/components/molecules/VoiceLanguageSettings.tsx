import React, { useState } from "react";
import { Globe, Volume2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/contexts/LanguageContext";
import { Separator } from "@/components/ui/separator";

const VoiceLanguageSettings: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const [voiceAlerts, setVoiceAlerts] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {language === "en" ? "EN" : "اردو"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 rounded-2xl border border-border bg-card p-0 shadow-xl" align="end">
        <div className="p-4 pb-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Voice & Language Settings
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose your preferred language and alert preferences.
          </p>
        </div>

        <Separator />

        {/* Language Selection */}
        <div className="p-4 pb-3">
          <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Language
          </label>
          <RadioGroup
            value={language}
            onValueChange={(val) => setLanguage(val as "en" | "ur")}
            className="gap-2"
          >
            <label
              htmlFor="lang-en"
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                language === "en"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <RadioGroupItem value="en" id="lang-en" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">English</span>
                <span className="text-xs text-muted-foreground">Default language</span>
              </div>
            </label>
            <label
              htmlFor="lang-ur"
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                language === "ur"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-secondary"
              }`}
            >
              <RadioGroupItem value="ur" id="lang-ur" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">اردو</span>
                <span className="text-xs text-muted-foreground">Urdu — right-to-left</span>
              </div>
            </label>
          </RadioGroup>
        </div>

        <Separator />

        {/* Voice Alerts Toggle */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2.5">
            <Volume2 className="h-4 w-4 text-primary" />
            <Label htmlFor="voice-toggle" className="text-sm font-medium text-foreground cursor-pointer">
              Auto-Play Voice Alerts
            </Label>
          </div>
          <Switch
            id="voice-toggle"
            checked={voiceAlerts}
            onCheckedChange={setVoiceAlerts}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VoiceLanguageSettings;
