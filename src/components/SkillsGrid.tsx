"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUserCheck,
  FiBookOpen,
  FiMonitor,
  FiHeart,
  FiGlobe,
  FiSmile,
} from "react-icons/fi";
import { languagesData } from "@/data/translations";

type CategoryKey =
  | "personal"
  | "school"
  | "digital"
  | "hobbies"
  | "languages"
  | "interests";

interface SkillsGridProps {
  selectedMatcher?: "kaufmann" | "elektro" | null;
}

const ICONS: Record<CategoryKey, React.ElementType> = {
  personal: FiUserCheck,
  school: FiBookOpen,
  digital: FiMonitor,
  hobbies: FiHeart,
  languages: FiGlobe,
  interests: FiSmile,
};

/* ------------------------------------------------------------------ */
/* Single animated skill row: name + drawing line + percentage        */
/* ------------------------------------------------------------------ */
const SkillRow: React.FC<{
  name: string;
  level: number;
  index: number;
  note?: string;
}> = ({ name, level, index, note }) => (
  <motion.div
    className="sa-item"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.14 + index * 0.07, duration: 0.28, ease: "easeOut" }}
  >
    <div className="flex justify-between items-center mb-1">
      <span className="sa-name !mb-0">
        {name}{" "}
        {note && (
          <span className="text-[10px] text-[var(--text-muted)] font-normal ml-1">
            ({note})
          </span>
        )}
      </span>
    </div>
    <div className="sa-bar-row">
      <div className="sa-track">
        <motion.div
          className="sa-fill"
          initial={{ width: "0%" }}
          animate={{ width: `${level}%` }}
          transition={{
            delay: 0.22 + index * 0.07,
            duration: 0.8,
            ease: [0.19, 1, 0.22, 1],
          }}
        />
      </div>
      <span className="sa-pct">{level}%</span>
    </div>
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */
export const SkillsGrid: React.FC<SkillsGridProps> = ({
  selectedMatcher = null,
}) => {
  const { t, language } = useLanguage();
  // Hepsi kapalı başlasın diye default null
  const [active, setActive] = useState<CategoryKey | null>(null);

  const isMatching = (id: string) => {
    if (!selectedMatcher) return true;
    const s = id.toLowerCase();
    if (selectedMatcher === "kaufmann")
      return [
        "teamwork",
        "helpfulness",
        "responsibility",
        "german",
        "turkish",
        "english",
        "word",
        "excel",
        "powerpoint",
        "media",
      ].includes(s);
    if (selectedMatcher === "elektro")
      return [
        "reliability",
        "learning",
        "responsibility",
        "geometry",
        "math",
        "hardware",
        "kung-fu",
      ].includes(s);
    return true;
  };

  const categories: CategoryKey[] = [
    "personal",
    "school",
    "digital",
    "hobbies",
    "languages",
    "interests",
  ];

  // Interests items from translations details.interests
  const interestList = Object.entries(t.details.interests).map(
    ([key, label]) => ({
      id: key,
      name: label as string,
    })
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* ---- Heading ---- */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
          {t.skills.title}
        </h2>
        <p className="text-[var(--text-muted)] max-w-3xl mx-auto text-sm md:text-base mt-2">
          {t.skills.subtitle}
        </p>
      </div>

      {/* ---- Accordion ---- */}
      <div className="sa-wrap" role="list">
        {categories.map((key) => {
          const isActive = active === key;
          const Icon = ICONS[key];

          let label = "";
          if (key === "languages") label = t.details.languagesTitle;
          else if (key === "interests") label = t.details.interestsTitle;
          else label = t.skills.categories[key];

          // Formatted items
          const currentLangData =
            languagesData[language] || languagesData["de"] || [];

          const isLang = key === "languages";
          const isInterests = key === "interests";

          return (
            <div
              key={key}
              className={`sa-panel${isActive ? " sa-active" : ""}`}
              role="listitem"
              aria-expanded={isActive}
              onClick={() => setActive(isActive ? null : key)}
              onKeyDown={(e) =>
                e.key === "Enter" && setActive(isActive ? null : key)
              }
              tabIndex={0}
            >
              {/* ---- Panel header ---- */}
              <div className={`sa-head${isActive ? " sa-head-open" : ""}`}>
                <Icon className="sa-ico" aria-hidden="true" />
                <span className="sa-lbl">{label}</span>
              </div>

              {/* ---- Expanded content ---- */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    key={key + "-body"}
                    className="sa-body"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  >
                    {/* Scanner beam that sweeps top → bottom */}
                    <motion.div
                      className="sa-beam"
                      initial={{ top: "0%", opacity: 1 }}
                      animate={{ top: "110%", opacity: 0 }}
                      transition={{ duration: 0.55, ease: "easeIn" }}
                    />

                    {/* Different view for Interests vs Bars */}
                    {isInterests ? (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {interestList.map((item, i) => (
                          <motion.span
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 0.1 + i * 0.04,
                              duration: 0.2,
                            }}
                            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--glass-card-bg)] border border-[var(--glass-border)] text-[var(--text-main)] shadow-sm hover:border-[var(--primary)] transition-colors cursor-default"
                          >
                            {item.name}
                          </motion.span>
                        ))}
                      </div>
                    ) : isLang ? (
                      currentLangData.map((item, i) => (
                        <SkillRow
                          key={item.code}
                          name={item.name}
                          level={item.level}
                          note={item.note}
                          index={i}
                        />
                      ))
                    ) : (
                      t.skills.items[key]
                        .filter((s) => isMatching(s.id))
                        .map((item, i) => (
                          <SkillRow
                            key={item.id}
                            name={item.name}
                            level={item.level}
                            index={i}
                          />
                        ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
