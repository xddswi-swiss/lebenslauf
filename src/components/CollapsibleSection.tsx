"use client";

import React, { useState } from "react";
import { motion as m, AnimatePresence } from "framer-motion";

interface CollapsibleSectionProps {
  /** Unique per page — the panel gets `${id}-panel` for aria-controls. */
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Sections start open: this is a CV, nothing should be hidden by default. */
  defaultOpen?: boolean;
  /** Smaller heading and button, for use outside the main content column. */
  compact?: boolean;
}

/**
 * A section heading with a round +/× button that collapses the content below it.
 *
 * The heading and subtitle deliberately live outside the collapsible region, so
 * a closed section still names itself. That is what allows the button to carry
 * no text label — the heading next to it supplies the context.
 *
 * The glyph is a single "+" rotated 45° rather than a "+"/"−" swap: both of
 * those characters are symmetric about a 180° turn, so rotating them animates
 * nothing a visitor can see.
 */
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  title,
  subtitle,
  children,
  defaultOpen = true,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = `${id}-panel`;

  return (
    <div>
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-center">
          <h2
            className={`${
              compact ? "text-lg md:text-xl" : "text-3xl"
            } font-extrabold text-[var(--text-main)] mb-2 bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block`}
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-[var(--text-muted)] text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`section-toggle flex-shrink-0 inline-flex items-center justify-center ${
            compact ? "w-9 h-9 md:w-10 md:h-10" : "w-11 h-11 md:w-12 md:h-12"
          } rounded-full glass-card border border-[var(--glass-border)] cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 outline-none select-none`}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={title}
        >
          <m.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`${
              compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
            } font-black leading-none inline-block`}
          >
            +
          </m.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            id={panelId}
            key={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
