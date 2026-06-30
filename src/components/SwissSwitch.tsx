"use client";

import React, { useState, useEffect } from 'react';
import { motion as m } from 'framer-motion';

export const SwissSwitch: React.FC = () => {
  const [bwMode, setBwMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const active = document.documentElement.classList.contains('bw-mode');
      setBwMode(active);
      setMounted(true);
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
    playClickSound(active);
  };

  const handleToggle = () => {
    setMode(!bwMode);
  };

  // 40px outer height - 16px knob height - 4px padding/border = 20px travel distance
  const travelDistance = 20;

  return (
    <div className="flex items-center gap-2 z-30 select-none bw-switch-container">
      {/* Label: Color (ON) */}
      <span className={`text-[10px] tracking-wider transition-all duration-300 inline-block ${
        bwMode 
          ? 'text-zinc-400 font-medium scale-100' 
          : 'text-[#00c853] font-black scale-105 drop-shadow-[0_0_8px_rgba(0,200,83,0.45)]'
      }`}>
        COLOR
      </span>

      {/* Switch Plate */}
      <div 
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        aria-label="Toggle Color Mode"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={`w-10 h-14 border flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-98 relative ${
          bwMode
            ? 'bg-white border-2 border-black shadow-none rounded-[4px]'
            : 'bg-gradient-to-b from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 border-zinc-400 dark:border-zinc-700 shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_white] dark:shadow-[0_2px_4px_rgba(0,0,0,0.4)] rounded-xl'
        }`}
      >
        {/* Track Slot */}
        <div className={`w-5 h-10 rounded-full relative overflow-hidden flex flex-col justify-between p-0.5 border transition-all duration-300 ${
          bwMode
            ? 'bg-zinc-950 border border-black shadow-none'
            : 'bg-zinc-950 border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]'
        }`}>
          {/* Active color strip backings */}
          <div 
            className="absolute top-0 left-0 right-0 h-1/2 transition-all duration-300"
            style={{ 
              backgroundColor: bwMode ? '#27272a' : '#00c853',
              opacity: bwMode ? 1 : 0.75
            }} 
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-1/2 transition-all duration-300"
            style={{ 
              backgroundColor: bwMode ? '#e4e4e7' : '#ff0000',
              opacity: bwMode ? 1 : 0.75
            }} 
          />

          {/* Draggable Knob */}
          <m.div
            drag="y"
            dragConstraints={{ top: 0, bottom: travelDistance }}
            dragElastic={0.05}
            dragMomentum={false}
            animate={{ y: bwMode ? travelDistance : 0 }}
            onDragEnd={(_, info) => {
              const midPoint = travelDistance / 2;
              const dragY = info.offset.y;
              if (bwMode) {
                if (dragY < -midPoint) {
                  setMode(false);
                } else {
                  setMode(true);
                }
              } else {
                if (dragY > midPoint) {
                  setMode(true);
                } else {
                  setMode(false);
                }
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            whileHover={{ scale: 1.08 }}
            className={`w-4 h-4 rounded-full cursor-grab active:cursor-grabbing border z-10 transition-all duration-300 ${
              bwMode 
                ? 'bg-white border-2 border-black shadow-none' 
                : 'bg-gradient-to-tr from-[#00c853] to-[#69f0ae] border-[#008e3c] shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4)]'
            }`}
          />
        </div>
      </div>

      {/* Label: B&W (OFF) */}
      <span className={`text-[10px] tracking-wider transition-all duration-300 inline-block ${
        bwMode 
          ? 'text-black font-black scale-105 drop-shadow-none' 
          : 'text-[#ff0000]/70 font-bold scale-100'
      }`}>
        B&W
      </span>
    </div>
  );
};
