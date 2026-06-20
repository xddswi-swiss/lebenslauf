"use client";

import React from 'react';
import Link from 'next/link';
import { motion as m } from 'framer-motion';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useTheme } from '@/app/contexts/ThemeContext';
import { 
  FiHome, 
  FiArrowLeft, 
  FiUser, 
  FiFileText, 
  FiBriefcase, 
  FiAward, 
  FiSliders, 
  FiMail 
} from 'react-icons/fi';

export default function NotFound() {
  const { language, setLanguage, t } = useLanguage();
  const { theme } = useTheme();

  // Navigation Sitemap links
  const sitemapLinks = [
    { href: "/#about", label: t.nav.about, icon: <FiUser className="text-base" /> },
    { href: "/#documents", label: t.nav.documents, icon: <FiFileText className="text-base" /> },
    { href: "/#experience", label: t.nav.experience, icon: <FiBriefcase className="text-base" /> },
    { href: "/#skills", label: t.nav.skills, icon: <FiAward className="text-base" /> },
    { href: "/#details", label: t.nav.details, icon: <FiSliders className="text-base" /> },
    { href: "/#contact", label: t.nav.contact, icon: <FiMail className="text-base" /> }
  ];

  // Floating background particles
  const particles = [
    { id: 1, size: 120, x: "15%", y: "20%", color: "bg-primary/10", delay: 0, duration: 8 },
    { id: 2, size: 180, x: "80%", y: "15%", color: "bg-secondary/15", delay: 2, duration: 12 },
    { id: 3, size: 100, x: "70%", y: "75%", color: "bg-primary/15", delay: 4, duration: 10 },
    { id: 4, size: 140, x: "10%", y: "80%", color: "bg-secondary/10", delay: 1, duration: 9 },
  ];

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-grid-mesh flex flex-col items-center justify-center p-6 text-[var(--text-body)] bg-[var(--background)] transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-primary/5 blur-[130px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-secondary/5 blur-[130px] rounded-full -z-10" />

      {/* Floating abstract decorative particles */}
      {particles.map((p) => (
        <m.div
          key={p.id}
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          className={`absolute rounded-full blur-[80px] -z-10 ${p.color}`}
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
          }}
        />
      ))}

      {/* Main glass card */}
      <m.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="glass-card max-w-lg w-full p-8 md:p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-card-bg)] backdrop-blur-md"
      >
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-2xl rounded-full" />
        
        {/* Glowing 404 Badge */}
        <m.div
          initial={{ y: 0 }}
          animate={{ y: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          whileHover={{ scale: 1.08 }}
          className="mx-auto w-28 h-28 rounded-3xl bg-gradient-to-tr from-primary to-secondary/80 flex items-center justify-center text-white text-4xl font-extrabold shadow-xl shadow-primary/25 mb-8 relative group cursor-default"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
          <span className="tracking-widest">404</span>
        </m.div>

        {/* Language Switcher Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {(['de', 'tr', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                language === lang
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/25 scale-105'
                  : 'bg-transparent text-[var(--text-muted)] border-[var(--glass-border)] hover:bg-zinc-800/10 dark:hover:bg-zinc-200/5'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-3 leading-tight tracking-tight">
          {t.notFound.title}
        </h1>

        {/* Description */}
        <p className="text-[var(--text-body)] text-sm md:text-base mb-8 max-w-sm mx-auto leading-relaxed">
          {t.notFound.description}
        </p>

        {/* Sitemap / Quick links */}
        <div className="border-t border-b border-[var(--glass-border)] py-6 mb-8 text-left">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 text-center">
            {t.notFound.sitemapTitle}
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {sitemapLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center gap-2.5 p-3 rounded-2xl glass-card text-xs font-semibold text-[var(--text-body)] hover:text-[var(--primary)] hover:border-primary/30 transition-all duration-300"
              >
                <span className="text-[var(--primary)]">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={goBack}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 border border-[var(--glass-border)] hover:border-primary/30 text-[var(--text-main)] font-semibold rounded-2xl hover:bg-zinc-800/5 dark:hover:bg-zinc-200/5 transition-all duration-300 cursor-pointer"
          >
            <FiArrowLeft className="text-lg" />
            {t.notFound.btnBack}
          </button>

          <Link
            href="/"
            className="flex-[1.5] inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary hover:opacity-90 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 cursor-pointer"
          >
            <FiHome className="text-lg" />
            {t.notFound.btnHome}
          </Link>
        </div>
      </m.div>
    </div>
  );
}
