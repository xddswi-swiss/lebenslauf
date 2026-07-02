"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useTheme } from '@/app/contexts/ThemeContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SwissSwitch } from '@/components/SwissSwitch';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  FiSun, 
  FiMoon, 
  FiMenu, 
  FiX, 
  FiUser, 
  FiFileText, 
  FiBriefcase, 
  FiAward, 
  FiSliders, 
  FiMail, 
  FiChevronRight, 
  FiGithub, 
  FiInstagram,
  FiMessageSquare
} from 'react-icons/fi';

// --- NAVİGASYON (HEADER) DİNAMİK RENK AYARI ---
// Her sayfa açılışında farklı bir degrade renk teması uygulanmasını istiyorsanız true yapın.
// Eğer sabit (eski) rengi kullanmak isterseniz false yapabilirsiniz:
const ENABLE_RANDOM_HEADER_GRADIENT = true; 
// ----------------------------------------------

export interface HeaderProps {
  activeColorIndex: number;
}

export const Header: React.FC<HeaderProps> = ({ activeColorIndex }) => {
  const { t, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerStyle, setHeaderStyle] = useState<React.CSSProperties>({});
  const [drawerStyle, setDrawerStyle] = useState<React.CSSProperties>({});

  const navLinks = [
    { href: "#about", label: t.nav.about, icon: <FiUser className="text-lg" /> },
    { href: "#documents", label: t.nav.documents, icon: <FiFileText className="text-lg" /> },
    { href: "#experience", label: t.nav.experience, icon: <FiBriefcase className="text-lg" /> },
    { href: "#skills", label: t.nav.skills, icon: <FiAward className="text-lg" /> },
    { href: "#details", label: t.nav.details, icon: <FiSliders className="text-lg" /> },
    { href: "#contact", label: t.nav.contact, icon: <FiMail className="text-lg" /> }
  ];

  useEffect(() => {
    if (!ENABLE_RANDOM_HEADER_GRADIENT || activeColorIndex === -1) {
      setHeaderStyle({});
      setDrawerStyle({});
      return;
    }
    const lightGradients = [
      "linear-gradient(to right, rgba(239, 68, 68, 0.10) 0%, rgba(249, 115, 22, 0.10) 100%)", // 0. Volcanic Fire (Red-Orange)
      "linear-gradient(to right, rgba(139, 92, 246, 0.10) 0%, rgba(99, 102, 241, 0.10) 100%)", // 1. Deep Nebula (Purple-Blue)
      "linear-gradient(to right, rgba(16, 185, 129, 0.10) 0%, rgba(5, 150, 105, 0.10) 100%)", // 2. Cyberpunk Green (Teal-Emerald)
      "linear-gradient(to right, rgba(236, 72, 153, 0.10) 0%, rgba(168, 85, 247, 0.10) 100%)", // 3. Cosmic Rose (Magenta-Violet)
      "linear-gradient(to right, rgba(6, 182, 212, 0.10) 0%, rgba(59, 130, 246, 0.10) 100%)"   // 4. Electric Cyan (Cyan-Blue)
    ];

    const darkGradients = [
      "linear-gradient(to right, rgba(242, 17, 55, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)", // 0. Volcanic Fire (Red-Orange)
      "linear-gradient(to right, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)", // 1. Deep Nebula (Purple-Blue)
      "linear-gradient(to right, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)", // 2. Cyberpunk Green (Teal-Emerald)
      "linear-gradient(to right, rgba(236, 72, 153, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)", // 3. Cosmic Rose (Magenta-Violet)
      "linear-gradient(to right, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)"   // 4. Electric Cyan (Cyan-Blue)
    ];

    const lightDrawers = [
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(254, 226, 226, 0.35) 70%, rgba(239, 68, 68, 0.22) 100%)",
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(237, 233, 254, 0.35) 70%, rgba(139, 92, 246, 0.22) 100%)",
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(209, 250, 229, 0.35) 70%, rgba(16, 185, 129, 0.22) 100%)",
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(253, 224, 241, 0.35) 70%, rgba(236, 72, 153, 0.22) 100%)",
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(224, 242, 254, 0.35) 70%, rgba(6, 182, 212, 0.22) 100%)"
    ];

    const darkDrawers = [
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(242, 17, 55, 0.25) 70%, rgba(249, 115, 22, 0.15) 100%)",
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(139, 92, 246, 0.25) 70%, rgba(59, 130, 246, 0.15) 100%)",
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(16, 185, 129, 0.25) 70%, rgba(16, 185, 129, 0.15) 100%)",
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(236, 72, 153, 0.25) 70%, rgba(124, 58, 237, 0.15) 100%)",
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(6, 182, 212, 0.25) 70%, rgba(59, 130, 246, 0.15) 100%)"
    ];

    const index = activeColorIndex;
    const activeGradient = theme === 'dark' ? darkGradients[index] : lightGradients[index];
    const activeDrawer = theme === 'dark' ? darkDrawers[index] : lightDrawers[index];

    setHeaderStyle({
      backgroundImage: activeGradient,
      backgroundColor: theme === 'dark' ? 'rgba(9, 9, 11, 0.90)' : 'rgba(255, 249, 233, 0.90)'
    });
    setDrawerStyle({ background: activeDrawer });
  }, [theme, activeColorIndex]);

  // Animation variants for sidebar items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        type: "spring" as const, 
        stiffness: 120, 
        damping: 15 
      } 
    }
  };

  return (
    <>
      <header 
        style={headerStyle}
        className="sticky top-0 z-50 header-glass-gradient px-6 py-4 transition-all duration-300"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <m.a 
            href="#" 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-black bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent"
          >
            EREN AYDIN
          </m.a>

          {/* Desktop Navigation & Actions */}
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[var(--text-muted)]">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className="hover:text-[var(--text-main)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />

              {/* Swiss Light Switch (B&W Mode) */}
              <SwissSwitch />

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2.5 rounded-full glass-card text-[var(--text-body)] hover:text-[var(--text-main)] transition-all cursor-pointer"
              >
                {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
              </button>
            </div>

            {/* Mobile Menu Actions */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Swiss Light Switch (B&W Mode) */}
              <SwissSwitch />

              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2.5 rounded-full glass-card text-[var(--text-body)] hover:text-[var(--text-main)] transition-all cursor-pointer"
              >
                {theme === 'dark' ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
              </button>

              {/* Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Mobile Menu"
                className="p-2.5 rounded-full glass-card text-[var(--text-body)] hover:text-[var(--text-main)] transition-all cursor-pointer"
              >
                <FiMenu className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md lg:hidden"
            />
            {/* Drawer Sidebar */}
            <m.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              style={drawerStyle}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[340px] z-[70] h-full shadow-2xl flex flex-col p-6 border-l border-[var(--glass-border)] lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[var(--glass-border)] mb-6">
                <span className="text-lg font-black bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent">
                  EREN AYDIN
                </span>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close Mobile Menu"
                  className="p-2.5 rounded-full glass-card text-[var(--text-body)] hover:text-[var(--text-main)] hover:rotate-90 duration-200 transition-all cursor-pointer"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* Drawer Links */}
              <m.nav 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3.5 flex-1 overflow-y-auto pr-1"
              >
                {navLinks.map((link) => (
                  <m.a
                    variants={itemVariants}
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3.5 rounded-2xl glass-card border border-[var(--glass-border)] hover:border-primary/20 text-[var(--text-body)] hover:text-[var(--text-main)] hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-[var(--badge-bg)] text-primary group-hover:scale-110 transition-transform">
                        {link.icon}
                      </span>
                      <span className="text-sm font-bold tracking-wide">
                        {link.label}
                      </span>
                    </div>
                    <FiChevronRight className="text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
                  </m.a>
                ))}
              </m.nav>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-[var(--glass-border)] mt-auto space-y-6">
                {/* Language Switcher */}
                <div className="flex justify-center w-full">
                  <LanguageSwitcher inline />
                </div>

                {/* Social media shortcuts */}
                <div className="flex justify-center gap-4 text-[var(--text-muted)]">
                  <a 
                    href="https://github.com/yigiterenaydin" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 glass-card rounded-xl hover:text-white hover:bg-primary hover:border-primary transition-all duration-300"
                    aria-label="GitHub"
                  >
                    <FiGithub className="text-lg" />
                  </a>
                  <a 
                    href="https://www.instagram.com/eren_zhhh/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2.5 glass-card rounded-xl hover:text-white hover:bg-primary hover:border-primary transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <FiInstagram className="text-lg" />
                  </a>
                  <a 
                    href="mailto:eren.yigit.aydin@gmail.com" 
                    className="p-2.5 glass-card rounded-xl hover:text-white hover:bg-primary hover:border-primary transition-all duration-300"
                    aria-label="Email"
                  >
                    <FiMail className="text-lg" />
                  </a>
                </div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
