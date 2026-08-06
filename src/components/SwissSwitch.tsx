"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/contexts/ThemeContext";

interface SwissSwitchProps {
  asMenuItem?: boolean;
  onSelect?: () => void;
}

export const SwissSwitch: React.FC<SwissSwitchProps> = ({ asMenuItem, onSelect }) => {
  const { changeTheme, themeMode } = useTheme();
  const [bwMode, setBwMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const active = document.documentElement.classList.contains("bw-mode");
      setBwMode(active);

      const handleBwChange = () => {
        const currentActive =
          document.documentElement.classList.contains("bw-mode");
        setBwMode(currentActive);
      };

      window.addEventListener("bwModeChange", handleBwChange);
      return () => {
        window.removeEventListener("bwModeChange", handleBwChange);
      };
    }
  }, []);

  const playClickSound = (isOn: boolean) => {
    try {
      const audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.frequency.setValueAtTime(isOn ? 160 : 110, audioCtx.currentTime);
      osc.type = "triangle";

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.07,
      );

      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    } catch (e) {
      // Fail silently
    }
  };

  const activateBwMode = () => {
    changeTheme("white");
    playClickSound(true);
    onSelect?.();
  };

  // ── Dropdown menu item variant ──
  if (asMenuItem) {
    return (
      <button
        onClick={activateBwMode}
        aria-label="Toggle Black and White Mode"
        title="Schwarz-Weiss Design"
        className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-150 cursor-pointer hover:bg-white/10 ${themeMode === 'white' ? 'font-bold' : 'font-medium'}`}
      >
        <span
          className="w-5 h-5 rounded-full flex-shrink-0 shadow-md ring-1 ring-black/20"
          style={{ background: 'linear-gradient(135deg,#ffffff 50%,#000000 50%)' }}
        />
        <span className="flex-1 text-[var(--text-main)]">Black &amp; White</span>
        {themeMode === 'white' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
      </button>
    );
  }

  // ── Original flag stripe variant (fallback) ──
  return (
    <button
      onClick={activateBwMode}
      aria-label="Toggle Black and White Mode"
      title="Schwarz-Weiss Design"
      className={`flex-1 h-full bg-white/85 transition-all cursor-pointer hover:brightness-95 ${
        bwMode ? "theme-flag-bw-active-pulse" : ""
      }`}
    />
  );
};
