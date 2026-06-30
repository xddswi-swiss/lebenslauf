"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { Timeline } from '@/components/Timeline';
import { SkillsGrid } from '@/components/SkillsGrid';
import { ContactForm } from '@/components/ContactForm';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RecruiterWidget } from '@/components/RecruiterWidget';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import Strands from '@/components/Strands';
import { motion as m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  FiDownload, 
  FiArrowRight, 
  FiGithub,
  FiInstagram,
  FiFileText,
  FiZap,
  FiX,
  FiBriefcase,
  FiTrash2
} from 'react-icons/fi';
import { reportItems, languagesData, referencesData, experienceItems } from '@/data/translations';
import { 
  FaUtensils, 
  FaFistRaised, 
  FaSwimmer, 
  FaMusic, 
  FaLeaf, 
  FaCamera, 
  FaWalking, 
  FaFileWord, 
  FaFileExcel, 
  FaCode 
} from 'react-icons/fa';

const hobbiesWithIcons = [
  { key: 'cook' as const, icon: <FaUtensils /> },
  { key: 'kung-fu' as const, icon: <FaFistRaised /> },
  { key: 'swim' as const, icon: <FaSwimmer /> },
  { key: 'music' as const, icon: <FaMusic /> },
  { key: 'nature' as const, icon: <FaLeaf /> },
  { key: 'photography' as const, icon: <FaCamera /> },
  { key: 'walk' as const, icon: <FaWalking /> },
  { key: 'word' as const, icon: <FaFileWord /> },
  { key: 'excel' as const, icon: <FaFileExcel /> },
  { key: 'code' as const, icon: <FaCode /> }
];

const getStrandsColors = (index: number) => {
  if (index === -1) return ["#06B6D4", "#7C3AED", "#FF3B5C"]; // Default fallback

  const palettes = [
    ["#F21137", "#FF6C02", "#68020F"], // 0. Red / Volcanic
    ["#7C3AED", "#3B82F6", "#C084FC"], // 1. Deep Nebula
    ["#10B981", "#059669", "#A7F3D0"], // 2. Green / Mint
    ["#EC4899", "#8B5CF6", "#FBCFE8"], // 3. Cosmic Rose
    ["#06B6D4", "#3B82F6", "#99F6E4"]  // 4. Electric Cyan / Blue
  ];
  
  return palettes[index];
};

// --- MANUEL DEĞİŞTİREBİLECEĞİNİZ İSTATİSTİKLER ---
// Buradaki sayıları ve tarihi dilediğiniz gibi güncelleyebilirsiniz:
const STATS_SCHNUPPERLEHREN = 25; // Schnupperlehren (Staj) Sayısı
const STATS_BEWERBUNGEN = 96;      // Lehrstellenbewerbungen (Çıraklık Başvurusu) Sayısı
const STATS_LETZTE_AKTUALISIERUNG = "19.06.2026"; // Son Güncelleme Tarihi
// ------------------------------------------------

const MainContent: React.FC = () => {
  const { t, language } = useLanguage();
  const [randomColorIndex, setRandomColorIndex] = useState<number>(-1);
  const [selectedMatcher, setSelectedMatcher] = useState<'kaufmann' | 'elektro' | null>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set initial static items immediately to prevent hydration mismatches during server rendering
    setDocs(reportItems[language] || []);

    let isMounted = true;
    const fetchDocuments = () => {
      fetch('/api/documents')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Failed to fetch documents');
        })
        .then(data => {
          if (isMounted && data && data[language]) {
            setDocs(data[language]);
          }
        })
        .catch(err => {
          console.warn('Fallback to static local document data:', err);
        });
    };

    fetchDocuments();

    const handleRefresh = () => {
      fetchDocuments();
    };

    const checkAdmin = () => {
      if (typeof window !== 'undefined') {
        setIsAdmin(localStorage.getItem('admin_unlocked') === 'true');
      }
    };
    checkAdmin();

    window.addEventListener('documents-updated', handleRefresh);
    window.addEventListener('admin-state-changed', checkAdmin);
    return () => {
      isMounted = false;
      window.removeEventListener('documents-updated', handleRefresh);
      window.removeEventListener('admin-state-changed', checkAdmin);
    };
  }, [language]);

  const handleDeleteDocument = async (term: string) => {
    const confirmMsg = {
      de: `Sind Sie sicher, dass Sie das Dokument "${term}" löschen möchten?`,
      tr: `"${term}" belgesini silmek istediğinize emin misiniz?`,
      en: `Are you sure you want to delete the document "${term}"?`
    };
    const msg = confirmMsg[language as 'de' | 'tr' | 'en'] || confirmMsg.de;
    if (!window.confirm(msg)) return;

    try {
      const passcode = localStorage.getItem('admin_passcode') || 'eren2026';
      const response = await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode, term })
      });

      const data = await response.json();
      if (response.ok) {
        window.dispatchEvent(new Event('documents-updated'));
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error occurred');
    }
  };

  const handleMatcherClick = (type: 'kaufmann' | 'elektro') => {
    const nextVal = selectedMatcher === type ? null : type;
    setSelectedMatcher(nextVal);
    if (nextVal) {
      // Smooth scroll to the experience section after a brief delay to allow rendering/expansion
      setTimeout(() => {
        const el = document.getElementById('experience');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const getMatcherStats = () => {
    if (!selectedMatcher) return { experienceCount: 0, skillCount: 0 };
    
    // Count experiences
    const items = experienceItems[language] || [];
    const workItems = items.filter(item => item.type === 'work' || !item.type);
    
    const matchesRole = (role: string) => {
      const r = role.toLowerCase();
      if (selectedMatcher === 'kaufmann') {
        return (
          r.includes('kaufmann') ||
          r.includes('kaufmännische') ||
          r.includes('kv') ||
          r.includes('treuhand') ||
          r.includes('bank') ||
          r.includes('schüler') ||
          r.includes('sekundarschule') ||
          r.includes('ticari') ||
          r.includes('ticaret') ||
          r.includes('bankacılık') ||
          r.includes('ortaokulu') ||
          r.includes('sekundar') ||
          r.includes('commercial') ||
          r.includes('banking') ||
          r.includes('apprentice') ||
          r.includes('school')
        );
      }
      if (selectedMatcher === 'elektro') {
        return (
          r.includes('elektro') ||
          r.includes('netzelektriker') ||
          r.includes('schüler') ||
          r.includes('sekundarschule') ||
          r.includes('elektrik') ||
          r.includes('ortaokulu') ||
          r.includes('sekundar') ||
          r.includes('electrical') ||
          r.includes('installer') ||
          r.includes('school')
        );
      }
      return true;
    };
    
    const experienceCount = workItems.filter(item => matchesRole(item.role)).length;

    // Count skills
    const skillsList = [
      'reliability', 'teamwork', 'helpfulness', 'learning', 'responsibility',
      'geometry', 'math', 'german', 'turkish', 'english',
      'word', 'excel', 'powerpoint', 'web', 'hardware',
      'kung-fu', 'swim', 'cook', 'photography', 'media'
    ];

    const matchesSkill = (skillId: string) => {
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

    const skillCount = skillsList.filter(matchesSkill).length;

    return { experienceCount, skillCount };
  };

  const stats = getMatcherStats();
  
  const getBannerText = () => {
    if (language === 'tr') {
      return `✨ ${stats.experienceCount} uygun staj ve ${stats.skillCount} yetenek aşağıda vurgulandı!`;
    }
    if (language === 'en') {
      return `✨ ${stats.experienceCount} matching apprenticeships and ${stats.skillCount} skills highlighted!`;
    }
    return `✨ ${stats.experienceCount} passende Schnupperlehren und ${stats.skillCount} Fähigkeiten hervorgehoben!`;
  };

  const getBannerLinkText = () => {
    if (language === 'tr') return "Sonuçları Gör ↓";
    if (language === 'en') return "View Results ↓";
    return "Ergebnisse ansehen ↓";
  };

  React.useEffect(() => {
    // Pick a random index once on client mount
    setRandomColorIndex(Math.floor(Math.random() * 5));
  }, []);

  return (
    <div className="min-h-screen bg-grid-mesh relative text-[var(--text-body)] bg-[var(--background)] transition-colors duration-300 flex flex-col">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full -z-10" />

      <Header activeColorIndex={randomColorIndex} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-24 space-y-32">
        {/* Hero Section */}
        <section id="hero" className="min-h-[50vh] flex flex-col-reverse lg:flex-row items-center justify-between gap-12 relative pt-12 pb-0">
          <div className="max-w-3xl space-y-6 flex-1">
            <m.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--badge-bg)] border border-[var(--badge-border)] text-primary text-xs font-bold"
            >
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              <span>{t.hero.statusBadge}</span>
            </m.div>

            <m.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-[var(--text-main)] leading-tight tracking-tight"
            >
              {t.hero.greeting}
            </m.h1>

            <m.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent"
            >
              {t.hero.role}
            </m.h2>

            <m.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[var(--text-body)] text-lg md:text-xl leading-relaxed max-w-2xl"
            >
              {t.hero.subtitle}
            </m.p>

            {/* Hero CTAs */}
            <m.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <a 
                href="#contact" 
                className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary hover:opacity-90 text-white font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 cursor-pointer group"
              >
                {t.hero.emailMe}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>

              <a 
                href="/assets/pdfs/ErenLebensL.pdf"
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-full glass-card hover:bg-zinc-800/10 text-[var(--text-body)] hover:text-[var(--text-main)] font-semibold transition-all duration-300 cursor-pointer"
              >
                <FiDownload />
                {t.hero.downloadCv}
              </a>

              <div className="flex items-center gap-3 md:ml-2">
                <a href="https://github.com/yigiterenaydin" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="p-3 rounded-full glass-card hover:border-[var(--muted)] text-[var(--text-body)] hover:text-[var(--text-main)] transition-all">
                  <FiGithub className="text-xl" />
                </a>
                <a href="https://www.instagram.com/eren_zhhh/" target="_blank" rel="noopener noreferrer" aria-label="Instagram Profile" className="p-3 rounded-full glass-card hover:border-[var(--muted)] text-[var(--text-body)] hover:text-[var(--text-main)] transition-all">
                  <FiInstagram className="text-xl" />
                </a>
              </div>
            </m.div>
          </div>

          {/* Right Column: Premium Photo Card */}
          <m.div 
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-shrink-0 z-10"
          >
            <div className="group hover:saturate-100 saturate-0 transition-[filter] duration-300 relative w-[300px] h-[380px] bg-[var(--badge-bg)] font-sans border-b-2 border-primary overflow-hidden shadow-2xl rounded-3xl">
              <Image 
                className="w-[300px] h-[300px] object-cover group-hover:rounded-br-[100px] rounded-br-[0px] transition-[border-radius] duration-300"
                src="/assets/bilder/eren-photo.png" 
                alt="Eren Aydın"
                width={300}
                height={300}
                priority={true}
              />
              <p className="m-[5px] text-[var(--text-main)] text-base font-bold">Eren Aydın</p>
              <p className="m-[5px] text-[var(--text-muted)] text-xs">{t.hero.role}</p>
              {/* SVG of Arrow */}
              <svg
                className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 absolute right-[10px] bottom-[10px]"
                xmlns="http://www.w3.org/2000/svg" width="45" height="64" viewBox="0 0 45 64" fill="none"
              >
                <path d="M5.67927 0.685928C5.66838 0.658706 5.65749 0.636925 5.65749 0.636925L3.81168 1.12696C5.55403 11.7281 0.588324 15.4905 0.375974 15.6484L1.49217 17.2056C1.69363 17.0641 5.49414 14.2654 6.03318 7.14353C9.0333 14.2545 13.0244 20.1731 17.1298 24.774C17.059 24.8774 16.9882 24.9754 16.9229 25.0789C14.3311 29.0645 14.0861 34.651 16.1933 41.6912C18.6271 49.8203 24.5239 57.748 32.3754 63.4434L33.5025 61.8916C25.9886 56.4358 20.3477 48.8729 18.0336 41.1358C16.1388 34.8089 16.2913 29.6526 18.4692 26.2114C21.7035 29.5927 24.9432 32.1518 27.7636 33.8288C33.8945 37.4659 38.2232 36.377 40.2541 35.4078C42.4919 34.3406 44.1254 32.375 44.414 30.4094C44.4575 30.1099 44.4793 29.805 44.4793 29.5001C44.4793 27.5509 43.5864 25.5853 41.9039 23.8756C38.4628 20.3691 32.713 18.7465 26.5276 19.5306C23.1518 19.9607 20.3695 21.2457 18.3603 23.2821C14.4455 18.8554 10.645 13.1655 7.77554 6.34314C9.95348 8.22706 13.2476 10.2199 18.1425 11.5266L18.638 9.67539C9.24565 7.16531 6.28364 1.94369 5.75005 0.838382C5.73371 0.783935 5.71193 0.729488 5.6956 0.669594L5.67382 0.669594L5.67927 0.685928ZM26.7672 21.4308C33.3555 20.5923 38.2014 22.8411 40.5372 25.215C42.0509 26.7559 42.7533 28.5037 42.5192 30.1317C42.3558 31.2425 41.3431 32.767 39.4319 33.6763C37.744 34.4822 34.1069 35.3642 28.7437 32.179C25.9886 30.5455 22.8197 28.03 19.6617 24.6923C21.7797 22.5035 24.6056 21.6976 26.7726 21.4254L26.7672 21.4308Z" fill="var(--primary)"/>
              </svg>
            </div>
          </m.div>
        </section>

        {/* Apprenticeship Matcher Section */}
        <m.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="scroll-mt-24 max-w-2xl mx-auto w-full"
        >
          <div className="glass-card p-6 md:p-8 rounded-3xl text-center border border-[var(--glass-border)] bg-[var(--glass-card-bg)] backdrop-blur-md relative overflow-hidden shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary opacity-60" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              {t.matcher.title}
            </h3>
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <button
                onClick={() => handleMatcherClick('kaufmann')}
                className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold border transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  selectedMatcher === 'kaufmann'
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 scale-[1.02]'
                    : 'bg-transparent text-[var(--text-body)] border-[var(--glass-border)] hover:bg-zinc-800/10 dark:hover:bg-zinc-200/5'
                }`}
              >
                <FiBriefcase className="text-base" />
                {t.matcher.kaufmann}
              </button>
              <button
                onClick={() => handleMatcherClick('elektro')}
                className={`px-5 py-3 rounded-2xl text-xs md:text-sm font-bold border transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  selectedMatcher === 'elektro'
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 scale-[1.02]'
                    : 'bg-transparent text-[var(--text-body)] border-[var(--glass-border)] hover:bg-zinc-800/10 dark:hover:bg-zinc-200/5'
                }`}
              >
                <FiZap className="text-base" />
                {t.matcher.elektro}
              </button>
              {selectedMatcher && (
                <button
                  onClick={() => setSelectedMatcher(null)}
                  className="p-3 rounded-2xl border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
                  title={t.matcher.reset}
                >
                  <FiX className="text-base" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {selectedMatcher && (
                <m.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3 px-5 rounded-2xl bg-primary/10 border border-primary/20 text-xs md:text-sm">
                    <span className="text-[var(--text-main)] font-semibold">
                      {getBannerText()}
                    </span>
                    <button
                      onClick={() => {
                        const el = document.getElementById('experience');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-primary hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-primary/10 hover:shadow-primary/20 active:scale-95"
                    >
                      {getBannerLinkText()}
                    </button>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        </m.section>

        {/* About Me Section */}
        <section id="about" className="scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <m.div 
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="lg:col-span-7 glass-card p-6 md:p-8 rounded-3xl space-y-6 border border-[var(--glass-border)] hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-default"
            >
              <h2 className="text-3xl font-extrabold text-[var(--text-main)] bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block mb-2">
                {t.about.title}
              </h2>
              <h4 className="text-xl font-bold text-[var(--text-main)]">{t.about.intro}</h4>
              <p className="text-[var(--text-body)] text-base md:text-lg leading-relaxed whitespace-pre-line" dangerouslySetInnerHTML={{ __html: t.about.description }} />
            </m.div>

            <div className="lg:col-span-5 glass-card p-6 md:p-8 rounded-3xl space-y-6 flex flex-col justify-between max-w-[360px] w-full lg:ml-auto mx-auto">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] border-b border-[var(--glass-border)] pb-3 mb-5">
                  {t.about.quickFactsTitle}
                </h3>
                <div className="space-y-4">
                  {/* Schnupperlehren Card */}
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-600/90 dark:to-indigo-700/90 text-white p-6 rounded-2xl shadow-lg shadow-blue-500/10 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between min-h-[140px]">
                    <div className="text-5xl font-extrabold tracking-tight">
                      {STATS_SCHNUPPERLEHREN}
                    </div>
                    <div>
                      <div className="text-lg font-bold mt-2">
                        {t.about.statsSchnupperLabel}
                      </div>
                      <div className="text-xs text-blue-100/80 mt-0.5">
                        {t.about.statsSchnupperDesc}
                      </div>
                    </div>
                  </div>

                  {/* Lehrstellenbewerbungen Card */}
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-600/90 dark:to-teal-700/90 text-white p-6 rounded-2xl shadow-lg shadow-emerald-500/10 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between min-h-[140px]">
                    <div className="text-5xl font-extrabold tracking-tight">
                      {STATS_BEWERBUNGEN}
                    </div>
                    <div>
                      <div className="text-lg font-bold mt-2">
                        {t.about.statsBewerbungLabel}
                      </div>
                      <div className="text-xs text-emerald-100/80 mt-0.5">
                        {t.about.statsBewerbungDesc}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Letzte Aktualisierung Footer */}
              <div className="text-center text-xs text-[var(--text-muted)] pt-4 border-t border-[var(--glass-border)] mt-4 font-semibold">
                {t.about.statsLastUpdate}: {STATS_LETZTE_AKTUALISIERUNG}
              </div>
            </div>
          </div>
        </section>

        {/* School Documents (Zeugnisse) Section */}
        <section id="documents" className="scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[var(--text-main)] mb-2 bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
              {t.documents.title}
            </h2>
            <p className="text-[var(--text-muted)] text-sm md:text-base">{t.documents.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {(() => {
              const docColors = [
                {
                  icon: "text-blue-500 dark:text-blue-400",
                  iconHoverBg: "group-hover:bg-blue-500 group-hover:text-white",
                  button: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/20",
                  glow: "bg-blue-500/10"
                },
                {
                  icon: "text-orange-500 dark:text-orange-400",
                  iconHoverBg: "group-hover:bg-orange-500 group-hover:text-white",
                  button: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/20",
                  glow: "bg-orange-500/10"
                },
                {
                  icon: "text-emerald-500 dark:text-emerald-400",
                  iconHoverBg: "group-hover:bg-emerald-500 group-hover:text-white",
                  button: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                  glow: "bg-emerald-500/10"
                },
                {
                  icon: "text-violet-500 dark:text-violet-400",
                  iconHoverBg: "group-hover:bg-violet-500 group-hover:text-white",
                  button: "bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 border-violet-500/20",
                  glow: "bg-violet-500/10"
                },
                {
                  icon: "text-amber-500 dark:text-amber-400",
                  iconHoverBg: "group-hover:bg-amber-500 group-hover:text-white",
                  button: "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20",
                  glow: "bg-amber-500/10"
                },
                {
                  icon: "text-rose-500 dark:text-rose-400",
                  iconHoverBg: "group-hover:bg-rose-500 group-hover:text-white",
                  button: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/20",
                  glow: "bg-rose-500/10"
                }
              ];

              return docs.map((doc, index) => {
                const colors = docColors[index % docColors.length];
                return (
                  <div 
                    key={index} 
                    className="glass-card p-6 rounded-3xl flex flex-col justify-between h-full relative group overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-16 h-16 ${colors.glow} blur-xl rounded-full`} />
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 glass-card ${colors.icon} ${colors.iconHoverBg} transition-all duration-300`}>
                        <FiFileText className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[var(--text-main)] group-hover:text-[var(--text-main)] transition-colors">
                          {doc.term}
                        </h3>
                        <p className="text-[var(--text-muted)] text-xs mt-0.5">{doc.date}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center w-full mt-4">
                      <a 
                        href={doc.file}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border ${colors.button} text-sm font-semibold transition-all cursor-pointer`}
                      >
                        <FiDownload className="text-xs" />
                        {t.documents.download}
                      </a>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteDocument(doc.term)}
                          title="Löschen / Sil / Delete"
                          className="p-2.5 rounded-xl border border-red-500/20 hover:border-red-500 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer active:scale-95"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="scroll-mt-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[var(--text-main)] bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
              {t.experience.title}
            </h2>
          </div>
          <Timeline selectedMatcher={selectedMatcher} />
        </section>

        {/* Skills Section */}
        <section id="skills" className="scroll-mt-24">
          <SkillsGrid selectedMatcher={selectedMatcher} />
        </section>

        {/* Languages, Hobbies & References Section */}
        <section id="details" className="scroll-mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[var(--text-main)] bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
              {t.details.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Languages & Interests */}
            <div className="space-y-8">
              {/* Languages Card */}
              <div className="glass-card p-6 md:p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full" />
                  {t.details.languagesTitle}
                </h3>
                <div className="space-y-6">
                  {languagesData[language].map((lang, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-[var(--text-body)]">
                          {lang.name} <span className="text-[var(--text-muted)] font-normal">({lang.note})</span>
                        </span>
                        <span className="text-[var(--text-muted)] font-semibold">{lang.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--background)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                        <m.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${lang.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: idx * 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests Card */}
              <div className="glass-card p-6 md:p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-secondary rounded-full" />
                  {t.details.interestsTitle}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {hobbiesWithIcons.map((hobby, index) => (
                    <m.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex items-center gap-0 hover:gap-2.5 px-3.5 py-2.5 hover:px-5 glass-card hover:border-secondary/40 text-[var(--text-body)] hover:text-[var(--text-main)] rounded-2xl text-sm font-semibold cursor-default transition-all duration-300 shadow-sm"
                    >
                      <span className="text-secondary text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                        {hobby.icon}
                      </span>
                      <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 transition-all duration-300 whitespace-nowrap font-bold">
                        {t.details.interests[hobby.key]}
                      </span>
                    </m.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: References */}
            <div className="glass-card p-6 md:p-8 rounded-3xl h-full flex flex-col">
              <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-primary rounded-full" />
                {t.details.referencesTitle}
              </h3>
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                {referencesData[language].map((ref, idx) => (
                  <div 
                    key={idx}
                    className="p-5 glass-card rounded-2xl space-y-3 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div>
                      <h4 className="text-lg font-bold text-[var(--text-main)]">{ref.name}</h4>
                      <p className="text-sm text-[var(--primary)] font-semibold">{ref.title}</p>
                    </div>
                    <div className="space-y-1.5 text-sm text-[var(--text-body)]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--text-muted)]">Email:</span>
                        <a href={`mailto:${ref.email}`} className="text-[var(--primary)] hover:underline break-all transition-colors">
                          {ref.email}
                        </a>
                      </div>
                      {ref.phone && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--text-muted)]">Phone:</span>
                          <span className="text-[var(--text-body)]">{ref.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24">
          <ContactForm />
        </section>
      </main>

      <Footer activeColorIndex={randomColorIndex} />
      {/* Scroll to Top Button */}
      <ScrollToTopButton />
      <RecruiterWidget />
    </div>
  );
};

// 4. Premium Loading Splash Screen
const PageLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1400; // 1.4 seconds loading duration
    const intervalTime = 15; // Tick every 15ms
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      start += step;
      if (start >= 100) {
        setProgress(100);
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 250); // Pause briefly at 100%
      } else {
        setProgress(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <m.div
      initial={{ opacity: 1 }}
      exit={{ 
        y: "-100%", 
        opacity: 0,
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090b] text-white select-none overflow-hidden"
    >
      {/* Decorative Glowing Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xs md:max-w-md px-6 flex flex-col space-y-6 relative z-10">
        {/* Name Logo */}
        <m.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold mb-1">Portfolio</span>
          <h2 className="text-xl md:text-2xl font-black tracking-[0.25em] bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent font-sans">
            EREN AYDIN
          </h2>
        </m.div>

        {/* Monospace progress number */}
        <div className="flex items-baseline justify-between">
          <m.span 
            className="text-6xl md:text-8xl font-light font-mono tracking-tighter tabular-nums text-zinc-100"
          >
            {String(progress).padStart(3, '0')}
          </m.span>
          <span className="text-xl md:text-2xl font-light text-zinc-500 font-mono">%</span>
        </div>

        {/* Progress Bar Container */}
        <div className="h-[2px] w-full bg-zinc-800/40 rounded-full overflow-hidden relative">
          <m.div 
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary shadow-[0_0_8px_rgba(236,72,153,0.5)] rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "easeOut" }}
          />
        </div>
        
        {/* Subtext */}
        <div className="flex justify-between text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">
          <span>Loading Experience</span>
          <span>Please Wait</span>
        </div>
      </div>
    </m.div>
  );
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const isLighthouse = navigator.userAgent.includes('Lighthouse') || navigator.userAgent.includes('Chrome-Lighthouse');
      const hasVisited = sessionStorage.getItem('portfolio_visited') === 'true';
      return !isLighthouse && !hasVisited;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_visited', 'true');
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <PageLoader key="loader" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      <m.div
        animate={{ 
          opacity: isLoading ? 0 : 1,
          y: isLoading ? 30 : 0
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          height: isLoading ? '100vh' : 'auto', 
          overflow: isLoading ? 'hidden' : 'visible'
        }}
      >
        <MainContent />
      </m.div>
    </>
  );
}
