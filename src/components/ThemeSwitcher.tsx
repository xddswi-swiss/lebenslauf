"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme, ThemeMode } from "@/app/contexts/ThemeContext";
import { FiSun, FiMoon, FiMonitor, FiChevronDown } from "react-icons/fi";
import { motion as m, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/contexts/LanguageContext";

export const ThemeSwitcher: React.FC = () => {
  const { themeMode, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const labels = {
    de: { yellow: "Sonne", blue: "Nachtblau", white: "Schwarz-Weiß" },
    tr: { yellow: "Güneş", blue: "Gece Mavisi", white: "Siyah Beyaz" },
    en: { yellow: "Sun", blue: "Night Blue", white: "Black & White" },
  };

  const t = labels[language as keyof typeof labels] || labels.de;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themes: { value: ThemeMode; label: string; icon: React.ReactNode; color: string }[] = [
    { value: "yellow", label: t.yellow, icon: <FiSun />, color: "bg-yellow-400 border-yellow-500" },
    { value: "blue", label: t.blue, icon: <FiMoon />, color: "bg-blue-600 border-blue-500" },
    { value: "white", label: t.white, icon: <FiMonitor />, color: "bg-zinc-200 border-zinc-400 dark:bg-white dark:border-neutral-300" },
  ];

  const currentTheme = themes.find((t) => t.value === themeMode) || themes[0];

  return (
    <div className="relative z-50 flex items-center" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-card text-[var(--text-main)] hover:bg-zinc-800/5 dark:hover:bg-zinc-200/10 transition-all cursor-pointer border border-[var(--glass-border)] shadow-sm"
        aria-label="Theme Menu"
      >
        <div className={`w-3 h-3 rounded-full border shadow-sm ${currentTheme.color}`} />
        <FiChevronDown className={`text-sm transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="!absolute left-0 top-full mt-2 w-40 p-1.5 rounded-2xl glass-card bg-[var(--glass-card-bg)] shadow-2xl border border-[var(--glass-border)] flex flex-col gap-1 z-[999]"
          >
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  changeTheme(t.value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  themeMode === t.value
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-[var(--text-main)] hover:bg-zinc-800/5 dark:hover:bg-zinc-200/10"
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border shadow-sm ${t.color}`} />
                {t.label}
              </button>
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
