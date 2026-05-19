import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "en" | "ur";

const translations = {
  en: {
    appName: "ResQ",
    tagline: "Pakistan's Real-Time Safety & Crisis Alert Platform",
    liveFeed: "Live Crisis Feed",
    live: "LIVE",
    all: "All",
    floods: "Floods",
    earthquakes: "Earthquakes",
    security: "Security",
    aiTrustScore: "AI Trust Score",
    verified: "AI Verified",
    unverified: "Unverified",
    safetyMap: "Interactive Safety Map",
    mapPlaceholder: "GIS API integration point — connect your mapping service here",
    communityReporting: "Community Reporting Hub",
    reportType: "Report Type",
    textReport: "Text",
    voiceReport: "Voice",
    imageReport: "Image",
    submitReport: "Submit Report",
    safeRoutes: "Safe Routes",
    alternativeRoutes: "Alternative Routes",
    clear: "Clear",
    blocked: "Blocked",
    voiceAlerts: "Voice Alerts",
    playAlert: "Play Alert",
    quickStats: "Quick Stats",
    activeCrises: "Active Crises",
    verifiedReports: "Verified Reports",
    sheltersOpen: "Shelters Open",
    routesUpdated: "Routes Updated",
    sos: "SOS",
    sosEmergency: "Emergency SOS",
    search: "Search crises, locations...",
    trustPercentage: "AI Verified",
    description: "Description",
    location: "Location",
    enterDescription: "Describe the situation...",
    enterLocation: "Enter location...",
    dashboard: "Dashboard",
    reports: "Reports",
    settings: "Settings",
    shelters: "Shelters",
    alerts: "Alerts",
  },
  ur: {
    appName: "ریسکیو",
    tagline: "پاکستان کا ریئل ٹائم سیفٹی اور بحرانی الرٹ پلیٹ فارم",
    liveFeed: "لائیو بحران فیڈ",
    live: "لائیو",
    all: "تمام",
    floods: "سیلاب",
    earthquakes: "زلزلے",
    security: "سیکیورٹی",
    aiTrustScore: "اے آئی ٹرسٹ سکور",
    verified: "اے آئی تصدیق شدہ",
    unverified: "غیر تصدیق شدہ",
    safetyMap: "انٹرایکٹو سیفٹی نقشہ",
    mapPlaceholder: "جی آئی ایس API انٹیگریشن پوائنٹ",
    communityReporting: "کمیونٹی رپورٹنگ ہب",
    reportType: "رپورٹ کی قسم",
    textReport: "ٹیکسٹ",
    voiceReport: "آواز",
    imageReport: "تصویر",
    submitReport: "رپورٹ جمع کریں",
    safeRoutes: "محفوظ راستے",
    alternativeRoutes: "متبادل راستے",
    clear: "صاف",
    blocked: "بند",
    voiceAlerts: "صوتی الرٹس",
    playAlert: "الرٹ چلائیں",
    quickStats: "فوری اعداد و شمار",
    activeCrises: "فعال بحران",
    verifiedReports: "تصدیق شدہ رپورٹیں",
    sheltersOpen: "پناہ گاہیں کھلی ہیں",
    routesUpdated: "راستے اپ ڈیٹ",
    sos: "ایس او ایس",
    sosEmergency: "ہنگامی ایس او ایس",
    search: "بحران، مقامات تلاش کریں...",
    trustPercentage: "اے آئی تصدیق شدہ",
    description: "تفصیل",
    location: "مقام",
    enterDescription: "صورتحال بیان کریں...",
    enterLocation: "مقام درج کریں...",
    dashboard: "ڈیش بورڈ",
    reports: "رپورٹیں",
    settings: "ترتیبات",
    shelters: "پناہ گاہیں",
    alerts: "الرٹس",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isUrdu: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = useCallback(
    (key: TranslationKey): string => translations[language][key] || key,
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isUrdu: language === "ur" }}>
      <div dir={language === "ur" ? "rtl" : "ltr"} className={language === "ur" ? "font-urdu" : "font-sans"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation must be used within LanguageProvider");
  return context;
};
