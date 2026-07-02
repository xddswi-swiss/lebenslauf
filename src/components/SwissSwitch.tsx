"use client";

import React, { useState, useEffect } from 'react';

export const SwissSwitch: React.FC = () => {
  const [bwMode, setBwMode] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const active = document.documentElement.classList.contains('bw-mode');
      setBwMode(active);
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

  const setMode = (active: boolean) => {
    setBwMode(active);
    if (typeof window !== 'undefined') {
      if (active) {
        document.documentElement.classList.add('bw-mode');
        localStorage.setItem('bw-mode', 'true');
      } else {
        document.documentElement.classList.remove('bw-mode');
        localStorage.setItem('bw-mode', 'false');
      }
    }
    playClickSound(!active);
  };

  return (
    <div className="flex gap-0.5 p-0.5 rounded-full bg-zinc-800/10 dark:bg-zinc-200/5 border border-[var(--glass-border)] text-[10px] font-extrabold tracking-wider w-fit select-none z-30">
      <button
        onClick={() => setMode(false)}
        className={`px-2.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
          !bwMode
            ? 'bg-primary text-white shadow-sm'
            : 'text-[var(--text-body)] hover:text-[var(--text-main)]'
        }`}
      >
        ON
      </button>
      <button
        onClick={() => setMode(true)}
        className={`px-2.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
          bwMode
            ? 'bg-primary text-white shadow-sm'
            : 'text-[var(--text-body)] hover:text-[var(--text-main)]'
        }`}
      >
        OFF
      </button>
    </div>
  );
};
