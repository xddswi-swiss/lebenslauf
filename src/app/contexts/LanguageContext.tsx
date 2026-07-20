"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Language,
  TranslationSchema,
  translations,
} from "../../data/translations";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined,
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("de");

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language") as Language;
    if (
      savedLang &&
      (savedLang === "de" || savedLang === "tr" || savedLang === "en")
    ) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred-language", lang);
  };

  const t = translations[language];

  // Dynamically update document title and meta description
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.title = t.meta.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", t.meta.description);
      }
    }
  }, [language, t]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
