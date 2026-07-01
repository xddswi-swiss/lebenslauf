"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AdminExperienceForm } from '@/components/AdminExperienceForm';
import { AdminDocumentForm } from '@/components/AdminDocumentForm';
import { AdminGuestbookTab } from '@/components/AdminGuestbookTab';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollToTopButton } from '@/components/ScrollToTopButton';
import { FiArrowLeft, FiLock, FiUnlock, FiAlertCircle, FiChevronRight, FiBriefcase, FiLogOut, FiFileText, FiMessageSquare } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminPage() {
  const { language } = useLanguage();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [activeTab, setActiveTab] = useState('experiences');

  const adminTranslations = {
    de: {
      back: "Zurück zur Startseite",
      title: "Admin-Dashboard",
      subtitle: "Verwalten Sie Ihre Inhalte an einem zentralen Ort.",
      passTitle: "Admin-Login",
      passDesc: "Geben Sie das Passwort ein, um das Dashboard freizuschalten.",
      passPlaceholder: "Passwort eingeben...",
      passBtn: "Einloggen",
      passError: "Falsches Passwort!",
      logout: "Abmelden",
      menuTitle: "Menü / Sektionen",
      tabExperiences: "Neue Schnupperlehre",
      tabDocuments: "Bewerbungsunterlagen",
      tabGuestbook: "Ziyaretçi Defteri (Gästebuch)"
    },
    tr: {
      back: "Ana Sayfaya Dön",
      title: "Admin Paneli",
      subtitle: "İçeriklerinizi tek bir noktadan yönetin.",
      passTitle: "Yönetici Girişi",
      passDesc: "Paneli açmak için şifreyi girin.",
      passPlaceholder: "Şifre girin...",
      passBtn: "Giriş Yap",
      passError: "Yanlış Şifre!",
      logout: "Çıkış Yap",
      menuTitle: "Menü / Bölümler",
      tabExperiences: "Yeni Deneyim Ekle",
      tabDocuments: "Başvuru Belgeleri",
      tabGuestbook: "Ziyaretçi Defteri"
    },
    en: {
      back: "Back to Home",
      title: "Admin Dashboard",
      subtitle: "Manage your portfolio content in one place.",
      passTitle: "Admin Login",
      passDesc: "Enter the passcode to unlock the dashboard.",
      passPlaceholder: "Enter passcode...",
      passBtn: "Login",
      passError: "Incorrect Passcode!",
      logout: "Logout",
      menuTitle: "Menu / Sections",
      tabExperiences: "Add New Experience",
      tabDocuments: "Application Docs",
      tabGuestbook: "Guestbook Entries"
    }
  };

  const activeT = adminTranslations[language as 'de' | 'tr' | 'en'] || adminTranslations.de;

  useEffect(() => {
    const checkAdmin = () => {
      if (typeof window !== 'undefined') {
        const isUnlockedLocally = localStorage.getItem('admin_unlocked') === 'true';
        setIsUnlocked(isUnlockedLocally);
      }
    };
    checkAdmin();
    window.addEventListener('admin-state-changed', checkAdmin);
    return () => {
      window.removeEventListener('admin-state-changed', checkAdmin);
    };
  }, []);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'eren2026') {
      setIsUnlocked(true);
      setPasscodeError('');
      localStorage.setItem('admin_unlocked', 'true');
      localStorage.setItem('admin_passcode', passcode);
      window.dispatchEvent(new Event('admin-state-changed'));
    } else {
      setPasscodeError(activeT.passError);
    }
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    setPasscode('');
    localStorage.removeItem('admin_unlocked');
    localStorage.removeItem('admin_passcode');
    window.dispatchEvent(new Event('admin-state-changed'));
  };

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text-main)] transition-colors duration-300 flex flex-col justify-between">
      {/* Grid background lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] pointer-events-none" />

      <Header activeColorIndex={-1} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-32 pb-24 relative z-10">
        {/* Top bar (Back Link & Logout) */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--glass-border)] bg-zinc-900/10 hover:bg-zinc-800/20 text-[var(--text-body)] hover:text-[var(--text-main)] transition-all text-xs font-semibold active:scale-95 cursor-pointer"
          >
            <FiArrowLeft className="text-sm" />
            {activeT.back}
          </Link>

          {isUnlocked && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 text-rose-500 hover:text-rose-600 transition-all text-xs font-semibold active:scale-95 cursor-pointer"
            >
              <FiLogOut className="text-sm" />
              {activeT.logout}
            </button>
          )}
        </div>

        {!isUnlocked ? (
          /* Locked State - Centralized Login Card */
          <div className="max-w-md mx-auto my-12 glass-card rounded-3xl p-8 border border-[var(--glass-border)] bg-[var(--glass-card-bg)] shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
            <form onSubmit={handlePasscodeSubmit} className="text-center space-y-6">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <FiLock className="text-2xl" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-[var(--text-main)]">{activeT.passTitle}</h2>
                <p className="text-xs text-[var(--text-muted)]">{activeT.passDesc}</p>
              </div>

              <div className="space-y-4">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={activeT.passPlaceholder}
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-950/40 border border-neutral-400 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none text-[var(--text-main)] text-center font-bold tracking-widest transition-all"
                />
                {passcodeError && (
                  <p className="text-xs text-red-500 font-semibold flex items-center justify-center gap-1.5">
                    <FiAlertCircle className="text-sm" /> {passcodeError}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-primary hover:opacity-90 text-white text-sm font-bold shadow-lg shadow-primary/10 transition-all cursor-pointer active:scale-98"
                >
                  {activeT.passBtn}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Unlocked State - Sidebar Dashboard Menu */
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
                {activeT.title}
              </h1>
              <p className="text-[var(--text-muted)] text-sm md:text-base mt-2">
                {activeT.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Sidebar Menu */}
              <div className="lg:col-span-4 glass-card rounded-3xl p-5 border border-[var(--glass-border)] bg-[var(--glass-card-bg)] space-y-4">
                <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-3">
                  {activeT.menuTitle}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('experiences')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === 'experiences'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'hover:bg-zinc-800/10 text-[var(--text-body)]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FiBriefcase className="text-base" />
                      <span>{activeT.tabExperiences}</span>
                    </span>
                    <FiChevronRight className={`text-base transition-transform ${activeTab === 'experiences' ? 'rotate-90' : ''}`} />
                  </button>

                   <button
                    onClick={() => setActiveTab('documents')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === 'documents'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'hover:bg-zinc-800/10 text-[var(--text-body)]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FiFileText className="text-base" />
                      <span>{activeT.tabDocuments}</span>
                    </span>
                    <FiChevronRight className={`text-base transition-transform ${activeTab === 'documents' ? 'rotate-90' : ''}`} />
                  </button>

                  <button
                    onClick={() => setActiveTab('guestbook')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
                      activeTab === 'guestbook'
                        ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                        : 'hover:bg-zinc-800/10 text-[var(--text-body)]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <FiMessageSquare className="text-base" />
                      <span>{activeT.tabGuestbook}</span>
                    </span>
                    <FiChevronRight className={`text-base transition-transform ${activeTab === 'guestbook' ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="lg:col-span-8 glass-card rounded-3xl p-6 md:p-8 border border-[var(--glass-border)] bg-[var(--glass-card-bg)] min-h-[450px]">
                {activeTab === 'experiences' && (
                  <div className="space-y-6 animate-fade-in">
                    <AdminExperienceForm forceOpen={true} />
                  </div>
                )}
                {activeTab === 'documents' && (
                  <div className="space-y-6 animate-fade-in">
                    <AdminDocumentForm />
                  </div>
                )}
                {activeTab === 'guestbook' && (
                  <div className="space-y-6 animate-fade-in">
                    <AdminGuestbookTab />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer activeColorIndex={-1} />
      <ScrollToTopButton />
    </div>
  );
}
