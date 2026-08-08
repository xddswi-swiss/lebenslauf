"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiDownload } from "react-icons/fi";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface PdfPreviewProps {
  /** Path to the PDF, or null when nothing is open. */
  file: string | null;
  title: string;
  onClose: () => void;
}

const labels = {
  de: { close: "Schliessen", download: "Herunterladen" },
  tr: { close: "Kapat", download: "İndir" },
  en: { close: "Close", download: "Download" },
};

/**
 * Reads a document without downloading it first.
 *
 * Desktop only by design — the caller opens a new tab on touch devices
 * instead, because iOS Safari does not render a PDF inside an iframe and would
 * show an empty frame here.
 */
export const PdfPreview: React.FC<PdfPreviewProps> = ({
  file,
  title,
  onClose,
}) => {
  const { language } = useLanguage();
  const l = labels[language] || labels.de;

  useEffect(() => {
    if (!file) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    // Hold the page still behind the overlay.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [file, onClose]);

  if (!file || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl h-full max-h-[88vh] flex flex-col rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--background)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--glass-border)]">
          <h3 className="flex-1 min-w-0 truncate text-sm font-bold text-[var(--text-main)]">
            {title}
          </h3>

          <a
            href={file}
            download={`${title}.pdf`}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold glass-card border border-[var(--glass-border)] text-[var(--text-body)] hover:text-primary transition-colors"
          >
            <FiDownload className="text-sm" />
            {l.download}
          </a>

          <button
            type="button"
            onClick={onClose}
            aria-label={l.close}
            className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg glass-card border border-[var(--glass-border)] text-[var(--text-body)] hover:text-primary transition-colors"
          >
            <FiX />
          </button>
        </div>

        <iframe src={file} title={title} className="flex-1 w-full border-0" />
      </div>
    </div>,
    document.body,
  );
};
