"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { experienceItems } from '@/data/translations';
import { motion as m, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiBookOpen, FiMapPin, FiChevronDown, FiDownload, FiTrash2 } from 'react-icons/fi';
import { ExperienceItem } from '@/data/translations';

interface TimelineProps {
  selectedMatcher?: 'kaufmann' | 'elektro' | null;
}

export const Timeline: React.FC<TimelineProps> = ({ selectedMatcher = null }) => {
  const { t, language } = useLanguage();
  
  const matchesPath = (role: string) => {
    if (!selectedMatcher) return true;
    const r = role.toLowerCase();
    if (selectedMatcher === 'kaufmann') {
      return (
        r.includes('kaufmann') ||
        r.includes('kaufmännische') ||
        r.includes('kv') ||
        r.includes('treuhand') ||
        r.includes('bank') ||
        r.includes('schüler') ||
        r.includes('sekundarschule')
      );
    }
    if (selectedMatcher === 'elektro') {
      return (
        r.includes('elektro') ||
        r.includes('netzelektriker') ||
        r.includes('schüler') ||
        r.includes('sekundarschule')
      );
    }
    return true;
  };
  const [isWorkExpanded, setIsWorkExpanded] = useState(false);
  const [isEducationExpanded, setIsEducationExpanded] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // All items closed by default
  const [workItems, setWorkItems] = useState<ExperienceItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      if (typeof window !== 'undefined') {
        setIsAdmin(localStorage.getItem('admin_unlocked') === 'true');
      }
    };
    
    checkAdmin();
    window.addEventListener('admin-state-changed', checkAdmin);
    return () => {
      window.removeEventListener('admin-state-changed', checkAdmin);
    };
  }, []);

  useEffect(() => {
    // Set initial static items immediately to prevent hydration mismatches during server rendering
    setWorkItems(experienceItems[language] || []);

    let isMounted = true;
    const fetchExperiences = () => {
      fetch('/api/experiences')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch');
        })
        .then(data => {
          if (isMounted && data && data[language]) {
            setWorkItems(data[language]);
          }
        })
        .catch(err => {
          console.warn('Fallback to static local experience data:', err);
        });
    };

    fetchExperiences();

    const handleRefresh = () => {
      fetchExperiences();
    };

    window.addEventListener('experiences-updated', handleRefresh);
    return () => {
      isMounted = false;
      window.removeEventListener('experiences-updated', handleRefresh);
    };
  }, [language]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } }
  };

  // Helper to parse period strings (like 06/2026 or 2023 - 2026) for chronological sorting
  const parsePeriodToDate = (period: string) => {
    const clean = period.trim();
    // Match MM/YYYY (e.g. 06/2026)
    const match = clean.match(/^(\d{2})\/(\d{4})/);
    if (match) {
      return new Date(parseInt(match[2], 10), parseInt(match[1], 10) - 1);
    }
    // Match YYYY (e.g. 2023 - 2026)
    const yearMatch = clean.match(/^(\d{4})/);
    if (yearMatch) {
      return new Date(parseInt(yearMatch[1], 10), 0);
    }
    return new Date(0);
  };

  const localizedWorkItems = workItems
    .filter(item => item.type === 'work' || !item.type)
    .sort((a, b) => parsePeriodToDate(b.period).getTime() - parsePeriodToDate(a.period).getTime());

  const localizedEducationItems = workItems
    .filter(item => item.type === 'education')
    .sort((a, b) => parsePeriodToDate(b.period).getTime() - parsePeriodToDate(a.period).getTime());

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleDelete = async (company: string, period: string) => {
    const confirmMsg = {
      de: `Sind Sie sicher, dass Sie die Schnupperlehre bei "${company}" (${period}) löschen möchten?`,
      tr: `"${company}" (${period}) stajını silmek istediğinize emin misiniz?`,
      en: `Are you sure you want to delete the trial apprenticeship at "${company}" (${period})?`
    };
    
    const msg = confirmMsg[language as 'de' | 'tr' | 'en'] || confirmMsg.de;
    if (!window.confirm(msg)) return;

    try {
      const passcode = localStorage.getItem('admin_passcode');
      const response = await fetch('/api/experiences', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ passcode, company, period })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      if (result.readOnly) {
        const backupJson = JSON.stringify(result.jsonBackup, null, 2);
        alert(
          language === 'tr'
            ? 'Sunucu salt okunur modda. Silme işlemi tamamlandı ancak dosya güncellenemedi. JSON kodu konsola yazdırıldı.'
            : 'Server ist schreibgeschützt. Löschen war erfolgreich, aber Datei wurde nicht aktualisiert. JSON-Code wurde in die Konsole gedruckt.'
        );
        console.log("Experiences JSON Backup after deletion:", backupJson);
      } else {
        window.dispatchEvent(new Event('experiences-updated'));
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error deleting experience');
    }
  };

  // Helper to get initials of company names (ignores AG, Co, GmbH, Bank, etc.)
  const getCompanyInitials = (company: string) => {
    const clean = company.replace(/\b(AG|Co|GmbH|Bank|Zürich)\b/gi, '').trim();
    const words = clean.split(/\s+/).filter(w => w.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase();
  };

  // Helper to determine the company badge color theme
  const getCompanyGradient = (company: string) => {
    const lower = company.toLowerCase();
    if (lower.includes('elektro') || lower.includes('sprecher') || lower.includes('etavis') || lower.includes('götz')) {
      return 'from-orange-500 to-orange-700 shadow-orange-500/20';
    }
    if (lower.includes('bank') || lower.includes('kantonalbank') || lower.includes('ubs')) {
      return 'from-navy-600 to-navy-800 shadow-navy-600/20';
    }
    return 'from-green-500 to-green-700 shadow-green-500/20';
  };

  // Helper to get bullet point color based on company
  const getBulletColor = (company: string) => {
    const lower = company.toLowerCase();
    if (lower.includes('elektro') || lower.includes('sprecher') || lower.includes('etavis') || lower.includes('götz')) {
      return 'text-user-orange-dark dark:text-orange-400';
    }
    if (lower.includes('bank') || lower.includes('kantonalbank') || lower.includes('ubs')) {
      return 'text-user-yellow-dark dark:text-navy-300';
    }
    return 'text-user-green dark:text-green-400';
  };

  const reportLabels = {
    de: "Bericht herunterladen",
    tr: "Staj Raporunu İndir",
    en: "Download Report"
  };

  const reportLabel = reportLabels[language] || reportLabels.de;

  return (
    <div className="w-full max-w-4xl mx-auto py-0 space-y-6">
      
      {/* SECTION 1: ERFAHRUNGEN (WORK EXPERIENCES) */}
      <div className="glass-card rounded-3xl overflow-hidden border border-[var(--glass-border)] shadow-xl transition-all duration-300">
        <button
          onClick={() => setIsWorkExpanded(!isWorkExpanded)}
          className="w-full flex items-center justify-between p-6 md:p-8 cursor-pointer select-none text-left bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <span className="p-3 rounded-2xl bg-[var(--badge-bg)] text-primary">
              <FiBriefcase className="text-xl md:text-2xl" />
            </span>
            <div>
              <h2 className="text-lg md:text-2xl font-black text-[var(--text-main)]">
                {t.experience.workTitle}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-semibold">
                {language === 'tr' 
                  ? 'Tüm stajları ve detayları görmek için tıklayın' 
                  : language === 'en' 
                    ? 'Click to view all apprenticeships and details' 
                    : 'Klicken Sie, um alle Lehrstellen und Details anzuzeigen'}
              </p>
            </div>
          </div>
          <div className={`p-2 rounded-full bg-[var(--background)] border border-[var(--glass-border)] text-[var(--text-muted)] transition-transform duration-300 ${isWorkExpanded ? 'rotate-180 text-primary border-primary/30' : ''}`}>
            <FiChevronDown className="text-xl" />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isWorkExpanded && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="p-6 md:p-8 border-t border-[var(--glass-border)]">
                <div className="relative border-l border-[var(--glass-border)] ml-4 md:ml-8 pl-8 md:pl-12 space-y-6 py-4">
                  <m.div
                    key="work-timeline"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-6"
                  >
                    {localizedWorkItems.map((item, index) => {
                      const isOpen = expandedIndex === index;
                      return (
                        <m.div
                          key={`work-${index}`}
                          variants={itemVariants}
                          className={`relative group transition-all duration-500 ${
                            selectedMatcher && !matchesPath(item.role)
                              ? 'opacity-20 grayscale scale-[0.98] pointer-events-none'
                              : 'opacity-100'
                          }`}
                        >
                          {/* Timeline node */}
                          <div className="absolute -left-14 md:-left-[4.5rem] top-5 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--glass-border)] group-hover:border-primary transition-all duration-300">
                            <FiBriefcase className="text-sm text-[var(--text-muted)] group-hover:text-primary transition-all duration-300" />
                          </div>

                          <div className="glass-card rounded-3xl overflow-hidden border border-[var(--glass-border)]">
                            {/* Collapsible Header */}
                            <div 
                              onClick={() => toggleExpand(index)}
                              className="p-6 md:p-8 cursor-pointer select-none flex items-center justify-between gap-4 hover:bg-[var(--glass-border)]/10 transition-colors duration-200"
                            >
                              <div className="flex-1 min-w-0">
                                {/* Row 1: Company & City */}
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <h3 className="text-lg md:text-xl font-bold text-[var(--text-main)] group-hover:text-primary transition-colors duration-300 truncate">
                                    {item.company}
                                  </h3>
                                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--background)] border border-[var(--glass-border)] text-[var(--text-muted)] flex items-center gap-1 font-medium">
                                    <FiMapPin className="text-[10px]" /> {item.city}
                                  </span>
                                </div>
                                {/* Row 2: Role */}
                                <p className="text-sm md:text-base font-semibold text-primary">
                                  {item.role}
                                </p>
                              </div>

                              {/* Right actions: Period & Chevron */}
                              <div className="flex items-center gap-3 flex-shrink-0">
                                {isAdmin && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(item.company, item.period);
                                    }}
                                    title="Löschen / Sil / Delete"
                                    className="p-1.5 rounded-full border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer active:scale-90"
                                  >
                                    <FiTrash2 className="text-xs" />
                                  </button>
                                )}
                                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--background)] border border-[var(--glass-border)] text-[var(--text-body)] whitespace-nowrap">
                                  {item.period}
                                </span>
                                <div className={`p-1.5 rounded-full bg-[var(--background)] border border-[var(--glass-border)] text-[var(--text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary border-primary/30' : ''}`}>
                                  <FiChevronDown className="text-base" />
                                </div>
                              </div>
                            </div>

                            {/* Expandable Body */}
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <m.div
                                  key="content"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-[var(--glass-border)] pt-6 flex flex-col md:flex-row gap-6 md:gap-12 items-start">
                                    {/* Company Logo Badge */}
                                    <div className="relative w-24 h-32 md:w-36 md:h-48 flex-shrink-0">
                                      {item.imageUrl && (
                                        <img 
                                          src={item.imageUrl} 
                                          alt={item.company} 
                                          className="w-24 h-32 md:w-36 md:h-48 rounded-2xl object-cover shadow-lg border border-[var(--glass-border)] absolute inset-0 z-10"
                                          onError={(e) => {
                                            (e.target as HTMLElement).style.display = 'none';
                                          }}
                                        />
                                      )}
                                      <div className={`w-24 h-32 md:w-36 md:h-48 rounded-2xl flex items-center justify-center font-black text-2xl md:text-4xl text-white bg-gradient-to-tr ${getCompanyGradient(item.company)} shadow-lg absolute inset-0`}>
                                        {getCompanyInitials(item.company)}
                                      </div>
                                    </div>

                                    {/* Details Content */}
                                    <div className="flex-1 space-y-5 w-full">
                                      <div className="space-y-3">
                                        {item.tasks.map((task, idx) => (
                                          <div key={idx} className="flex items-start gap-3">
                                            <span className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current ${getBulletColor(item.company)}`} />
                                            <p className="text-[var(--text-body)] text-sm md:text-base leading-relaxed">
                                              {task}
                                            </p>
                                          </div>
                                        ))}
                                      </div>

                                      {item.pdfReport && (
                                        <div className="pt-2">
                                          <a
                                            href={item.pdfReport}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:opacity-90 text-white font-semibold text-xs md:text-sm transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 active:scale-95 cursor-pointer"
                                          >
                                            <FiDownload className="text-base" />
                                            {reportLabel}
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </m.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </m.div>
                      );
                    })}
                  </m.div>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 2: AUSBILDUNG (EDUCATION) */}
      <div className="glass-card rounded-3xl overflow-hidden border border-[var(--glass-border)] shadow-xl transition-all duration-300">
        <button
          onClick={() => setIsEducationExpanded(!isEducationExpanded)}
          className="w-full flex items-center justify-between p-6 md:p-8 cursor-pointer select-none text-left bg-gradient-to-r from-cyan-500/5 to-transparent hover:from-cyan-500/10 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <span className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300">
              <FiBookOpen className="text-xl md:text-2xl" />
            </span>
            <div>
              <h2 className="text-lg md:text-2xl font-black text-[var(--text-main)]">
                {t.experience.educationTitle}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1 font-semibold">
                {language === 'tr' 
                  ? 'Tüm eğitim geçmişini görmek için tıklayın' 
                  : language === 'en' 
                    ? 'Click to view all education history' 
                    : 'Klicken Sie, um den gesamten Bildungsverlauf anzuzeigen'}
              </p>
            </div>
          </div>
          <div className={`p-2 rounded-full bg-[var(--background)] border border-[var(--glass-border)] text-[var(--text-muted)] transition-transform duration-300 ${isEducationExpanded ? 'rotate-180 text-cyan-600 border-cyan-500/30' : ''}`}>
            <FiChevronDown className="text-xl" />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isEducationExpanded && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="p-6 md:p-8 border-t border-[var(--glass-border)]">
                <div className="relative border-l border-[var(--glass-border)] ml-4 md:ml-8 pl-8 md:pl-12 space-y-8 py-4">
                  <m.div
                    key="education-timeline"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-8"
                  >
                    {localizedEducationItems.map((item, index) => (
                      <m.div
                        key={`edu-${index}`}
                        variants={itemVariants}
                        className="relative group"
                      >
                        {/* Timeline node */}
                        <div className="absolute -left-14 md:-left-[4.5rem] top-1.5 flex items-center justify-center w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--glass-border)] group-hover:border-cyan-500 dark:group-hover:border-cyan-400 transition-all duration-300">
                          <FiBookOpen className="text-sm text-[var(--text-muted)] group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-all duration-300" />
                        </div>

                        <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden border border-[var(--glass-border)]">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-2xl rounded-full" />
                          
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-[var(--text-main)] group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors duration-300">
                                {item.company}
                              </h3>
                              <p className="text-sm text-cyan-700 dark:text-cyan-300 font-medium mt-0.5 flex items-center gap-1.5">
                                {item.role}
                                <span className="text-[var(--glass-border)]">•</span>
                                <span className="text-[var(--text-muted)] flex items-center gap-0.5 text-xs font-normal">
                                  <FiMapPin className="text-[10px]" /> {item.city}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {isAdmin && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(item.company, item.period);
                                  }}
                                  title="Löschen / Sil / Delete"
                                  className="p-1.5 rounded-full border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer active:scale-90"
                                >
                                  <FiTrash2 className="text-xs" />
                                </button>
                              )}
                              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[var(--background)] border border-[var(--glass-border)] text-[var(--text-body)] w-fit">
                                {item.period}
                              </span>
                            </div>
                          </div>

                          <div className="text-[var(--text-body)] text-sm md:text-base leading-relaxed space-y-3 whitespace-pre-line">
                            {item.tasks.map((task, idx) => (
                              <p key={idx}>{task}</p>
                            ))}
                          </div>
                        </div>
                      </m.div>
                    ))}
                  </m.div>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
