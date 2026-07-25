"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiUserCheck, FiBookOpen, FiMonitor, FiHeart } from "react-icons/fi";

type CategoryKey = "personal" | "school" | "digital" | "hobbies";

interface SkillsGridProps {
  selectedMatcher?: "kaufmann" | "elektro" | null;
}

const ICONS: Record<CategoryKey, React.ElementType> = {
  personal: FiUserCheck,
  school: FiBookOpen,
  digital: FiMonitor,
  hobbies: FiHeart,
};

/* ------------------------------------------------------------------ */
/* Single animated skill row: name + drawing line + percentage        */
/* ------------------------------------------------------------------ */
const SkillRow: React.FC<{
  name: string;
  level: number;
  index: number;
}> = ({ name, level, index }) => (
  <motion.div
    className="sa-item"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.14 + index * 0.07, duration: 0.28, ease: "easeOut" }}
  >
    <span className="sa-name">{name}</span>
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
  const { t } = useLanguage();
  const [active, setActive] = useState<CategoryKey>("personal");

  const isMatching = (id: string) => {
    if (!selectedMatcher) return true;
    const s = id.toLowerCase();
    if (selectedMatcher === "kaufmann")
      return [
        "teamwork", "helpfulness", "responsibility",
        "german", "turkish", "english",
        "word", "excel", "powerpoint", "media",
      ].includes(s);
    if (selectedMatcher === "elektro")
      return [
        "reliability", "learning", "responsibility",
        "geometry", "math", "hardware", "kung-fu",
      ].includes(s);
    return true;
  };

  const categories: CategoryKey[] = ["personal", "school", "digital", "hobbies"];

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
          const skills = t.skills.items[key].filter((s) => isMatching(s.id));
          const label = t.skills.categories[key];

          return (
            <div
              key={key}
              className={`sa-panel${isActive ? " sa-active" : ""}`}
              role="listitem"
              aria-expanded={isActive}
              onClick={() => !isActive && setActive(key)}
              onKeyDown={(e) => e.key === "Enter" && setActive(key)}
              tabIndex={isActive ? -1 : 0}
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

                    {/* Skill rows */}
                    {skills.map((skill, i) => (
                      <SkillRow
                        key={skill.id}
                        name={skill.name}
                        level={skill.level}
                        index={i}
                      />
                    ))}
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
