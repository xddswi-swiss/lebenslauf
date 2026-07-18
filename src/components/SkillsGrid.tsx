"use client";

import React from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { SkillsBeamScanner } from './SkillsBeamScanner';

interface SkillsGridProps {
  selectedMatcher?: 'kaufmann' | 'elektro' | null;
}

export const SkillsGrid: React.FC<SkillsGridProps> = ({ selectedMatcher = null }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto py-0">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-[var(--text-main)] mb-2 bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
          {t.skills.title}
        </h2>
        <p className="text-[var(--text-muted)] max-w-md mx-auto text-sm md:text-base">
          {t.skills.subtitle}
        </p>
      </div>

      <SkillsBeamScanner selectedMatcher={selectedMatcher} />
    </div>
  );
};
