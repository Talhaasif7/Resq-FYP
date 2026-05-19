import React from "react";
import { useTranslation } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <button
      onClick={() => setLanguage(language === "en" ? "ur" : "en")}
      className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
    >
      <Globe className="h-4 w-4" />
      <span>{language === "en" ? "اردو" : "English"}</span>
    </button>
  );
};

export default LanguageSelector;
