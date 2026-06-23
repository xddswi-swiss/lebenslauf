"use client";

import React from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { motion as m } from 'framer-motion';
import { FiUserCheck, FiBookOpen, FiMonitor, FiHeart } from 'react-icons/fi';

interface Skill {
  id: string;
  name: string;
  level: number; // 0-100 for visual indicators
}

interface SkillCategory {
  key: 'personal' | 'school' | 'digital' | 'hobbies';
  icon: React.ReactNode;
}

interface SkillsGridProps {
  selectedMatcher?: 'kaufmann' | 'elektro' | null;
}

export const SkillsGrid: React.FC<SkillsGridProps> = ({ selectedMatcher = null }) => {
  const { t } = useLanguage();
  
  const isSkillMatching = (skillId: string) => {
    if (!selectedMatcher) return true;
    const s = skillId.toLowerCase();
    if (selectedMatcher === 'kaufmann') {
      return [
        'teamwork',
        'helpfulness',
        'responsibility',
        'german',
        'turkish',
        'english',
        'word',
        'excel',
        'powerpoint',
        'media'
      ].includes(s);
    }
    if (selectedMatcher === 'elektro') {
      return [
        'reliability',
        'learning',
        'responsibility',
        'geometry',
        'math',
        'hardware',
        'kung-fu'
      ].includes(s);
    }
    return true;
  };

  const categories: SkillCategory[] = [
    {
      key: 'personal',
      icon: <FiUserCheck className="text-xl text-orange-700 dark:text-orange-400" />,
    },
    {
      key: 'school',
      icon: <FiBookOpen className="text-xl text-navy-700 dark:text-navy-400" />,
    },
    {
      key: 'digital',
      icon: <FiMonitor className="text-xl text-green-700 dark:text-green-400" />,
    },
    {
      key: 'hobbies',
      icon: <FiHeart className="text-xl text-orange-700 dark:text-orange-400" />,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

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

      <m.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {categories.map((category) => (
          <m.div
            key={category.key}
            variants={itemVariants}
            className="glass-card p-6 md:p-8 rounded-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)] flex items-center justify-center">
                {category.icon}
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">
                {t.skills.categories[category.key]}
              </h3>
            </div>

            <div className="space-y-4">
              {t.skills.items[category.key].map((skill, index) => {
                const matches = isSkillMatching(skill.id);
                return (
                  <div 
                    key={index} 
                    className={`space-y-1.5 transition-all duration-500 ${
                      selectedMatcher && !matches 
                        ? 'opacity-20 scale-[0.98]' 
                        : 'opacity-100'
                    }`}
                  >
                    <div className="flex justify-between text-sm">
                      <span className={`font-medium transition-colors duration-300 ${
                        selectedMatcher && matches 
                          ? 'text-primary font-bold shadow-sm' 
                          : 'text-[var(--text-body)]'
                      }`}>
                        {skill.name}
                      </span>
                      <span className="text-[var(--text-muted)] font-semibold">{skill.level}%</span>
                    </div>
                    <div className="h-2 w-full bg-[var(--background)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                      <m.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${
                          category.key === 'personal' ? 'from-orange-600 to-orange-400' :
                          category.key === 'school' ? 'from-navy-700 to-navy-500' :
                          category.key === 'digital' ? 'from-green-600 to-green-400' :
                          'from-orange-600 to-navy-600'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </m.div>
        ))}
      </m.div>
    </div>
  );
};
