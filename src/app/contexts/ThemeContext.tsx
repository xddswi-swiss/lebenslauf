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

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>("white");

  const applyTheme = (mode: ThemeMode) => {
    setThemeMode(mode);

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

    // Direct status bar update on theme change (exact user snippet pattern)
    let meta = document.getElementById("theme-color-meta") as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement("meta");
      meta.id = "theme-color-meta";
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", color);

    document.documentElement.style.backgroundColor = color;
    document.body.style.backgroundColor = color;

    window.dispatchEvent(new Event("bwModeChange"));
    window.dispatchEvent(new Event("themeChange"));
  };

  useEffect(() => {
    const isBw = document.documentElement.classList.contains("bw-mode");
    if (isBw) {
      setThemeMode("white");
    } else if (document.documentElement.classList.contains("dark")) {
      setThemeMode("blue");
    } else {
      setThemeMode("yellow");
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
