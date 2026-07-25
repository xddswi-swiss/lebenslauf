"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "white" | "yellow" | "blue";

interface ThemeContextProps {
  theme: "dark" | "light";
  themeMode: ThemeMode;
  changeTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function updateSafariThemeColor(color: string) {
  if (typeof window === "undefined") return;

  const update = () => {
    // Remove all existing theme-color meta tags and create a fresh one so browsers
    // re-read the color immediately instead of caching the old value.
    document.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.remove());

    const meta = document.createElement("meta");
    meta.id = "theme-color-meta";
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("content", color);
    document.head.appendChild(meta);

    // Set background colors directly on html & body
    document.documentElement.style.backgroundColor = color;
    if (document.body) {
      document.body.style.backgroundColor = color;
    }
  };

  // Phase 1: Immediate update
  update();

  // Phase 2: Next frame after React DOM render
  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(() => {
      update();
    });
  }

  // Phase 3: 50ms delay for iOS Safari layout stabilization
  setTimeout(() => {
    update();
  }, 50);
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("white");

  const applyTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
    localStorage.setItem("theme-mode", mode);

    let color = "#ffffff";
    if (mode === "white") {
      document.documentElement.classList.add("bw-mode");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("bw-mode", "true");
      color = "#ffffff";
    } else if (mode === "yellow") {
      document.documentElement.classList.remove("bw-mode");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("bw-mode", "false");
      localStorage.setItem("preferred-theme", "light");
      color = "#ffc72c";
    } else if (mode === "blue") {
      document.documentElement.classList.remove("bw-mode");
      document.documentElement.classList.add("dark");
      localStorage.setItem("bw-mode", "false");
      localStorage.setItem("preferred-theme", "dark");
      color = "#102552";
    }

    // Update status bar color across 3 phases (Immediate, rAF, 50ms timeout)
    updateSafariThemeColor(color);

    window.dispatchEvent(new Event("bwModeChange"));
    window.dispatchEvent(new Event("themeChange"));
  };

  useEffect(() => {
    const isBw = document.documentElement.classList.contains("bw-mode");
    if (isBw) {
      setThemeMode("white");
      updateSafariThemeColor("#ffffff");
    } else if (document.documentElement.classList.contains("dark")) {
      setThemeMode("blue");
      updateSafariThemeColor("#102552");
    } else {
      setThemeMode("yellow");
      updateSafariThemeColor("#ffc72c");
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = themeMode === "blue" ? "yellow" : "blue";
    applyTheme(nextMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themeMode === "blue" ? "dark" : "light",
        themeMode,
        changeTheme: applyTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
