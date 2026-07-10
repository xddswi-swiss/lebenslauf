"use client";

import React from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Language } from '@/data/translations';

const languages = [
  { code: 'de' as Language, label: 'DE' },
  { code: 'tr' as Language, label: 'TR' },
  { code: 'en' as Language, label: 'EN' }
];

interface LanguageSwitcherProps {
  inline?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ inline = false }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 text-[10px] font-extrabold tracking-wider w-fit select-none">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300 cursor-pointer ${
            language === lang.code
              ? 'active-language-btn bg-primary text-white shadow-sm font-black'
              : 'inactive-language-btn text-[var(--text-body)] hover:text-[var(--text-main)] hover:bg-zinc-800/5 dark:hover:bg-zinc-200/5'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
