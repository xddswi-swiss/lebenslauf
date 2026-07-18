"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { motion as m } from 'framer-motion';
import { FiUserCheck, FiBookOpen, FiMonitor, FiHeart } from 'react-icons/fi';

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface SkillsBeamScannerProps {
  selectedMatcher?: 'kaufmann' | 'elektro' | null;
}

export const SkillsBeamScanner: React.FC<SkillsBeamScannerProps> = ({ selectedMatcher = null }) => {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const categories = [
    {
      key: 'personal' as const,
      icon: <FiUserCheck className="text-xl text-orange-700 dark:text-orange-400" />,
      code: `// compiled personal strengths data
class PersonalStrengths {
  constructor() {
    this.reliability = 0.98;    // Zuverlässigkeit
    this.teamwork = 0.95;       // Teamfähigkeit
    this.helpfulness = 0.95;    // Hilfsbereitschaft
    this.learning = 0.90;       // Lernbereitschaft
    this.responsibility = 0.85; // Verantwortung
  }
  
  validate() {
    return this.reliability > 0.95 && this.teamwork > 0.90;
  }
}`
    },
    {
      key: 'school' as const,
      icon: <FiBookOpen className="text-xl text-navy-700 dark:text-navy-400" />,
      code: `// compiled school achievements data
class AcademicAchievements {
  constructor() {
    this.geometry = 0.90;       // Geometrie
    this.mathematics = 0.85;    // Mathematik
    this.german = 1.00;         // Deutsch (Muttersprache)
    this.turkish = 1.00;        // Türkçe (Ana Dil)
    this.english = 0.70;        // English (7. Schuljahr)
  }

  getLanguages() {
    return ["DE", "TR", "EN"];
  }
}`
    },
    {
      key: 'digital' as const,
      icon: <FiMonitor className="text-xl text-green-700 dark:text-green-400" />,
      code: `// compiled IT & digital media achievements
class DigitalProficiency {
  constructor() {
    this.word = 0.90;           // MS Word
    this.excel = 0.85;          // MS Excel
    this.powerpoint = 0.85;     // MS PowerPoint
    this.html5_css3 = 0.65;     // Web Development
    this.hardware = 0.80;       // Hardware Understanding
  }

  isOfficeSuiteProficient() {
    return this.word >= 0.85 && this.excel >= 0.85;
  }
}`
    },
    {
      key: 'hobbies' as const,
      icon: <FiHeart className="text-xl text-orange-700 dark:text-orange-400" />,
      code: `// compiled interests & hobby profile
class HobbiesAndInterests {
  constructor() {
    this.kung_fu = 0.95;        // Kung-Fu Sport (Disziplin)
    this.swimming = 0.90;       // Schwimmsport (Ausdauer)
    this.cooking = 0.80;        // Kochen & Rezepte
    this.photography = 0.75;    // Fotografie & Natur
    this.media = 0.80;          // Medien & Kommunikation
  }

  hasHighDiscipline() {
    return this.kung_fu >= 0.90;
  }
}`
    }
  ];

  // Dynamic 60fps clipping calculation loop
  useEffect(() => {
    if (!mounted) return;

    let active = true;

    const updateClipping = () => {
      if (!active || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      // Center vertical scanner line coordinate relative to screen
      const scannerX = containerRect.left + containerRect.width / 2;

      const cardWrappers = container.querySelectorAll('.skills-card-wrapper');
      cardWrappers.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const rect = htmlCard.getBoundingClientRect();
        const cardLeft = rect.left;
        const cardRight = rect.right;
        const cardWidth = rect.width;

        if (cardLeft < scannerX && cardRight > scannerX) {
          // Card is crossing the scanner line
          const scannerIntersectLeft = Math.max(scannerX - cardLeft, 0);
          const scannerIntersectRight = Math.min(scannerX - cardLeft, cardWidth);

          const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
          const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

          htmlCard.style.setProperty('--clip-right', `${normalClipRight}%`);
          htmlCard.style.setProperty('--clip-left', `${asciiClipLeft}%`);
        } else {
          // Card is fully to the left or right of the scanner line
          if (cardRight <= scannerX) {
            htmlCard.style.setProperty('--clip-right', '100%');
            htmlCard.style.setProperty('--clip-left', '100%');
          } else if (cardLeft >= scannerX) {
            htmlCard.style.setProperty('--clip-right', '0%');
            htmlCard.style.setProperty('--clip-left', '0%');
          }
        }
      });

      requestAnimationFrame(updateClipping);
    };

    updateClipping();

    return () => {
      active = false;
    };
  }, [mounted]);

  return (
    <div className="skills-scanner-container w-full" ref={containerRef}>
      {/* Central Glowing Scanner Line */}
      <div className="skills-scanner-line" />
      <div className="scan-glow left-1/2 -translate-x-1/2" />

      {/* Draggable slider container */}
      <m.div
        drag="x"
        dragElastic={0.2}
        dragConstraints={{
          // Constraints are set dynamically so you can drag all 4 cards across the center scanner line
          left: -800,
          right: 300
        }}
        className="skills-slider-track select-none"
      >
        {categories.map((category) => (
          <div key={category.key} className="skills-card-wrapper">
            
            {/* 1. LAYER: Decoded Normal Progress Bar View (Clipped right of scanner) */}
            <div className="skills-card skills-card-normal p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)] flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-[var(--text-main)]">
                    {t.skills.categories[category.key]}
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {(t.skills.items[category.key] as Skill[]).map((skill, index) => {
                    const matches = isSkillMatching(skill.id);
                    return (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between gap-4 py-1 transition-all duration-300 ${
                          selectedMatcher && !matches 
                            ? 'opacity-20 scale-[0.98]' 
                            : 'opacity-100'
                        }`}
                      >
                        {/* Skill Name */}
                        <span className={`w-[45%] text-left text-xs md:text-sm font-semibold truncate transition-colors duration-300 ${
                          selectedMatcher && matches 
                            ? 'text-primary font-bold shadow-sm' 
                            : 'text-[var(--text-body)]'
                        }`} title={skill.name}>
                          {skill.name}
                        </span>

                        {/* Progress Bar + Percentage */}
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                          <div className="flex-1 h-2 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                            {mounted && (
                              <m.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full bg-gradient-to-r ${
                                  category.key === 'personal' ? 'from-orange-600 to-orange-400' :
                                  category.key === 'school' ? 'from-navy-700 to-navy-500' :
                                  category.key === 'digital' ? 'from-green-600 to-green-400' :
                                  'from-orange-600 to-navy-600'
                                }`}
                              />
                            )}
                          </div>
                          <span className="w-8 text-right text-xs md:text-sm font-bold text-[var(--text-muted)] flex-shrink-0">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. LAYER: Encoded ASCII/Code View (Clipped left of scanner) */}
            <div className="skills-card skills-card-ascii">
              <div className="skills-ascii-content">
                {category.code}
              </div>
            </div>

          </div>
        ))}
      </m.div>
    </div>
  );
};
