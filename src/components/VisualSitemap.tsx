"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { motion as m, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiFileText,
  FiBriefcase,
  FiCpu,
  FiBookOpen,
  FiMail,
  FiGlobe,
  FiCode,
  FiDownload,
  FiLock,
  FiExternalLink,
  FiCornerDownRight,
  FiChevronDown,
  FiMap,
} from "react-icons/fi";

export const VisualSitemap: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const labels = {
    de: {
      buttonShow: "Seitenstruktur & Sitemap anzeigen",
      buttonHide: "Seitenstruktur & Sitemap ausblenden",
      title: "Visuelle Seitenstruktur & Sitemap",
      subtitle: "Interaktive Knoten-Übersicht aller Bereiche und Systemressourcen.",
      rootNode: "Portfolio Hub",
      sectionsTitle: "Hauptbereiche",
      systemTitle: "System & SEO",
      hero: "Hero & Status",
      about: "Über mich",
      documents: "Zeugnisse & Unterlagen",
      experience: "Berufserfahrung",
      skills: "Fähigkeiten & Matrix",
      guestbook: "Gästebuch",
      contact: "Kontakt",
      sitemapXml: "XML Sitemap Feed",
      robotsTxt: "Robots Bot-Regeln",
      resumePdf: "Lebenslauf PDF",
      adminConsole: "Admin Konsole",
      liveBadge: "Aktiv",
    },
    tr: {
      buttonShow: "Site Haritası & Sayfa Yapısını Göster",
      buttonHide: "Site Haritası & Sayfa Yapısını Gizle",
      title: "Görsel Site Haritası & Sayfa Yapısı",
      subtitle: "Tüm ana bölümlerin ve sistem kaynaklarının interaktif ağ haritası.",
      rootNode: "Portfolio Ana Merkez",
      sectionsTitle: "Ana Bölümler",
      systemTitle: "Sistem & SEO Kaynakları",
      hero: "Giriş & Durum",
      about: "Hakkımda",
      documents: "Karne & Belgeler",
      experience: "Deneyim & Süreç",
      skills: "Yetenekler & Lazer Matrix",
      guestbook: "Ziyaretçi Defteri",
      contact: "İletişim",
      sitemapXml: "XML Site Haritası",
      robotsTxt: "Robots Bot Kuralları",
      resumePdf: "Özgeçmiş PDF",
      adminConsole: "Yönetici Paneli",
      liveBadge: "Canlı",
    },
    en: {
      buttonShow: "Show Site Structure & Sitemap",
      buttonHide: "Hide Site Structure & Sitemap",
      title: "Visual Sitemap & Page Hierarchy",
      subtitle: "Interactive node graph of all page sections and system endpoints.",
      rootNode: "Portfolio Root",
      sectionsTitle: "Main Sections",
      systemTitle: "System & SEO Resources",
      hero: "Hero & Status",
      about: "About Me",
      documents: "Report Cards & Documents",
      experience: "Experience & Timeline",
      skills: "Skills & Beam Scanner",
      guestbook: "Guestbook",
      contact: "Contact",
      sitemapXml: "XML Sitemap Feed",
      robotsTxt: "Robots Bot Rules",
      resumePdf: "Resume PDF",
      adminConsole: "Admin Console",
      liveBadge: "Active",
    },
  };

  const l = labels[language] || labels.de;

  const mainNodes = [
    { id: "hero", icon: <FiHome className="text-[var(--text-main)]" />, title: l.hero, anchor: true },
    { id: "about", icon: <FiUser className="text-[var(--text-main)]" />, title: l.about, anchor: true },
    { id: "documents", icon: <FiFileText className="text-[var(--text-main)]" />, title: l.documents, anchor: true },
    { id: "experience", icon: <FiBriefcase className="text-[var(--text-main)]" />, title: l.experience, anchor: true },
    { id: "skills", icon: <FiCpu className="text-[var(--text-main)]" />, title: l.skills, anchor: true },
    { id: "guestbook", icon: <FiBookOpen className="text-[var(--text-main)]" />, title: l.guestbook, anchor: true },
    { id: "contact", icon: <FiMail className="text-[var(--text-main)]" />, title: l.contact, anchor: true },
  ];

  const systemNodes = [
    { href: "/sitemap.xml", icon: <FiGlobe className="text-[var(--text-main)]" />, title: l.sitemapXml, badge: "XML" },
    { href: "/robots.txt", icon: <FiCode className="text-[var(--text-main)]" />, title: l.robotsTxt, badge: "TXT" },
    { href: "/assets/pdfs/ErenLebensL.pdf", icon: <FiDownload className="text-[var(--text-main)]" />, title: l.resumePdf, badge: "PDF", download: true },
    { href: "/admin", icon: <FiLock className="text-[var(--text-main)]" />, title: l.adminConsole, badge: "AUTH" },
  ];

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 text-center space-y-4">
      {/* Collapsible Trigger Button (Default Closed) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl glass-card hover:border-primary/50 text-[var(--text-main)] hover:text-primary font-bold text-xs md:text-sm transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary/10 group"
      >
        <FiMap className="text-base text-primary group-hover:scale-110 transition-transform" />
        <span>{isOpen ? l.buttonHide : l.buttonShow}</span>
        <FiChevronDown
          className={`text-base transition-transform duration-300 ${
            isOpen ? "rotate-180 text-primary" : "text-[var(--text-muted)]"
          }`}
        />
      </button>

      {/* Accordion Collapsible Sitemap Body */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden text-left"
          >
            <div className="p-6 md:p-8 rounded-3xl border-2 border-[var(--glass-border)] bg-[var(--background)] space-y-8">
              {/* Sitemap Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--glass-border)] pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <h3 className="text-xl md:text-2xl font-black text-[var(--text-main)] font-logo tracking-wide">
                      {l.title}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-[var(--text-muted)]">
                    {l.subtitle}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span>{l.liveBadge}</span>
                </div>
              </div>

              {/* Graphical Tree Architecture */}
              <div className="space-y-5">
                {/* Root Node */}
                <div className="flex items-center gap-2.5 p-2.5 px-4 rounded-xl bg-primary/10 border border-primary/30 w-fit">
                  <FiGlobe className="text-base text-primary" />
                  <span className="font-mono text-xs font-bold text-[var(--text-main)]">
                    https://erenaydin.ch
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-primary text-white ml-1.5">
                    {l.rootNode}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
                  {/* Column 1: Main Page Sections */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      <FiCornerDownRight className="text-primary text-xs" />
                      <span>{l.sectionsTitle}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {mainNodes.map((node) => (
                        <button
                          key={node.id}
                          onClick={() => handleScrollTo(node.id)}
                          className="flex items-center justify-between p-2 px-3 rounded-xl glass-card hover:border-primary/50 text-left transition-all duration-200 group cursor-pointer border border-[var(--glass-border)]"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="p-1.5 rounded-lg bg-[var(--background)] border border-[var(--glass-border)] group-hover:scale-110 transition-transform text-sm">
                              {node.icon}
                            </span>
                            <span className="text-xs font-semibold text-[var(--text-main)] group-hover:text-primary transition-colors">
                              {node.title}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform">
                            #{node.id}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: System & SEO Resources */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      <FiCornerDownRight className="text-primary text-xs" />
                      <span>{l.systemTitle}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {systemNodes.map((node, idx) => (
                        <a
                          key={idx}
                          href={node.href}
                          target={node.href.startsWith("/") ? "_self" : "_blank"}
                          download={node.download}
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 px-3 rounded-xl glass-card hover:border-primary/50 text-left transition-all duration-200 group cursor-pointer border border-[var(--glass-border)]"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="p-1.5 rounded-lg bg-[var(--background)] border border-[var(--glass-border)] group-hover:scale-110 transition-transform text-sm">
                              {node.icon}
                            </span>
                            <span className="text-xs font-semibold text-[var(--text-main)] group-hover:text-primary transition-colors">
                              {node.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--glass-border)] text-[var(--text-muted)]">
                              {node.badge}
                            </span>
                            <FiExternalLink className="text-[11px] text-[var(--text-muted)] group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
