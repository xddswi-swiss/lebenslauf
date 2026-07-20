"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SwissSwitch } from "@/components/SwissSwitch";
import { motion as m, AnimatePresence } from "framer-motion";
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
  FiMessageSquare,
} from "react-icons/fi";

// --- NAVİGASYON (HEADER) DİNAMİK RENK AYARI ---
// Her sayfa açılışında farklı bir degrade renk teması uygulanmasını istiyorsanız true yapın.
// Eğer sabit (eski) rengi kullanmak isterseniz false yapabilirsiniz:
const ENABLE_RANDOM_HEADER_GRADIENT = true;
// ----------------------------------------------

export interface HeaderProps {
  activeColorIndex: number;
}

export const Header: React.FC<HeaderProps> = ({ activeColorIndex }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleThemeSelect = (targetTheme: "light" | "dark") => {
    if (typeof window !== "undefined") {
      const isBw = document.documentElement.classList.contains("bw-mode");
      if (isBw) {
        document.documentElement.classList.remove("bw-mode");
        localStorage.setItem("bw-mode", "false");
        window.dispatchEvent(new Event("bwModeChange"));
      }
    }
    if (theme !== targetTheme) {
      toggleTheme();
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerStyle, setHeaderStyle] = useState<React.CSSProperties>({});
  const [drawerStyle, setDrawerStyle] = useState<React.CSSProperties>({});
  const [activeSection, setActiveSection] = useState<string>("");

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px", // Trigger when section is in the top 20-30% of viewport
      },
    );

    navLinks.forEach((link) => {
      const sectionId = link.href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [language]); // Re-bind observer if language changes (though IDs remain same, safe measure)

  // Sync mobile status bar color (theme-color meta tag) with current theme
  useEffect(() => {
    const updateThemeColor = () => {
      const isBw = document.documentElement.classList.contains("bw-mode");
      const isDark = document.documentElement.classList.contains("dark");

      let color = "#ffffff"; // BW Mode (White)
      if (!isBw) {
        color = isDark ? "#020617" : "#d9dc00"; // Dark Blue or Yellow
      }

      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "theme-color");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", color);
    };

    updateThemeColor();

    const observer = new MutationObserver(updateThemeColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("bwModeChange", updateThemeColor);

    return () => {
      observer.disconnect();
      window.removeEventListener("bwModeChange", updateThemeColor);
    };
  }, []);

  const navLinks = [
    {
      href: "#about",
      label: t.nav.about,
      icon: <FiUser className="text-lg" />,
    },
    {
      href: "#documents",
      label: t.nav.documents,
      icon: <FiFileText className="text-lg" />,
    },
    {
      href: "#experience",
      label: t.nav.experience,
      icon: <FiBriefcase className="text-lg" />,
    },
    {
      href: "#skills",
      label: t.nav.skills,
      icon: <FiAward className="text-lg" />,
    },
    {
      href: "#details",
      label: t.nav.details,
      icon: <FiSliders className="text-lg" />,
    },
    {
      href: "#contact",
      label: t.nav.contact,
      icon: <FiMail className="text-lg" />,
    },
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
      "linear-gradient(to right, rgba(6, 182, 212, 0.10) 0%, rgba(59, 130, 246, 0.10) 100%)", // 4. Electric Cyan (Cyan-Blue)
    ];

    const darkGradients = [
      "linear-gradient(to right, rgba(242, 17, 55, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)", // 0. Volcanic Fire (Red-Orange)
      "linear-gradient(to right, rgba(139, 92, 246, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)", // 1. Deep Nebula (Purple-Blue)
      "linear-gradient(to right, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)", // 2. Cyberpunk Green (Teal-Emerald)
      "linear-gradient(to right, rgba(236, 72, 153, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)", // 3. Cosmic Rose (Magenta-Violet)
      "linear-gradient(to right, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)", // 4. Electric Cyan (Cyan-Blue)
    ];

    const lightDrawers = [
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(254, 226, 226, 0.35) 70%, rgba(239, 68, 68, 0.22) 100%)",
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(237, 233, 254, 0.35) 70%, rgba(139, 92, 246, 0.22) 100%)",
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(209, 250, 229, 0.35) 70%, rgba(16, 185, 129, 0.22) 100%)",
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(253, 224, 241, 0.35) 70%, rgba(236, 72, 153, 0.22) 100%)",
      "linear-gradient(to bottom, rgba(255, 249, 233, 0.98) 0%, rgba(224, 242, 254, 0.35) 70%, rgba(6, 182, 212, 0.22) 100%)",
    ];

    const darkDrawers = [
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(242, 17, 55, 0.25) 70%, rgba(249, 115, 22, 0.15) 100%)",
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(139, 92, 246, 0.25) 70%, rgba(59, 130, 246, 0.15) 100%)",
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(16, 185, 129, 0.25) 70%, rgba(16, 185, 129, 0.15) 100%)",
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(236, 72, 153, 0.25) 70%, rgba(124, 58, 237, 0.15) 100%)",
      "linear-gradient(to bottom, rgba(3, 3, 3, 0.98) 0%, rgba(6, 182, 212, 0.25) 70%, rgba(59, 130, 246, 0.15) 100%)",
    ];

    const index = activeColorIndex;
    const activeGradient =
      theme === "dark" ? darkGradients[index] : lightGradients[index];
    const activeDrawer =
      theme === "dark" ? darkDrawers[index] : lightDrawers[index];

    setHeaderStyle({
      backgroundImage: activeGradient,
      backgroundColor: "var(--glass-bg)",
    });
    setDrawerStyle({ background: activeDrawer });
  }, [theme, activeColorIndex]);

  // Animation variants for sidebar items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 15,
      },
    },
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
            className="text-xl font-black bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent font-logo"
          >
            EREN AYDIN
          </m.a>

          {/* Desktop Navigation & Actions */}
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
              {navLinks.map((link) => {
                const sectionId = link.href.substring(1);
                const isActive = activeSection === sectionId;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setActiveSection(sectionId)}
                    className={`relative py-1.5 transition-colors duration-300 ${
                      isActive
                        ? "text-[var(--text-main)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <m.span
                        layoutId="activeNavIndicator"
                        className="absolute left-0 bottom-0 w-full h-[2px] bg-primary rounded-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-1">
              <LanguageSwitcher />

              {/* Theme Selector (White / Yellow / Blue Squares) */}
              <div className="flex gap-1 items-center bw-switch-container">
                <SwissSwitch />
                <button
                  onClick={() => handleThemeSelect("light")}
                  aria-label="Light Theme"
                  className={`w-7 h-7 rounded-lg bg-[#FFC72C] border transition-all cursor-pointer hover:scale-110 ${
                    theme === "light"
                      ? "border-black border-2 scale-105"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                />
                <button
                  onClick={() => handleThemeSelect("dark")}
                  aria-label="Dark Theme"
                  className={`w-7 h-7 rounded-lg bg-[#2563eb] border transition-all cursor-pointer hover:scale-110 ${
                    theme === "dark"
                      ? "border-white border-2 scale-105"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                />
              </div>
            </div>

            {/* Mobile Menu Actions */}
            <div className="flex lg:hidden items-center gap-1">
              {/* Theme Selector (White / Yellow / Blue Squares) */}
              <div className="flex gap-1 items-center bw-switch-container">
                <SwissSwitch />
                <button
                  onClick={() => handleThemeSelect("light")}
                  aria-label="Light Theme"
                  className={`w-7 h-7 rounded-lg bg-[#FFC72C] border transition-all cursor-pointer hover:scale-110 ${
                    theme === "light"
                      ? "border-black border-2 scale-105"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                />
                <button
                  onClick={() => handleThemeSelect("dark")}
                  aria-label="Dark Theme"
                  className={`w-7 h-7 rounded-lg bg-[#2563eb] border transition-all cursor-pointer hover:scale-110 ${
                    theme === "dark"
                      ? "border-white border-2 scale-105"
                      : "border-zinc-300 dark:border-zinc-700"
                  }`}
                />
              </div>

              {/* Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Mobile Menu"
                className="p-2.5 rounded-full glass-card text-[var(--text-body)] hover:text-[var(--text-main)] transition-all cursor-pointer ml-1"
              >
                <FiMenu className="text-base" />
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
              className="mobile-drawer fixed right-0 top-0 bottom-0 w-[85%] max-w-[340px] z-[70] h-full shadow-2xl flex flex-col p-6 border-l border-[var(--glass-border)] lg:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-[var(--glass-border)] mb-6">
                <span className="text-lg font-black bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent font-logo">
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
                {navLinks.map((link) => {
                  const sectionId = link.href.substring(1);
                  const isActive = activeSection === sectionId;

                  return (
                    <m.a
                      variants={itemVariants}
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setActiveSection(sectionId);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl glass-card border transition-all group ${
                        isActive
                          ? "border-primary/50 bg-primary/10 text-[var(--text-main)]"
                          : "border-[var(--glass-border)] hover:border-primary/20 text-[var(--text-body)] hover:text-[var(--text-main)] hover:bg-primary/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`p-2 rounded-xl transition-transform ${
                            isActive
                              ? "bg-primary/20 dark:bg-primary/40 text-primary dark:text-white scale-110 ring-1 ring-primary/30 dark:ring-primary/60"
                              : "bg-[var(--badge-bg)] text-primary group-hover:scale-110"
                          }`}
                        >
                          {link.icon}
                        </span>
                        <span className="text-sm font-bold tracking-wide">
                          {link.label}
                        </span>
                      </div>
                      <FiChevronRight
                        className={`transition-transform ${isActive ? "text-primary translate-x-1" : "text-[var(--text-muted)] group-hover:translate-x-1"}`}
                      />
                    </m.a>
                  );
                })}
              </m.nav>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-[var(--glass-border)] mt-auto space-y-6">
                {/* Language Switcher */}
                <div className="flex items-center justify-center gap-1 w-full">
                  <LanguageSwitcher />
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
      {/* Floating Vertical Language Switcher for Mobile (Right Side, vertically stacked) */}
      <div className="fixed right-1 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 p-1.5 rounded-2xl bg-[var(--glass-card-bg)]/80 shadow-2xl lg:hidden">
        {(["de", "tr", "en"] as const).map((code) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-xl text-[10px] font-extrabold tracking-wider transition-all duration-300 cursor-pointer ${
              language === code
                ? "active-language-btn bg-primary text-white shadow-md scale-105 font-black"
                : "inactive-language-btn text-[var(--text-body)] hover:text-[var(--text-main)] hover:bg-zinc-800/10 dark:hover:bg-zinc-200/10"
            }`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
};
