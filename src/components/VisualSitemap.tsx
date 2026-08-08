"use client";

import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import {
  FiUser,
  FiFileText,
  FiBriefcase,
  FiCpu,
  FiBookOpen,
  FiMail,
  FiGlobe,
  FiDownload,
} from "react-icons/fi";

export const VisualSitemap: React.FC = () => {
  const { t, language } = useLanguage();

  const labels = {
    de: {
      title: "Seitenstruktur",
      subtitle: "Direkt zu einem Abschnitt springen.",
      sections: "Abschnitte",
      files: "Dateien",
      sitemapXml: "Sitemap",
      resumePdf: "Lebenslauf PDF",
    },
    tr: {
      title: "Sayfa Yapısı",
      subtitle: "Doğrudan bir bölüme atlayın.",
      sections: "Bölümler",
      files: "Dosyalar",
      sitemapXml: "Site Haritası",
      resumePdf: "Özgeçmiş PDF",
    },
    en: {
      title: "Site Structure",
      subtitle: "Jump straight to a section.",
      sections: "Sections",
      files: "Files",
      sitemapXml: "Sitemap",
      resumePdf: "Resume PDF",
    },
  };

  const l = labels[language] || labels.de;

  // Section names are read from the nav translations instead of being spelled
  // out again here. The previous version kept its own copy and drifted out of
  // step with the page: it still advertised a "Beam Scanner" long after that
  // component was removed, and the three languages disagreed with each other.
  const sections = [
    { id: "about", icon: <FiUser />, title: t.nav.about },
    { id: "documents", icon: <FiFileText />, title: t.nav.documents },
    { id: "experience", icon: <FiBriefcase />, title: t.nav.experience },
    { id: "skills", icon: <FiCpu />, title: t.nav.skills },
    { id: "guestbook", icon: <FiBookOpen />, title: t.nav.guestbook },
    { id: "contact", icon: <FiMail />, title: t.nav.contact },
  ];

  // Only files a visitor has a reason to open. robots.txt is written for
  // crawlers, and the admin console does not belong in a public index.
  const files = [
    {
      href: "/assets/pdfs/ErenLebensL.pdf",
      icon: <FiDownload />,
      title: l.resumePdf,
      badge: "PDF",
      download: true,
    },
    {
      href: "/sitemap.xml",
      icon: <FiGlobe />,
      title: l.sitemapXml,
      badge: "XML",
      download: false,
    },
  ];

  const handleScrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const rowClass =
    "flex items-center justify-between gap-3 p-2 px-3 rounded-xl glass-card border border-[var(--glass-border)] hover:border-primary/50 text-left transition-colors duration-200 group cursor-pointer";
  const iconClass =
    "p-1.5 rounded-lg bg-[var(--background)] border border-[var(--glass-border)] text-sm text-[var(--text-main)] group-hover:scale-110 transition-transform";
  const titleClass =
    "text-xs font-semibold text-[var(--text-main)] group-hover:text-primary transition-colors";
  const columnHeadClass =
    "text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2";

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <CollapsibleSection
        id="sitemap"
        title={l.title}
        subtitle={l.subtitle}
        defaultOpen={false}
        compact
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left pt-1">
          <div>
            <div className={columnHeadClass}>{l.sections}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sections.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => handleScrollTo(node.id)}
                  className={rowClass}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className={iconClass}>{node.icon}</span>
                    <span className={titleClass}>{node.title}</span>
                  </span>
                  <span className="text-[9px] font-mono text-[var(--text-muted)] flex-shrink-0">
                    #{node.id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className={columnHeadClass}>{l.files}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {files.map((file) => (
                <a
                  key={file.href}
                  href={file.href}
                  download={file.download || undefined}
                  className={rowClass}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className={iconClass}>{file.icon}</span>
                    <span className={titleClass}>{file.title}</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--background)] border border-[var(--glass-border)] text-[var(--text-muted)] flex-shrink-0">
                    {file.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};
