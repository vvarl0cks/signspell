"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Language, getStoredLanguage, setStoredLanguage } from "@/lib/i18n";
import { translations, type Translations } from "@/data/translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = getStoredLanguage();
    setLangState(stored);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLangState(lang);
    setStoredLanguage(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "id" : "en");
  }, [language, setLanguage]);

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
