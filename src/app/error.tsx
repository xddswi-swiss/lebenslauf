"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion as m } from 'framer-motion';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useTheme } from '@/app/contexts/ThemeContext';
import { FiHome, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    // Log the error to an error reporting service in production
    console.error("Runtime error caught by boundary:", error);
  }, [error]);

  // Floating background warning particles
  const particles = [
    { id: 1, size: 140, x: "20%", y: "15%", color: "bg-red-500/10", delay: 0, duration: 9 },
    { id: 2, size: 160, x: "75%", y: "20%", color: "bg-amber-500/10", delay: 2, duration: 11 },
    { id: 3, size: 110, x: "65%", y: "70%", color: "bg-red-600/10", delay: 4, duration: 8 },
    { id: 4, size: 130, x: "15%", y: "75%", color: "bg-amber-600/5", delay: 1, duration: 10 },
  ];

  return (
    <div className="min-h-screen bg-grid-mesh flex flex-col items-center justify-center p-6 text-[var(--text-body)] bg-[var(--background)] transition-colors duration-300 relative overflow-hidden">
      {/* Background warning glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-red-600/5 blur-[140px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-amber-600/5 blur-[140px] rounded-full -z-10" />

      {/* Floating abstract decorative particles */}
      {particles.map((p) => (
        <m.div
          key={p.id}
          animate={{
            x: [0, 15, -15, 0],
            y: [0, -25, 25, 0],
            scale: [1, 1.03, 0.97, 1],
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
        className="glass-card max-w-md w-full p-8 md:p-10 rounded-3xl text-center shadow-2xl relative overflow-hidden border border-red-500/20 dark:border-red-500/10 bg-[var(--glass-card-bg)] backdrop-blur-md"
      >
        {/* Glow decoration */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 blur-2xl rounded-full" />
        
        {/* Glowing Alert Badge */}
        <m.div
          initial={{ y: 0 }}
          animate={{ y: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
          whileHover={{ scale: 1.08 }}
          className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white text-4xl font-extrabold shadow-xl shadow-red-600/25 mb-8 relative group cursor-default"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
          <FiAlertTriangle className="text-3xl" />
        </m.div>

        {/* Language Switcher Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {(['de', 'tr', 'en'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                language === lang
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/25 scale-105'
                  : 'bg-transparent text-[var(--text-muted)] border-[var(--glass-border)] hover:bg-zinc-800/10 dark:hover:bg-zinc-200/5'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[var(--text-main)] mb-3 leading-tight tracking-tight">
          {t.errorPage.title}
        </h1>

        {/* Description */}
        <p className="text-[var(--text-body)] text-sm mb-8 max-w-xs mx-auto leading-relaxed">
          {t.errorPage.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 border border-[var(--glass-border)] hover:border-red-500/30 text-[var(--text-main)] font-semibold rounded-2xl hover:bg-zinc-800/5 dark:hover:bg-zinc-200/5 transition-all duration-300 cursor-pointer"
          >
            <FiRefreshCw className="text-lg" />
            {t.errorPage.btnRetry}
          </button>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-red-600/20 hover:shadow-red-600/30 cursor-pointer"
          >
            <FiHome className="text-lg" />
            {t.errorPage.btnHome}
          </Link>
        </div>
      </m.div>
    </div>
  );
}
