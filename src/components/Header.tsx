"use client";

import React, { useState, useEffect, useRef } from "react";
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
  FiChevronDown,
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
  const { theme, themeMode, changeTheme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerStyle, setHeaderStyle] = useState<React.CSSProperties>({});
  const [drawerStyle, setDrawerStyle] = useState<React.CSSProperties>({});
  const [activeSection, setActiveSection] = useState<string>("");
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(
    null,
  );
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [navWidth, setNavWidth] = useState<number | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number | null>(null);

  // Measure the desktop nav's rendered width and the header's own full
  // height, so the theme flag can be stretched to match the nav's width and
  // fill the header's height edge-to-edge (no top/bottom gap).
  useEffect(() => {
    const measure = () => {
      if (navRef.current) {
        setNavWidth(navRef.current.offsetWidth);
      }
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    const id = window.setTimeout(measure, 300); // after fonts/layout settle
    return () => {
      window.removeEventListener("resize", measure);
      window.clearTimeout(id);
    };
  }, [language]);

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

  // NOTE: Mobile status bar (theme-color meta tag) syncing is handled
  // centrally in ThemeContext.tsx's applyTheme()/updateSafariThemeColor().
  // A duplicate MutationObserver + event-listener sync used to live here too,
  // firing the same update 3-4x per theme switch from slightly different
  // code paths — harmless in the end result but noisy and a source of
  // confusion when debugging the "stuck one step behind" status bar bug.
  // Removed to keep a single source of truth.

  // Desktop nav groups: related sections are combined under one parent with
  // a dropdown, so the horizontal bar doesn't overflow (7 flat items used to
  // wrap/overflow in some browsers, e.g. Edge). Mobile drawer + the active-
  // section scroll observer still use the flattened `navLinks` below, so
  // nothing changes there.
  const navGroups: {
    key: string;
    href?: string;
    label: string;
    icon: React.ReactNode;
    children?: { href: string; label: string; icon: React.ReactNode }[];
  }[] = [
    {
      key: "about",
      href: "#about",
      label: t.nav.about,
      icon: <FiUser className="text-lg" />,
    },
    {
      key: "resume",
      label: t.nav.resume,
      icon: <FiFileText className="text-lg" />,
      children: [
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
      ],
    },
    {
      // No dropdown here anymore: Fähigkeiten (#skills) and Kompetenzen
      // (#details) sit right next to each other on the page already, so a
      // single link to #skills covers both — no need to make the visitor
      // pick one from a submenu.
      key: "skillsGroup",
      href: "#skills",
      label: t.nav.skills,
      icon: <FiAward className="text-lg" />,
    },
    {
      key: "contactGroup",
      label: t.nav.contact,
      icon: <FiMail className="text-lg" />,
      children: [
        {
          href: "#guestbook",
          label: t.nav.guestbook,
          icon: <FiMessageSquare className="text-lg" />,
        },
        {
          href: "#contact",
          label: t.nav.contact,
          icon: <FiMail className="text-lg" />,
        },
      ],
    },
  ];

  const navLinks = navGroups.flatMap((group) =>
    group.children
      ? group.children
      : [{ href: group.href!, label: group.label, icon: group.icon }],
  );

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
        duration: 0.22,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <>
      <header
        ref={headerRef}
        style={headerStyle}
        className="fixed top-0 left-0 right-0 w-full z-50 header-glass-gradient px-6 py-4 transition-all duration-300"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <m.a
              href="#"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-black bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent font-logo"
            >
              EREN AYDIN
            </m.a>

            {/* Theme Selector — a small flag: three color stripes flush
                together in one shared frame (like the reference flag image),
                instead of separate rounded squares. */}
            <div
              className="hidden lg:flex items-center ml-1"
              title="Design wechseln / Tema değiştir / Change theme"
            >
              <div
                className="flex items-stretch rounded-md overflow-hidden border border-black/20 dark:border-white/30 shadow-sm bw-switch-container -my-4"
                style={{
                  width: navWidth
                    ? `${Math.round(navWidth * 0.35)}px`
                    : "5.5rem",
                  height: headerHeight ? `${headerHeight}px` : "2rem",
                }}
              >
                <SwissSwitch />
                <button
                  onClick={() => changeTheme("yellow")}
                  aria-label="Light Theme"
                  title="Gelbes Design"
                  className={`flex-1 h-full bg-[#FFC72C] transition-all cursor-pointer hover:brightness-95 ${
                    themeMode === "yellow" ? "theme-flag-yellow-active-pulse" : ""
                  }`}
                />
                <button
                  onClick={() => changeTheme("blue")}
                  aria-label="Dark Theme"
                  title="Blaues Design"
                  className={`flex-1 h-full bg-[#2563eb] transition-all cursor-pointer hover:brightness-95 ${
                    themeMode === "blue" ? "theme-flag-active-pulse" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="flex items-center gap-4">
            <nav
              ref={navRef}
              className="hidden lg:flex items-center gap-6 text-sm font-semibold"
            >
              {navGroups.map((group) => {
                // ---- Single top-level link (no dropdown) ----
                if (!group.children) {
                  const sectionId = group.href!.substring(1);
                  const isActive = activeSection === sectionId;

                  return (
                    <a
                      key={group.key}
                      href={group.href}
                      onClick={() => setActiveSection(sectionId)}
                      className={`relative py-1.5 transition-colors duration-300 ${
                        isActive
                          ? "text-[var(--text-main)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      {group.label}
                      {isActive && (
                        <m.span
                          layoutId="activeNavIndicator"
                          className="active-nav-indicator absolute left-0 bottom-0 w-full h-[3.5px] bg-primary rounded-full"
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
                }

                // ---- Grouped link with dropdown ----
                const isGroupActive = group.children.some(
                  (child) => activeSection === child.href.substring(1),
                );
                const isOpen = openDesktopGroup === group.key;

                return (
                  <div
                    key={group.key}
                    className="relative"
                    onMouseEnter={() => setOpenDesktopGroup(group.key)}
                    onMouseLeave={() => setOpenDesktopGroup(null)}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDesktopGroup(isOpen ? null : group.key)
                      }
                      aria-expanded={isOpen}
                      className={`relative flex items-center gap-1 py-1.5 cursor-pointer transition-colors duration-300 ${
                        isGroupActive
                          ? "text-[var(--text-main)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
                      }`}
                    >
                      {group.label}
                      <FiChevronDown
                        className={`text-xs transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                      {isGroupActive && (
                        <m.span
                          layoutId="activeNavIndicator"
                          className="active-nav-indicator absolute left-0 bottom-0 w-full h-[3.5px] bg-primary rounded-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <m.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] backdrop-blur-md shadow-2xl p-2 flex flex-col gap-1 z-50"
                        >
                          {group.children.map((child) => {
                            const childSectionId = child.href.substring(1);
                            const isChildActive =
                              activeSection === childSectionId;
                            return (
                              <a
                                key={child.href}
                                href={child.href}
                                onClick={() => {
                                  setActiveSection(childSectionId);
                                  setOpenDesktopGroup(null);
                                }}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors duration-200 ${
                                  isChildActive
                                    ? "bg-primary/10 text-[var(--text-main)]"
                                    : "text-[var(--text-body)] hover:bg-primary/5 hover:text-[var(--text-main)]"
                                }`}
                              >
                                <span className="text-primary">
                                  {child.icon}
                                </span>
                                {child.label}
                              </a>
                            );
                          })}
                        </m.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-1">
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Actions */}
            <div className="flex lg:hidden items-center gap-1">
              {/* Theme Selector — same flag design as desktop, also
                  stretched edge-to-edge vertically (no top/bottom gap) */}
              <div
                className="flex items-stretch w-16 rounded-md overflow-hidden border border-black/20 dark:border-white/30 shadow-sm bw-switch-container -my-4"
                style={{ height: headerHeight ? `${headerHeight}px` : "2rem" }}
              >
                <SwissSwitch />
                <button
                  onClick={() => changeTheme("yellow")}
                  aria-label="Light Theme"
                  className={`flex-1 h-full bg-[#FFC72C] transition-all cursor-pointer ${
                    themeMode === "yellow" ? "theme-flag-yellow-active-pulse" : ""
                  }`}
                />
                <button
                  onClick={() => changeTheme("blue")}
                  aria-label="Dark Theme"
                  className={`flex-1 h-full bg-[#2563eb] transition-all cursor-pointer ${
                    themeMode === "blue" ? "theme-flag-active-pulse" : ""
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
              transition={{ duration: 0.3, ease: "easeOut" }}
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
