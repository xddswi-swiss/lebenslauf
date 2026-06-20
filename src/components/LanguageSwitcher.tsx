"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { Language } from '@/data/translations';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'de' as Language, label: 'Deutsch', flag: '🇩🇪' },
  { code: 'tr' as Language, label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en' as Language, label: 'English', flag: '🇬🇧' }
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(lang => lang.code === language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full glass-card text-[var(--text-body)] hover:text-[var(--text-main)] transition-all cursor-pointer"
      >
        <FiGlobe className="text-violet-400 text-base" />
        <span>{currentLang.flag} {currentLang.label}</span>
        <FiChevronDown className={`text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close dropdown */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-40 rounded-2xl glass-panel border border-[var(--glass-border)] shadow-2xl z-20 overflow-hidden"
            >
              <div className="py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 text-left text-sm transition-all hover:bg-violet-600/20 cursor-pointer ${
                      language === lang.code ? 'text-violet-400 font-semibold bg-violet-600/10' : 'text-[var(--text-body)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    <span className="mr-2 text-base">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
