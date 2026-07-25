"use client";

import React from "react";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { motion as m } from "framer-motion";
import { FiUserCheck, FiBookOpen, FiMonitor, FiHeart } from "react-icons/fi";
import { SkillsBeamScanner } from "./SkillsBeamScanner";

interface Skill {
  id: string;
  name: string;
  level: number; // 0-100 for visual indicators
}

interface SkillCategory {
  key: "personal" | "school" | "digital" | "hobbies";
  icon: React.ReactNode;
}

interface SkillsGridProps {
  selectedMatcher?: "kaufmann" | "elektro" | null;
}

export const SkillsGrid: React.FC<SkillsGridProps> = ({
  selectedMatcher = null,
}) => {
  const { t } = useLanguage();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isSkillMatching = (skillId: string) => {
    if (!selectedMatcher) return true;
    const s = skillId.toLowerCase();
    if (selectedMatcher === "kaufmann") {
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
    }
    if (selectedMatcher === "elektro") {
      return [
        "reliability",
        "learning",
        "responsibility",
        "geometry",
        "math",
        "hardware",
        "kung-fu",
      ].includes(s);
    }
    return true;
  };

  const categories: SkillCategory[] = [
    {
      key: "personal",
      icon: (
        <FiUserCheck className="text-xl text-orange-700 dark:text-orange-400" />
      ),
    },
    {
      key: "school",
      icon: <FiBookOpen className="text-xl text-navy-700 dark:text-navy-400" />,
    },
    {
      key: "digital",
      icon: (
        <FiMonitor className="text-xl text-green-700 dark:text-green-400" />
      ),
    },
    {
      key: "hobbies",
      icon: (
        <FiHeart className="text-xl text-orange-700 dark:text-orange-400" />
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 },
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-0">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-[var(--text-main)] mb-2 bg-gradient-to-r from-title-from to-title-to bg-clip-text text-transparent inline-block">
          {t.skills.title}
        </h2>
        <p className="text-[var(--text-muted)] max-w-3xl mx-auto text-sm md:text-base">
          {t.skills.subtitle}
        </p>
      </div>

      <SkillsBeamScanner selectedMatcher={selectedMatcher} />
    </div>
  );
};
