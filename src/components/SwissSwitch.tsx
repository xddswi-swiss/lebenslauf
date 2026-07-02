"use client";

import React, { useState, useEffect } from 'react';

export const SwissSwitch: React.FC = () => {
  const [bwMode, setBwMode] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const active = document.documentElement.classList.contains('bw-mode');
      setBwMode(active);

      const handleBwChange = () => {
        const currentActive = document.documentElement.classList.contains('bw-mode');
        setBwMode(currentActive);
      };

      window.addEventListener('bwModeChange', handleBwChange);
      return () => {
        window.removeEventListener('bwModeChange', handleBwChange);
      };
    }
  }, []);

  const playClickSound = (isOn: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.frequency.setValueAtTime(isOn ? 160 : 110, audioCtx.currentTime);
      osc.type = 'triangle';
      
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.07);
    } catch (e) {
      // Fail silently
    }
  };

  const activateBwMode = () => {
    if (!bwMode) {
      setBwMode(true);
      if (typeof window !== 'undefined') {
        document.documentElement.classList.add('bw-mode');
        localStorage.setItem('bw-mode', 'true');
        window.dispatchEvent(new Event('bwModeChange'));
      }
      playClickSound(true);
    }
  };

  return (
    <button
      onClick={activateBwMode}
      aria-label="Toggle Black and White Mode"
      className={`w-7 h-7 rounded-lg bg-white border transition-all cursor-pointer hover:scale-110 flex-shrink-0 ${
        bwMode
          ? 'border-black dark:border-white border-2 scale-105 shadow-sm'
          : 'border-zinc-300 dark:border-zinc-700'
      }`}
    />
  );
};
