"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useTheme } from "@/app/contexts/ThemeContext";
import {
  FiDownload,
  FiInstagram,
  FiGithub,
  FiMail,
  FiLock,
} from "react-icons/fi";
import Link from "next/link";

// --- MANUEL DEĞİŞTİREBİLECEĞİNİZ İLETİŞİM / SOSYAL MEDYA LİNKLERİ ---
const LINK_GITHUB = "https://github.com/yigiterenaydin";
const LINK_INSTAGRAM = "https://www.instagram.com/eren_zhhh/";
const LINK_EMAIL = "mailto:eren.yigit.aydin@gmail.com"; // Kendi e-postanız ile değiştirebilirsiniz
const LINK_WHATSAPP = "https://wa.me/41762925353"; // Kendi WhatsApp numaranız ile değiştirebilirsiniz (Örn: https://wa.me/41XXXXXXXXX)
// -------------------------------------------------------------------

const techBadges = [
  { name: "React" },
  { name: "TypeScript" },
  { name: "Tailwind" },
  { name: "Next.js" },
  { name: "Node.js" },
  { name: "JavaScript" },
  { name: "HTML" },
  { name: "CSS" },
  { name: "Git" },
  { name: "GitHub" },
  { name: "Vercel" },
  { name: "Render" },
];

export interface FooterProps {
  activeColorIndex: number;
}

export const Footer: React.FC<FooterProps> = ({ activeColorIndex }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [footerStyle, setFooterStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (activeColorIndex === -1) {
      setFooterStyle({});
      return;
    }

    const lightGradients = [
      "linear-gradient(to right, rgba(255, 249, 233, 0.96) 0%, rgba(254, 226, 226, 0.92) 40%, rgba(239, 68, 68, 0.28) 75%, rgba(220, 38, 38, 0.20) 100%)", // 0. Crimson / Red (Matches Dark Volcanic Fire)
      "linear-gradient(to right, rgba(255, 249, 233, 0.96) 0%, rgba(237, 233, 254, 0.92) 40%, rgba(139, 92, 246, 0.28) 75%, rgba(99, 102, 241, 0.20) 100%)", // 1. Deep Purple / Indigo (Matches Dark Nebula)
      "linear-gradient(to right, rgba(255, 249, 233, 0.96) 0%, rgba(209, 250, 229, 0.92) 40%, rgba(16, 185, 129, 0.28) 75%, rgba(5, 150, 105, 0.20) 100%)", // 2. Emerald / Mint Green (Matches Dark Cyberpunk Green)
      "linear-gradient(to right, rgba(255, 249, 233, 0.96) 0%, rgba(253, 224, 241, 0.92) 40%, rgba(236, 72, 153, 0.28) 75%, rgba(168, 85, 247, 0.20) 100%)", // 3. Cosmic Rose / Pink-Violet (Matches Dark Cosmic Rose)
      "linear-gradient(to right, rgba(255, 249, 233, 0.96) 0%, rgba(224, 242, 254, 0.92) 40%, rgba(6, 182, 212, 0.28) 75%, rgba(59, 130, 246, 0.20) 100%)", // 4. Sky / Cyan Blue (Matches Dark Electric Cyan)
    ];

    const darkGradients = [
      "linear-gradient(to right, rgba(3, 3, 3, 0.96) 0%, rgba(242, 17, 55, 0.35) 60%, rgba(249, 115, 22, 0.25) 100%)", // 0. Volcanic Fire (Crimson-Orange)
      "linear-gradient(to right, rgba(3, 3, 3, 0.96) 0%, rgba(139, 92, 246, 0.35) 60%, rgba(59, 130, 246, 0.25) 100%)", // 1. Deep Nebula (Purple-Blue)
      "linear-gradient(to right, rgba(3, 3, 3, 0.96) 0%, rgba(16, 185, 129, 0.35) 60%, rgba(16, 185, 129, 0.25) 100%)", // 2. Cyberpunk Green (Teal-Emerald)
      "linear-gradient(to right, rgba(3, 3, 3, 0.96) 0%, rgba(236, 72, 153, 0.35) 60%, rgba(124, 58, 237, 0.25) 100%)", // 3. Cosmic Rose (Magenta-Violet)
      "linear-gradient(to right, rgba(3, 3, 3, 0.96) 0%, rgba(6, 182, 212, 0.35) 60%, rgba(59, 130, 246, 0.25) 100%)", // 4. Electric Cyan (Cyan-Blue)
    ];

    const index = activeColorIndex;
    const activeGradient =
      theme === "dark" ? darkGradients[index] : lightGradients[index];

    setFooterStyle({ background: activeGradient });
  }, [theme, activeColorIndex]);

  return (
    <footer
      style={footerStyle}
      className="mt-auto border-t border-[var(--glass-border)] bg-[var(--background)] py-16 px-6 md:px-12 text-[var(--text-muted)] transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 pb-12">
        {/* Column 1: Eren Portfolio */}
        <div className="md:col-span-4 space-y-6 text-left">
          <div>
            <h3 className="text-xl font-black text-[var(--text-main)] tracking-wider font-logo">
              EREN AYDIN
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--text-body)]">
              {t.footer.description}
            </p>
            
            {/* Additional Links like Cookie Settings */}
            <div className="flex items-center gap-4 mt-4 text-sm text-[var(--text-muted)]">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).showCookieSettings) {
                    (window as any).showCookieSettings();
                  }
                }}
                className="hover:text-[var(--text-main)] transition-colors underline decoration-[var(--text-muted)] underline-offset-4"
              >
                Cookie Settings
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">
              {t.footer.quickAccess}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/assets/pdfs/ErenLebensL.pdf"
                  download
                  className="hover:text-[var(--primary)] transition-colors flex items-center gap-1.5 w-fit"
                >
                  <FiDownload className="text-xs" /> {t.footer.resume} (PDF)
                </a>
              </li>
              <li>
                <a
                  href={LINK_GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--primary)] transition-colors w-fit block"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={LINK_EMAIL}
                  className="hover:text-[var(--primary)] transition-colors w-fit block"
                >
                  E-Mail
                </a>
              </li>
              <li>
                <a
                  href={LINK_WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--primary)] transition-colors w-fit block"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Column 2: Verwendete Technologien */}
        <div className="md:col-span-5 space-y-4 text-left">
          <h3 className="text-base font-bold text-[var(--text-main)] uppercase tracking-wider">
            {t.footer.technologiesTitle}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-body)]">
            {t.footer.technologiesDesc}
          </p>

          {/* Tech Badges Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2">
            {techBadges.map((tech, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 px-3 py-2 glass-card hover:border-[var(--primary)]/30 rounded-xl text-xs font-semibold text-[var(--text-body)] transition-all hover:scale-[1.03] duration-200 cursor-default"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary flex-shrink-0" />
                <span>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Contact/Socials */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h3 className="text-base font-bold text-[var(--text-main)] uppercase tracking-wider">
            {t.footer.contactTitle}
          </h3>

          {/* Social Icons Modern Grid */}
          <div className="flex flex-wrap gap-3">
            <a
              href={LINK_INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card hover:border-[var(--primary)] text-[var(--text-body)] hover:text-white hover:bg-[var(--primary)] rounded-2xl transition-all duration-300 hover:scale-105"
              aria-label="Instagram"
            >
              <FiInstagram className="text-lg" />
            </a>
            <a
              href={LINK_GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card hover:border-[var(--primary)] text-[var(--text-body)] hover:text-white hover:bg-[var(--primary)] rounded-2xl transition-all duration-300 hover:scale-105"
              aria-label="GitHub"
            >
              <FiGithub className="text-lg" />
            </a>
            <a
              href={LINK_EMAIL}
              className="p-3 glass-card hover:border-[var(--primary)] text-[var(--text-body)] hover:text-white hover:bg-[var(--primary)] rounded-2xl transition-all duration-300 hover:scale-105"
              aria-label="Email"
            >
              <FiMail className="text-lg" />
            </a>
            <a
              href={LINK_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 glass-card hover:border-[var(--primary)] text-[var(--text-body)] hover:text-white hover:bg-[var(--primary)] rounded-2xl transition-all duration-300 hover:scale-105"
              aria-label="WhatsApp"
            >
              <svg
                className="w-4.5 h-4.5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.792-4.382 9.795-9.786.002-2.618-1.01-5.08-2.858-6.93C16.315 2.04 13.856.819 11.238.819c-5.402 0-9.792 4.382-9.795 9.785-.002 1.702.459 3.364 1.34 4.814l-.995 3.636 3.73-.978zm11.272-6.725c-.3-.149-1.772-.874-2.047-.975-.276-.101-.476-.149-.675.149-.199.3-.772.975-.947 1.173-.175.199-.35.224-.65.075-.3-.149-1.265-.467-2.41-1.487-.89-.793-1.49-1.773-1.665-2.07-.175-.3-.019-.462.13-.611.135-.133.3-.349.45-.523.15-.174.2-.3.3-.497.1-.198.05-.374-.025-.524-.075-.15-.675-1.625-.925-2.227-.243-.586-.49-.508-.675-.517-.175-.009-.375-.01-.575-.01s-.525.075-.8.374c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.199 2.113 3.227 5.125 4.525.715.309 1.275.494 1.71.633.718.228 1.37.196 1.885.119.574-.086 1.772-.725 2.022-1.424.25-.699.25-1.299.175-1.424-.075-.125-.275-.199-.575-.349z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-[var(--glass-border)] pt-8 flex flex-col items-center gap-4 text-center">
        {/* Logo Badge */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-lg shadow-lg shadow-primary/20 hover:scale-110 transition-transform duration-300 cursor-default">
          E
        </div>
        <p className="text-xs flex items-center gap-1.5 justify-center">
          &copy; {new Date().getFullYear()} EREN AYDIN.{" "}
          {t.footer.rightsReserved}
          <Link
            href="/admin"
            className="opacity-20 hover:opacity-100 hover:text-primary transition-opacity ml-1 cursor-pointer"
            aria-label="Admin Login"
          >
            <FiLock className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </footer>
  );
};
