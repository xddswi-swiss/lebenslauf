"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { motion as m, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiMenu,
  FiX,
  FiUser,
  FiFileText,
  FiBriefcase,
  FiAward,
  FiMail,
  FiChevronRight,
  FiChevronDown,
  FiGithub,
  FiInstagram,
  FiMessageSquare,
  FiLock,
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
  const { theme } = useTheme();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerStyle, setHeaderStyle] = useState<React.CSSProperties>({});
  const [activeSection, setActiveSection] = useState<string>("");
  const [openDesktopGroup, setOpenDesktopGroup] = useState<string | null>(
    null,
  );
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement>(null);

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
      // Acts like "Home": jumps to the very top of the page (hero photo +
      // greeting), not the #about section further down.
      key: "about",
      href: "#hero",
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

  // Kept out of navGroups/navLinks on purpose: those drive the section
  // IntersectionObserver, and /admin is a route rather than an anchor.
  const adminLink = { href: "/admin", label: t.nav.admin };

  // Lock the page behind the drawer and let Escape close it. Without the lock
  // the body kept scrolling under the open drawer on touch.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Highlight whichever section is currently under the top of the viewport.
  // This has to sit below navLinks — it used to run 80 lines above the
  // declaration and read it out of the closure, which meant a language switch
  // rebuilt navLinks but left the observer bound to the previous array.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    navLinks.forEach((link) => {
      const element = document.getElementById(link.href.substring(1));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [navLinks]);

  useEffect(() => {
    if (!ENABLE_RANDOM_HEADER_GRADIENT || activeColorIndex === -1) {
      setHeaderStyle({});
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

    const index = activeColorIndex;
    const activeGradient =
      theme === "dark" ? darkGradients[index] : lightGradients[index];

    setHeaderStyle({
      backgroundImage: activeGradient,
      backgroundColor: "var(--glass-bg)",
    });
  }, [theme, activeColorIndex]);

  // Animation variants for sidebar items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { delayChildren: 0.08, staggerChildren: 0.055 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 26 },
    show: {
      opacity: 1,
      x: 0,
      transition: { type: "spring" as const, stiffness: 420, damping: 30 },
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

            {/* Theme Selector Dropdown */}
            <div
              className="flex items-center ml-2 lg:ml-3"
              title="Design wechseln / Tema değiştir / Change theme"
            >
              <ThemeSwitcher />
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
                          initial={{ opacity: 0, scaleY: 0.85, y: -4 }}
                          animate={{ opacity: 1, scaleY: 1, y: 0 }}
                          exit={{ opacity: 0, scaleY: 0.85, y: -4 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          style={{ transformOrigin: "top" }}
                          className="absolute top-full left-0 mt-2 min-w-[180px] rounded-xl border border-[var(--glass-border)] bg-[var(--glass-card-bg)] backdrop-blur-md shadow-2xl p-1.5 flex flex-col z-50"
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
                                className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                                  isChildActive
                                    ? "bg-primary/10 text-[var(--text-main)] font-semibold"
                                    : "text-[var(--text-body)] hover:bg-primary/5 hover:text-[var(--text-main)]"
                                }`}
                              >
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

            <Link
              href={adminLink.href}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card text-sm font-semibold text-[var(--text-body)] hover:text-[var(--text-main)] transition-all"
            >
              <FiLock className="text-sm" />
              {adminLink.label}
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Actions */}
            <div className="flex lg:hidden items-center gap-1">
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
              role="dialog"
              aria-modal="true"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="mobile-drawer fixed right-0 top-0 bottom-0 w-[85%] max-w-[340px] z-[70] h-full shadow-2xl flex flex-col p-6 border-l border-[var(--glass-border)] lg:hidden"
            >
              {/* Drawer Header */}
              <div className="drawer-head">
                <span className="text-lg font-black bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent font-logo">
                  EREN AYDIN
                </span>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close Mobile Menu"
                  className="drawer-close"
                >
                  <FiX className="text-lg" />
                </button>
              </div>

              {/* Drawer Links */}
              <m.nav
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="drawer-nav"
              >
                {navLinks.map((link) => {
                  const sectionId = link.href.substring(1);
                  const isActive = activeSection === sectionId;

                  return (
                    <m.a
                      variants={itemVariants}
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => {
                        setActiveSection(sectionId);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`drawer-item${isActive ? " is-active" : ""}`}
                    >
                      <span className="drawer-item-main">
                        <span className="drawer-chip">{link.icon}</span>
                        <span className="drawer-label">{link.label}</span>
                      </span>
                      <FiChevronRight className="drawer-arrow" />
                    </m.a>
                  );
                })}

                <m.div variants={itemVariants} className="drawer-admin">
                  <Link
                    href={adminLink.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="drawer-item"
                  >
                    <span className="drawer-item-main">
                      <span className="drawer-chip">
                        <FiLock className="text-lg" />
                      </span>
                      <span className="drawer-label">{adminLink.label}</span>
                    </span>
                    <FiChevronRight className="drawer-arrow" />
                  </Link>
                </m.div>
              </m.nav>

              {/* Drawer Footer */}
              <div className="drawer-foot">
                <div className="flex items-center justify-center gap-1 w-full">
                  <LanguageSwitcher />
                </div>

                <div className="drawer-social">
                  <a
                    href="https://github.com/yigiterenaydin"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <FiGithub className="text-lg" />
                  </a>
                  <a
                    href="https://www.instagram.com/eren_zhhh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <FiInstagram className="text-lg" />
                  </a>
                  <a
                    href="mailto:eren.yigit.aydin@gmail.com"
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
