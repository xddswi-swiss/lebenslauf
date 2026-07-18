"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { FiUserCheck, FiBookOpen, FiMonitor, FiHeart } from 'react-icons/fi';

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface SkillsBeamScannerProps {
  selectedMatcher?: 'kaufmann' | 'elektro' | null;
}

// ----------------------------------------------------------------------
// 2D HTML5 Canvas Particle Scanner Class (Ported from CodePen script.js)
// ----------------------------------------------------------------------
class ParticleScanner {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  animationId: number | null = null;
  w: number = 0;
  h: number = 0;
  particles: any[] = [];
  count: number = 0;
  maxParticles: number = 400;
  intensity: number = 0.5;
  lightBarX: number = 0;
  lightBarWidth: number = 3;
  fadeZone: number = 40;
  scanningActive: boolean = false;
  gradientCanvas: HTMLCanvasElement | null = null;

  // Scan transition values
  baseIntensity: number = 0.5;
  baseMaxParticles: number = 400;
  baseFadeZone: number = 40;
  scanTargetIntensity: number = 1.8;
  scanTargetParticles = 1200;
  scanTargetFadeZone = 25;

  currentIntensity: number = 0.5;
  currentMaxParticles: number = 400;
  currentFadeZone: number = 40;
  currentGlowIntensity: number = 1;
  transitionSpeed: number = 0.05;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.w = canvas.offsetWidth;
    this.h = canvas.offsetHeight;
    this.lightBarX = this.w / 2;

    this.setupCanvas();
    this.createGradientCache();
    this.initParticles();
    this.animate();
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.ctx.scale(dpr, dpr);
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  onResize(width: number, height: number) {
    this.w = width;
    this.h = height;
    this.lightBarX = this.w / 2;
    this.setupCanvas();
  }

  createGradientCache() {
    this.gradientCanvas = document.createElement('canvas');
    this.gradientCanvas.width = 16;
    this.gradientCanvas.height = 16;
    const ctx = this.gradientCanvas.getContext('2d')!;
    const half = this.gradientCanvas.width / 2;
    // Glow matching theme (we use electric violet/blue representing code scanner)
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(196, 181, 253, 0.8)');
    gradient.addColorStop(0.7, 'rgba(139, 92, 246, 0.4)');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();
  }

  randomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  createParticle() {
    const intensityRatio = this.intensity / this.baseIntensity;
    const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
    const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

    return {
      x: this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
      y: this.randomFloat(0, this.h),
      // Particles shoot mostly to the right to reveal code
      vx: this.randomFloat(0.3, 1.2) * speedMultiplier,
      vy: this.randomFloat(-0.18, 0.18) * speedMultiplier,
      radius: this.randomFloat(0.5, 1.2) * sizeMultiplier,
      alpha: this.randomFloat(0.6, 1),
      decay: this.randomFloat(0.008, 0.035) * (2 - intensityRatio * 0.5),
      originalAlpha: 0,
      life: 1.0,
      time: 0,
      twinkleSpeed: this.randomFloat(0.02, 0.08) * speedMultiplier,
      twinkleAmount: this.randomFloat(0.1, 0.25)
    };
  }

  initParticles() {
    this.particles = [];
    this.count = 0;
    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.createParticle();
      p.originalAlpha = p.alpha;
      this.count++;
      this.particles[this.count] = p;
    }
  }

  updateParticle(p: any) {
    p.x += p.vx;
    p.y += p.vy;
    p.time++;

    p.alpha = p.originalAlpha * p.life + Math.sin(p.time * p.twinkleSpeed) * p.twinkleAmount;
    p.life -= p.decay;

    if (p.x > this.w + 10 || p.life <= 0) {
      this.resetParticle(p);
    }
  }

  resetParticle(p: any) {
    p.x = this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
    p.y = this.randomFloat(0, this.h);
    p.vx = this.randomFloat(0.3, 1.2);
    p.vy = this.randomFloat(-0.18, 0.18);
    p.alpha = this.randomFloat(0.6, 1);
    p.originalAlpha = p.alpha;
    p.life = 1.0;
    p.time = 0;
  }

  drawParticle(p: any) {
    if (p.life <= 0 || !this.gradientCanvas) return;

    let fadeAlpha = 1;
    if (p.y < this.fadeZone) {
      fadeAlpha = p.y / this.fadeZone;
    } else if (p.y > this.h - this.fadeZone) {
      fadeAlpha = (this.h - p.y) / this.fadeZone;
    }
    fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));

    this.ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * fadeAlpha));
    this.ctx.drawImage(
      this.gradientCanvas,
      p.x - p.radius,
      p.y - p.radius,
      p.radius * 2,
      p.radius * 2
    );
  }

  drawLightBar() {
    const verticalGradient = this.ctx.createLinearGradient(0, 0, 0, this.h);
    verticalGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    verticalGradient.addColorStop(this.fadeZone / this.h, 'rgba(255, 255, 255, 1)');
    verticalGradient.addColorStop(1 - this.fadeZone / this.h, 'rgba(255, 255, 255, 1)');
    verticalGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.globalCompositeOperation = 'lighter';
    const targetGlowIntensity = this.scanningActive ? 3.5 : 1;
    this.currentGlowIntensity += (targetGlowIntensity - this.currentGlowIntensity) * this.transitionSpeed;

    const glowIntensity = this.currentGlowIntensity;
    const lineWidth = this.lightBarWidth;
    const glow1Alpha = this.scanningActive ? 1.0 : 0.8;
    const glow2Alpha = this.scanningActive ? 0.8 : 0.6;

    // Core scanner line
    const coreGradient = this.ctx.createLinearGradient(
      this.lightBarX - lineWidth / 2, 0,
      this.lightBarX + lineWidth / 2, 0
    );
    coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
    coreGradient.addColorStop(0.3, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
    coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1.0 * glowIntensity})`);
    coreGradient.addColorStop(0.7, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
    coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = coreGradient;
    this.ctx.beginPath();
    this.ctx.rect(this.lightBarX - lineWidth / 2, 0, lineWidth, this.h);
    this.ctx.fill();

    // Outer Glow 1
    const glow1Gradient = this.ctx.createLinearGradient(
      this.lightBarX - lineWidth * 2, 0,
      this.lightBarX + lineWidth * 2, 0
    );
    glow1Gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
    glow1Gradient.addColorStop(0.5, `rgba(196, 181, 253, ${0.8 * glowIntensity})`);
    glow1Gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    this.ctx.globalAlpha = glow1Alpha;
    this.ctx.fillStyle = glow1Gradient;
    this.ctx.beginPath();
    this.ctx.rect(this.lightBarX - lineWidth * 2, 0, lineWidth * 4, this.h);
    this.ctx.fill();

    // Outer Glow 2
    const glow2Gradient = this.ctx.createLinearGradient(
      this.lightBarX - lineWidth * 4, 0,
      this.lightBarX + lineWidth * 4, 0
    );
    glow2Gradient.addColorStop(0, 'rgba(139, 92, 246, 0)');
    glow2Gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.4 * glowIntensity})`);
    glow2Gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    this.ctx.globalAlpha = glow2Alpha;
    this.ctx.fillStyle = glow2Gradient;
    this.ctx.beginPath();
    this.ctx.rect(this.lightBarX - lineWidth * 4, 0, lineWidth * 8, this.h);
    this.ctx.fill();

    // Mask with vertical gradient
    this.ctx.globalCompositeOperation = 'destination-in';
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = verticalGradient;
    this.ctx.fillRect(0, 0, this.w, this.h);
  }

  setScanningActive(active: boolean) {
    this.scanningActive = active;
  }

  render() {
    const targetIntensity = this.scanningActive ? this.scanTargetIntensity : this.baseIntensity;
    const targetMaxParticles = this.scanningActive ? this.scanTargetParticles : this.baseMaxParticles;
    const targetFadeZone = this.scanningActive ? this.scanTargetFadeZone : this.baseFadeZone;

    this.currentIntensity += (targetIntensity - this.currentIntensity) * this.transitionSpeed;
    this.currentMaxParticles += (targetMaxParticles - this.currentMaxParticles) * this.transitionSpeed;
    this.currentFadeZone += (targetFadeZone - this.currentFadeZone) * this.transitionSpeed;

    this.intensity = this.currentIntensity;
    this.maxParticles = Math.floor(this.currentMaxParticles);
    this.fadeZone = this.currentFadeZone;

    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, this.w, this.h);

    this.drawLightBar();

    this.ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i <= this.count; i++) {
      if (this.particles[i]) {
        this.updateParticle(this.particles[i]);
        this.drawParticle(this.particles[i]);
      }
    }

    if (Math.random() < this.intensity && this.count < this.maxParticles) {
      const p = this.createParticle();
      p.originalAlpha = p.alpha;
      this.count++;
      this.particles[this.count] = p;
    }
  }

  animate() {
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles = [];
    this.count = 0;
  }
}

export const SkillsBeamScanner: React.FC<SkillsBeamScannerProps> = ({ selectedMatcher = null }) => {
  const { t } = useLanguage();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerInstance = useRef<ParticleScanner | null>(null);

  const [mounted, setMounted] = useState(false);

  // Position, drag, and velocity refs (high-performance rendering, zero-re-renders)
  const positionRef = useRef(0);
  const velocityRef = useRef(100); // px/s
  const directionRef = useRef(1); // 1 = right, -1 = left (auto-slides to the right!)
  const isDraggingRef = useRef(false);
  const startMouseXRef = useRef(0);
  const startPositionRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const mouseVelocityRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    // Start starting position centered or offset
    positionRef.current = -300;
  }, []);

  const isSkillMatching = (skillId: string) => {
    if (!selectedMatcher) return true;
    const s = skillId.toLowerCase();
    if (selectedMatcher === 'kaufmann') {
      return [
        'teamwork', 'helpfulness', 'responsibility', 'german', 'turkish', 'english',
        'word', 'excel', 'powerpoint', 'media'
      ].includes(s);
    }
    if (selectedMatcher === 'elektro') {
      return [
        'reliability', 'learning', 'responsibility', 'geometry', 'math', 'hardware', 'kung-fu'
      ].includes(s);
    }
    return true;
  };

  // 4 Core categories (we repeat them to create an infinite horizontal carousel)
  const baseCategories = [
    {
      key: 'personal' as const,
      icon: <FiUserCheck className="text-xl text-orange-700 dark:text-orange-400" />,
      code: `// compiled personal strengths
class PersonalStrengths {
  constructor() {
    this.reliability = 0.98;
    this.teamwork = 0.95;
    this.helpfulness = 0.95;
    this.learning = 0.90;
    this.responsibility = 0.85;
  }
  
  validate() {
    return this.reliability > 0.95;
  }
}`
    },
    {
      key: 'school' as const,
      icon: <FiBookOpen className="text-xl text-navy-700 dark:text-navy-400" />,
      code: `// compiled academic achievements
class AcademicAchievements {
  constructor() {
    this.geometry = 0.90;
    this.mathematics = 0.85;
    this.german = 1.00;
    this.turkish = 1.00;
    this.english = 0.70;
  }

  getLanguages() {
    return ["DE", "TR", "EN"];
  }
}`
    },
    {
      key: 'digital' as const,
      icon: <FiMonitor className="text-xl text-green-700 dark:text-green-400" />,
      code: `// compiled IT & digital media
class DigitalProficiency {
  constructor() {
    this.word = 0.90;
    this.excel = 0.85;
    this.powerpoint = 0.85;
    this.html5_css3 = 0.65;
    this.hardware = 0.80;
  }

  isOfficeSuiteProficient() {
    return this.word >= 0.85;
  }
}`
    },
    {
      key: 'hobbies' as const,
      icon: <FiHeart className="text-xl text-orange-700 dark:text-orange-400" />,
      code: `// compiled interests & hobby profile
class HobbiesAndInterests {
  constructor() {
    this.kung_fu = 0.95;
    this.swimming = 0.90;
    this.cooking = 0.80;
    this.photography = 0.75;
    this.media = 0.80;
  }
}`
    }
  ];

  // Double the list to 8 items to ensure infinite looping coverage
  const categories = [...baseCategories, ...baseCategories];

  // ----------------------------------------------------
  // Drag & Mouse Event Handlers for Slider (Vanilla JS style)
  // ----------------------------------------------------
  const handleDragStart = (clientX: number) => {
    isDraggingRef.current = true;
    startMouseXRef.current = clientX;
    startPositionRef.current = positionRef.current;
    lastMouseXRef.current = clientX;
    mouseVelocityRef.current = 0;

    if (trackRef.current) {
      trackRef.current.classList.add('dragging');
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = clientX - startMouseXRef.current;
    positionRef.current = startPositionRef.current + deltaX;

    const instantDelta = clientX - lastMouseXRef.current;
    mouseVelocityRef.current = instantDelta * 60; // scale to velocity px/s
    lastMouseXRef.current = clientX;
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (trackRef.current) {
      trackRef.current.classList.remove('dragging');
    }

    if (Math.abs(mouseVelocityRef.current) > 30) {
      velocityRef.current = Math.min(Math.abs(mouseVelocityRef.current), 500);
      directionRef.current = mouseVelocityRef.current > 0 ? 1 : -1;
    } else {
      velocityRef.current = 100;
    }
  };

  // Setup canvas scanner and auto-scroll loop
  useEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return;

    // Instantiate Canvas particles
    const scanner = new ParticleScanner(canvasRef.current);
    scannerInstance.current = scanner;

    let lastTime = performance.now();
    let animId: number;

    const loop = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      const track = trackRef.current;
      const container = containerRef.current;

      if (track && container) {
        const containerRect = container.getBoundingClientRect();
        // Central scanner line coordinates (middle of viewport)
        const scannerX = containerRect.left + containerRect.width / 2;

        // Total width of the carousel cards: 8 cards of 400px + 32px gaps
        const cardWidth = 400;
        const gap = 32;
        const totalTrackWidth = (cardWidth + gap) * categories.length;

        // Auto-Scroll physics (constant velocity slide if not dragging)
        if (!isDraggingRef.current) {
          // Slide slowly with slight friction deceleration if let go fast
          if (velocityRef.current > 100) {
            velocityRef.current *= 0.96; // friction decelerate
          } else {
            velocityRef.current = 100; // constant base speed
          }

          positionRef.current += velocityRef.current * directionRef.current * deltaTime;
        }

        // Loop boundaries for infinite carousel scrolling
        // If moving right (direction = 1) and exceeds viewport limit: loop back
        if (positionRef.current > 0) {
          positionRef.current = -totalTrackWidth / 2;
        }
        // If moving left (direction = -1) and scrolls off-screen: loop forward
        else if (positionRef.current < -totalTrackWidth / 2) {
          positionRef.current = 0;
        }

        // Update DOM transform directly for high performance
        track.style.transform = `translateX(${positionRef.current}px)`;

        // Calculate card intersections & clipping boundaries
        let anyCardIntersecting = false;
        const cards = track.querySelectorAll('.skills-card-wrapper');

        cards.forEach((card) => {
          const htmlCard = card as HTMLElement;
          const rect = htmlCard.getBoundingClientRect();
          const cardLeft = rect.left;
          const cardRight = rect.right;

          if (cardLeft < scannerX && cardRight > scannerX) {
            anyCardIntersecting = true;
            const intersectX = scannerX - cardLeft;
            const percentLeft = (intersectX / cardWidth) * 100;

            // Since cards slide left-to-right (to the right):
            // - The left side (already passed scanner) is Normal (progress bars)
            // - The right side (not yet passed scanner) is ASCII (code)
            // So:
            // Normal card is visible on left, clipped on right: clip-path inset(0 P% 0 0)
            // ASCII card is visible on right, clipped on left: clip-path inset(0 0 0 P%)
            const normalClipRight = 100 - percentLeft;
            const asciiClipLeft = percentLeft;

            htmlCard.style.setProperty('--clip-right', `${normalClipRight}%`);
            htmlCard.style.setProperty('--clip-left', `${asciiClipLeft}%`);
          } else {
            if (cardRight <= scannerX) {
              // Card fully to the left of scanner: fully normal (progress bars)
              htmlCard.style.setProperty('--clip-right', '0%');
              htmlCard.style.setProperty('--clip-left', '100%');
            } else if (cardLeft >= scannerX) {
              // Card fully to the right of scanner: fully ASCII (code)
              htmlCard.style.setProperty('--clip-right', '100%');
              htmlCard.style.setProperty('--clip-left', '0%');
            }
          }
        });

        // Set scanning particle intensity active
        scanner.setScanningActive(anyCardIntersecting);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // Track resize
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        scanner.onResize(containerRef.current.offsetWidth, 320);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      scanner.destroy();
    };
  }, [mounted]);

  // Touch and mouse drag events attachment
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onMouseDown = (e: MouseEvent) => {
      handleDragStart(e.clientX);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX);
    };

    const onMouseUp = () => {
      handleDragEnd();
    };

    const onTouchStart = (e: TouchEvent) => {
      handleDragStart(e.touches[0].clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      handleDragMove(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
      handleDragEnd();
    };

    track.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    track.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      track.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      track.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [mounted]);

  return (
    <div className="skills-scanner-container w-full h-[400px] relative overflow-hidden" ref={containerRef}>
      {/* 2D Canvas Sparks/Dust Particle Overlay */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 bottom-0 left-0 right-0 w-full h-full pointer-events-none z-10"
        style={{ height: '320px' }}
      />

      {/* Slider Draggable Track */}
      <div 
        ref={trackRef} 
        className="skills-slider-track select-none flex items-center will-change-transform pt-4"
        style={{ height: '320px' }}
      >
        {categories.map((category, index) => (
          <div key={index} className="skills-card-wrapper relative">
            
            {/* 1. LAYER: Decoded Normal Card Layout (Right side of scanner - clipped from left) */}
            <div 
              className="skills-card skills-card-normal p-6 md:p-8 flex flex-col justify-between"
              style={{ clipPath: 'inset(0 0 0 var(--clip-right, 0%))' }}
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-[var(--background)] rounded-2xl border border-[var(--glass-border)] flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-[var(--text-main)]">
                    {t.skills.categories[category.key]}
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {(t.skills.items[category.key] as Skill[]).map((skill, idx) => {
                    const matches = isSkillMatching(skill.id);
                    return (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between gap-4 py-1 transition-all duration-300 ${
                          selectedMatcher && !matches 
                            ? 'opacity-20 scale-[0.98]' 
                            : 'opacity-100'
                        }`}
                      >
                        {/* Skill Name */}
                        <span className={`w-[45%] text-left text-xs md:text-sm font-semibold truncate transition-colors duration-300 ${
                          selectedMatcher && matches 
                            ? 'text-primary font-bold shadow-sm' 
                            : 'text-[var(--text-body)]'
                        }`} title={skill.name}>
                          {skill.name}
                        </span>

                        {/* Progress Bar + Percentage */}
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                          <div className="flex-1 h-2 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--glass-border)]">
                            {mounted && (
                              <div
                                style={{ width: `${skill.level}%` }}
                                className={`h-full rounded-full bg-gradient-to-r transition-[width] duration-1000 ${
                                  category.key === 'personal' ? 'from-orange-600 to-orange-400' :
                                  category.key === 'school' ? 'from-navy-700 to-navy-500' :
                                  category.key === 'digital' ? 'from-green-600 to-green-400' :
                                  'from-orange-600 to-navy-600'
                                }`}
                              />
                            )}
                          </div>
                          <span className="w-8 text-right text-xs md:text-sm font-bold text-[var(--text-muted)] flex-shrink-0">
                            {skill.level}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. LAYER: Encoded ASCII Code Layout (Left side of scanner - clipped from right) */}
            <div 
              className="skills-card skills-card-ascii"
              style={{ clipPath: 'inset(0 0 0 var(--clip-left, 0%))' }}
            >
              <div className="skills-ascii-content">
                {category.code}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
