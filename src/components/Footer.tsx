"use client";

import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { SITE_LAST_UPDATED } from "@/data/translations";
import { FiDownload, FiInstagram, FiGithub, FiMail } from "react-icons/fi";
import Link from "next/link";
import { VisualSitemap } from "@/components/VisualSitemap";

// --- MANUEL DEĞİŞTİREBİLECEĞİNİZ İLETİŞİM / SOSYAL MEDYA LİNKLERİ ---
const LINK_GITHUB = "https://github.com/yigiterenaydin";
const LINK_INSTAGRAM = "https://www.instagram.com/eren_zhhh/";
const LINK_EMAIL = "mailto:eren.yigit.aydin@gmail.com"; // Kendi e-postanız ile değiştirebilirsiniz
const LINK_WHATSAPP = "https://wa.me/41762925353"; // Kendi WhatsApp numaranız ile değiştirebilirsiniz (Örn: https://wa.me/41XXXXXXXXX)
// -------------------------------------------------------------------

// Only what actually distinguishes this build. The previous list padded itself
// out to twelve entries with HTML, CSS, JavaScript and GitHub, which say
// nothing, and claimed Render, which the project does not use — while leaving
// out Supabase, which it does.
const techBadges = ["Next.js", "TypeScript", "Tailwind", "Supabase"];

const socialLinks = [
  { href: LINK_INSTAGRAM, label: "Instagram", icon: <FiInstagram className="text-lg" />, external: true },
  { href: LINK_GITHUB, label: "GitHub", icon: <FiGithub className="text-lg" />, external: true },
  { href: LINK_EMAIL, label: "E-Mail", icon: <FiMail className="text-lg" />, external: false },
  {
    href: LINK_WHATSAPP,
    label: "WhatsApp",
    external: true,
    icon: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.792-4.382 9.795-9.786.002-2.618-1.01-5.08-2.858-6.93C16.315 2.04 13.856.819 11.238.819c-5.402 0-9.792 4.382-9.795 9.785-.002 1.702.459 3.364 1.34 4.814l-.995 3.636 3.73-.978zm11.272-6.725c-.3-.149-1.772-.874-2.047-.975-.276-.101-.476-.149-.675.149-.199.3-.772.975-.947 1.173-.175.199-.35.224-.65.075-.3-.149-1.265-.467-2.41-1.487-.89-.793-1.49-1.773-1.665-2.07-.175-.3-.019-.462.13-.611.135-.133.3-.349.45-.523.15-.174.2-.3.3-.497.1-.198.05-.374-.025-.524-.075-.15-.675-1.625-.925-2.227-.243-.586-.49-.508-.675-.517-.175-.009-.375-.01-.575-.01s-.525.075-.8.374c-.275.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.199 2.113 3.227 5.125 4.525.715.309 1.275.494 1.71.633.718.228 1.37.196 1.885.119.574-.086 1.772-.725 2.022-1.424.25-.699.25-1.299.175-1.424-.075-.125-.275-.199-.575-.349z" />
      </svg>
    ),
  },
];

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const openCookieSettings = () => {
    // A window event rather than a global function on `window`: CookieConsent
    // listens for it, so the button works no matter which component mounts
    // first and nothing has to be cast to `any`.
    window.dispatchEvent(new Event("open-cookie-settings"));
  };

  return (
    <footer className="relative z-10 mt-auto border-t border-[var(--glass-border)] bg-[var(--background)] py-16 px-6 md:px-12 text-[var(--text-muted)] transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 pb-12">
        {/* Identity */}
        <div className="md:col-span-4 space-y-4 text-left">
          <h3 className="text-xl font-black text-[var(--text-main)] tracking-wider font-logo">
            EREN AYDIN
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-body)]">
            {t.footer.description}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {t.footer.lastUpdated}: {SITE_LAST_UPDATED}
          </p>
        </div>

        {/* Contact — the widest block, because that is the point of the site */}
        <div className="md:col-span-5 space-y-4 text-left">
          <h3 className="text-base font-bold text-[var(--text-main)] uppercase tracking-wider">
            {t.footer.contactTitle}
          </h3>

          {/* Social links live here only. They used to be duplicated as a text
              list in the first column as well. */}
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="p-3 glass-card hover:border-[var(--primary)] text-[var(--text-body)] hover:text-white hover:bg-[var(--primary)] rounded-2xl transition-all duration-300 hover:scale-105"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>

          <a
            href="/assets/pdfs/ErenLebensL.pdf"
            download
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-body)] hover:text-primary transition-colors w-fit"
          >
            <FiDownload className="text-sm" />
            {t.footer.resume} (PDF)
          </a>
        </div>

        {/* Built with */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h3 className="text-base font-bold text-[var(--text-main)] uppercase tracking-wider">
            {t.footer.technologiesTitle}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text-body)]">
            {t.footer.technologiesDesc}
          </p>
          <div className="flex flex-wrap gap-2">
            {techBadges.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 glass-card rounded-lg text-xs font-semibold text-[var(--text-body)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <VisualSitemap />

      <div className="border-t border-[var(--glass-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} EREN AYDIN. {t.footer.rightsReserved}
        </p>

        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/datenschutz"
            className="hover:text-primary hover:underline transition-colors"
          >
            {t.footer.privacy}
          </Link>
          <button
            type="button"
            onClick={openCookieSettings}
            className="hover:text-primary hover:underline transition-colors cursor-pointer"
          >
            {t.footer.cookieSettings}
          </button>
        </div>
      </div>
    </footer>
  );
};
