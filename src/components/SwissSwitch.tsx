"use client";

import React, { useState, useEffect } from 'react';
import { motion as m } from 'framer-motion';

export const SwissSwitch: React.FC = () => {
  const [bwMode, setBwMode] = useState(false);

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
    playClickSound(active);
  };

  const handleToggle = () => {
    setMode(!bwMode);
  };

  // 40px outer height - 16px knob height - 4px padding/border = 20px travel distance
  const travelDistance = 20;

  return (
    <div className="flex items-center gap-2 z-30 select-none">
      {/* Label: Color (OFF) */}
      <span className={`text-[10px] font-black tracking-wider transition-colors duration-300 ${bwMode ? 'text-zinc-400 dark:text-zinc-500' : 'text-primary font-black'}`}>
        COLOR
      </span>

      {/* Switch Plate */}
      <div 
        onClick={handleToggle}
        className="w-10 h-14 rounded-xl bg-gradient-to-b from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-400 dark:border-zinc-700 shadow-[0_2px_4px_rgba(0,0,0,0.15),inset_0_1px_0_white] dark:shadow-[0_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-98 relative bw-switch-plate"
      >
        {/* Track Slot */}
        <div className="w-5 h-10 bg-zinc-950 rounded-full relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between p-0.5">
          {/* Active color strip backings */}
          <div className={`absolute top-0 left-0 right-0 h-1/2 bg-green-500/80 transition-opacity duration-300 ${bwMode ? 'opacity-100' : 'opacity-20'}`} />
          <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-red-500/80 transition-opacity duration-300 ${bwMode ? 'opacity-20' : 'opacity-100'}`} />

          {/* Draggable Knob */}
          <m.div
            drag="y"
            dragConstraints={{ top: 0, bottom: travelDistance }}
            dragElastic={0.05}
            dragMomentum={false}
            animate={{ y: bwMode ? 0 : travelDistance }}
            onDragEnd={(_, info) => {
              const midPoint = travelDistance / 2;
              const dragY = info.offset.y;
              // If dragged upwards, turn ON (y=0)
              // If dragged downwards, turn OFF (y=travelDistance)
              const finalVal = bwMode ? (dragY > midPoint) : (dragY > -midPoint);
              if (finalVal) {
                setMode(false);
              } else {
                setMode(true);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            whileHover={{ scale: 1.08 }}
            className={`w-4 h-4 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] cursor-grab active:cursor-grabbing border z-10 transition-colors duration-300 ${
              bwMode 
                ? 'bg-zinc-800 border-zinc-950' 
                : 'bg-gradient-to-tr from-red-600 to-red-400 border-red-700'
            }`}
          />
        </div>
      </div>

      {/* Label: B&W (ON) */}
      <span className={`text-[10px] font-black tracking-wider transition-colors duration-300 ${bwMode ? 'text-green-500 font-black' : 'text-zinc-400 dark:text-zinc-500'}`}>
        B&W
      </span>
    </div>
  );
};
