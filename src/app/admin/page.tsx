"use client";

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AdminExperienceForm } from '@/components/AdminExperienceForm';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminPage() {
  const { language } = useLanguage();

  const adminTranslations = {
    de: {
      back: "Zurück zur Startseite",
      title: "Admin-Bereich (Nur Eren)",
      subtitle: "Erfahrungen verwalten und neue Firmen hinzufügen"
    },
    tr: {
      back: "Ana Sayfaya Dön",
      title: "Admin Paneli (Sadece Eren)",
      subtitle: "Deneyimleri yönetin ve yeni firma ekleyin"
    },
    en: {
      back: "Back to Home",
      title: "Admin Area (Eren Only)",
      subtitle: "Manage experiences and add new companies"
    }
  };

  const activeT = adminTranslations[language as 'de' | 'tr' | 'en'] || adminTranslations.de;

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-main)] transition-colors duration-300 flex flex-col justify-between">
      {/* Grid background lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] pointer-events-none" />

      {/* Header */}
      <Header activeColorIndex={-1} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--glass-border)] bg-zinc-900/10 hover:bg-zinc-800/20 text-[var(--text-body)] hover:text-[var(--text-main)] transition-all text-xs font-semibold active:scale-95 cursor-pointer"
          >
            <FiArrowLeft className="text-sm" />
            {activeT.back}
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
            {activeT.title}
          </h1>
          <p className="text-[var(--text-muted)] text-sm md:text-base mt-2">
            {activeT.subtitle}
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 md:p-8 border border-[var(--glass-border)] bg-[var(--glass-card-bg)]">
          <AdminExperienceForm forceOpen={true} />
        </div>
      </main>

      <Footer activeColorIndex={-1} />
      <ScrollToTopButton />
    </div>
  );
}
