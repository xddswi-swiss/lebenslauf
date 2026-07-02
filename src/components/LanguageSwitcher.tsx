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
    <div className={`flex gap-1 p-0.5 rounded-full bg-zinc-800/10 dark:bg-zinc-200/5 border border-[var(--glass-border)] text-[10px] font-extrabold tracking-wider w-fit ${inline ? 'w-full justify-between' : ''}`}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
            inline ? 'flex-1 justify-center flex' : ''
          } ${
            language === lang.code
              ? 'bg-primary text-white shadow-sm'
              : 'text-[var(--text-body)] hover:text-[var(--text-main)]'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
