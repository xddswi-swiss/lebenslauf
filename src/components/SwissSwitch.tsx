"use client";

import React, { useState, useEffect } from 'react';

export const SwissSwitch: React.FC = () => {
  const [bwMode, setBwMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const active = document.documentElement.classList.contains('bw-mode');
      setBwMode(active);
    }
  }, []);

  const toggleBwMode = () => {
    const nextVal = !bwMode;
    setBwMode(nextVal);
    if (typeof window !== 'undefined') {
      if (nextVal) {
        document.documentElement.classList.add('bw-mode');
        localStorage.setItem('bw-mode', 'true');
        // Play high-quality physical click sound using Web Audio API
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.frequency.setValueAtTime(160, audioCtx.currentTime);
          osc.type = 'triangle';
          
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.07);
        } catch (e) {
          // Fail silently if browser blocks autoplay context
        }
      } else {
        document.documentElement.classList.remove('bw-mode');
        localStorage.setItem('bw-mode', 'false');
        // Play click sound with slightly lower pitch to represent rocker releasing
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.frequency.setValueAtTime(110, audioCtx.currentTime);
          osc.type = 'triangle';
          
          gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.07);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.07);
        } catch (e) {
          // Fail silently
        }
      }
    }
  };

  return (
    <button
      onClick={toggleBwMode}
      title="Feller Lichtschalter: Schwarz-Weiss Skizzen-Modus"
      className="relative w-10 h-10 rounded-lg bg-[#E5E5E5] border border-zinc-400/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_1px_3px_rgba(0,0,0,0.15)] flex items-center justify-center p-1 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 z-30"
    >
      {/* Inner square key representing the Swiss switch rocker */}
      <div 
        className={`w-full h-full rounded bg-[#ECECEC] border-b-2 border-zinc-300/95 shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-200 flex flex-col items-center justify-between py-1 px-2 ${
          bwMode 
            ? 'translate-y-[1px] border-b-0 border-t-2 border-zinc-400/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]' 
            : ''
        }`}
      >
        {/* Red light indicator (turns OFF in B&W mode) */}
        <span className={`w-3 h-[1.5px] rounded-full transition-all duration-200 ${bwMode ? 'bg-zinc-300' : 'bg-red-500 shadow-[0_0_2px_#ef4444]'}`} />
        <span className="text-[7px] font-black text-zinc-500 leading-none tracking-tighter select-none">FELLER</span>
        {/* Green light indicator (turns ON in B&W mode) */}
        <span className={`w-3 h-[1.5px] rounded-full transition-all duration-200 ${bwMode ? 'bg-green-500 shadow-[0_0_2px_#22c55e]' : 'bg-zinc-300'}`} />
      </div>
    </button>
  );
};
