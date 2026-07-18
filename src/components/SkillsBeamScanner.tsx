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
  isVertical: boolean = false;
  lightBarY: number = 0;

  constructor(canvas: HTMLCanvasElement, isVertical: boolean = false) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.isVertical = isVertical;
    this.w = canvas.offsetWidth;
    this.h = canvas.offsetHeight;
    this.lightBarX = this.w / 2;
    this.lightBarY = this.h / 2;

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
    this.lightBarY = this.h / 2;
    this.setupCanvas();
  }

  createGradientCache() {
    this.gradientCanvas = document.createElement('canvas');
    this.gradientCanvas.width = 16;
    this.gradientCanvas.height = 16;
    const ctx = this.gradientCanvas.getContext('2d')!;
    const half = this.gradientCanvas.width / 2;

    const isBw = document.documentElement.classList.contains('bw-mode');
    const isDark = document.documentElement.classList.contains('dark');

    let c1, c2, c3;
    if (isBw) {
      c1 = "rgba(0, 0, 0, 1)";
      c2 = "rgba(100, 100, 100, 0.8)";
      c3 = "rgba(180, 180, 180, 0.4)";
    } else if (isDark) {
      c1 = "rgba(255, 255, 255, 1)";
      c2 = "rgba(170, 245, 255, 0.85)";
      c3 = "rgba(0, 220, 255, 0.45)";
    } else {
      c1 = "rgba(255, 255, 255, 1)";
      c2 = "rgba(253, 224, 71, 0.8)";
      c3 = "rgba(234, 179, 8, 0.4)";
    }

    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, c1);
    gradient.addColorStop(0.3, c2);
    gradient.addColorStop(0.7, c3);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();
  }

  onThemeChanged() {
    this.createGradientCache();
    this.initParticles();
  }

  randomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  createParticle() {
    const intensityRatio = this.intensity / this.baseIntensity;
    const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
    const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

    if (this.isVertical) {
       return {
         x: this.randomFloat(0, this.w),
         y: this.lightBarY + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
         vx: this.randomFloat(-0.18, 0.18) * speedMultiplier,
         vy: this.randomFloat(0.3, 1.2) * speedMultiplier,
         radius: this.randomFloat(0.5, 1.2) * sizeMultiplier,
         alpha: this.randomFloat(0.6, 1),
         decay: this.randomFloat(0.008, 0.035) * (2 - intensityRatio * 0.5),
         originalAlpha: 0,
         life: 1.0,
         time: 0,
         twinkleSpeed: this.randomFloat(0.02, 0.08) * speedMultiplier,
         twinkleAmount: this.randomFloat(0.1, 0.25)
       };
    } else {
       return {
         x: this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
         y: this.randomFloat(0, this.h),
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

    if (this.isVertical) {
      if (p.y > this.h + 10 || p.life <= 0) {
        this.resetParticle(p);
      }
    } else {
      if (p.x > this.w + 10 || p.life <= 0) {
        this.resetParticle(p);
      }
    }
  }

  resetParticle(p: any) {
    if (this.isVertical) {
      p.x = this.randomFloat(0, this.w);
      p.y = this.lightBarY + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
      p.vx = this.randomFloat(-0.18, 0.18);
      p.vy = this.randomFloat(0.3, 1.2);
    } else {
      p.x = this.lightBarX + this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
      p.y = this.randomFloat(0, this.h);
      p.vx = this.randomFloat(0.3, 1.2);
      p.vy = this.randomFloat(-0.18, 0.18);
    }
    p.alpha = this.randomFloat(0.6, 1);
    p.originalAlpha = p.alpha;
    p.life = 1.0;
    p.time = 0;
  }

  drawParticle(p: any) {
    if (p.life <= 0 || !this.gradientCanvas) return;

    let fadeAlpha = 1;
    if (this.isVertical) {
      if (p.x < this.fadeZone) {
        fadeAlpha = p.x / this.fadeZone;
      } else if (p.x > this.w - this.fadeZone) {
        fadeAlpha = (this.w - p.x) / this.fadeZone;
      }
    } else {
      if (p.y < this.fadeZone) {
        fadeAlpha = p.y / this.fadeZone;
      } else if (p.y > this.h - this.fadeZone) {
        fadeAlpha = (this.h - p.y) / this.fadeZone;
      }
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
    const isBw = document.documentElement.classList.contains('bw-mode');
    if (isBw) {
      // B&W theme: simple solid black bar, no glowing composition or composite operations
      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = "#000000";
      this.ctx.fillRect(this.lightBarX - this.lightBarWidth / 2, 0, this.lightBarWidth, this.h);
      return;
    }

    const isDark = document.documentElement.classList.contains('dark');
    const colorPrimary = isDark ? "0, 220, 255" : "234, 179, 8";
    const colorSecondary = isDark ? "170, 245, 255" : "253, 224, 71";

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
    glow1Gradient.addColorStop(0, `rgba(${colorPrimary}, 0)`);
    glow1Gradient.addColorStop(0.5, `rgba(${colorSecondary}, ${0.8 * glowIntensity})`);
    glow1Gradient.addColorStop(1, `rgba(${colorPrimary}, 0)`);

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
    glow2Gradient.addColorStop(0, `rgba(${colorPrimary}, 0)`);
    glow2Gradient.addColorStop(0.5, `rgba(${colorPrimary}, ${0.4 * glowIntensity})`);
    glow2Gradient.addColorStop(1, `rgba(${colorPrimary}, 0)`);

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

const generateRandomCode = (width: number, height: number): string => {
  const codeChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?";
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr: string[]) => arr[randInt(0, arr.length - 1)];

  const header = [
    "// compiled preview • scanner demo",
    "/* generated for visual effect – not executed */",
    "const SCAN_WIDTH = 8;",
    "const FADE_ZONE = 35;",
    "const MAX_PARTICLES = 2500;",
    "const TRANSITION = 0.05;",
  ];

  const helpers = [
    "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
    "function lerp(a, b, t) { return a + (b - a) * t; }",
    "const now = () => performance.now();",
    "function rng(min, max) { return Math.random() * (max - min) + min; }",
  ];

  const particleBlock = (idx: number) => [
    `class Particle${idx} {`,
    "  constructor(x, y, vx, vy, r, a) {",
    "    this.x = x; this.y = y;",
    "    this.vx = vx; this.vy = vy;",
    "    this.r = r; this.a = a;",
    "  }",
    "  step(dt) { this.x += this.vx * dt; this.y += this.vy * dt; }",
    "}",
  ];

  const scannerBlock = [
    "const scanner = {",
    "  x: Math.floor(window.innerWidth / 2),",
    "  width: SCAN_WIDTH,",
    "  glow: 3.5,",
    "};",
    "function drawParticle(ctx, p) {",
    "  ctx.globalAlpha = clamp(p.a, 0, 1);",
    "  ctx.drawImage(gradient, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);",
    "}",
  ];

  const loopBlock = [
    "function tick(t) {",
    "  const dt = 0.016;",
    "}",
  ];

  const misc = [
    "const state = { intensity: 1.2, particles: MAX_PARTICLES };",
    "const bounds = { w: window.innerWidth, h: 300 };",
    "const gradient = document.createElement('canvas');",
    "const ctx = gradient.getContext('2d');",
    "ctx.globalCompositeOperation = 'lighter';",
  ];

  const library: string[] = [];
  header.forEach((l) => library.push(l));
  helpers.forEach((l) => library.push(l));
  for (let b = 0; b < 3; b++) {
    particleBlock(b).forEach((l) => library.push(l));
  }
  scannerBlock.forEach((l) => library.push(l));
  loopBlock.forEach((l) => library.push(l));
  misc.forEach((l) => library.push(l));

  for (let i = 0; i < 40; i++) {
    const n1 = randInt(1, 9);
    const n2 = randInt(10, 99);
    library.push(`const v${i} = (${n1} + ${n2}) * 0.${randInt(1, 9)};`);
  }
  for (let i = 0; i < 20; i++) {
    library.push(
      `if (state.intensity > ${1 + (i % 3)}) { scanner.glow += 0.01; }`
    );
  }

  let flow = library.join(" ");
  flow = flow.replace(/\s+/g, " ").trim();
  const totalChars = width * height;
  while (flow.length < totalChars + width) {
    const extra = pick(library).replace(/\s+/g, " ").trim();
    flow += " " + extra;
  }

  let out = "";
  let offset = 0;
  for (let row = 0; row < height; row++) {
    let line = flow.slice(offset, offset + width);
    if (line.length < width) line = line + " ".repeat(width - line.length);
    out += line + (row < height - 1 ? "\n" : "");
    offset += width;
  }

  const chars = out.split("");
  for (let i = 0; i < randInt(5, 15); i++) {
    const idx = randInt(0, chars.length - 1);
    if (chars[idx] !== "\n" && chars[idx] !== " ") {
      chars[idx] = codeChars[randInt(0, codeChars.length - 1)];
    }
  }
  out = chars.join("");

  return out;
};

export const SkillsBeamScanner: React.FC<SkillsBeamScannerProps> = ({ selectedMatcher = null }) => {
  const { t } = useLanguage();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scannerInstance = useRef<ParticleScanner | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const isMobileRef = useRef(false);
  isMobileRef.current = isMobile;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Position, drag, and velocity refs (high-performance rendering, zero-re-renders)
  const positionRef = useRef(0);
  const velocityRef = useRef(100); // px/s
  const directionRef = useRef(-1); // -1 = left, 1 = right (auto-slides to the left!)
  const isDraggingRef = useRef(false);
  const startMouseXRef = useRef(0);
  const startPositionRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const mouseVelocityRef = useRef(0);
  const isAnimatingRef = useRef(true);
  isAnimatingRef.current = isAnimating;

  useEffect(() => {
    setMounted(true);
    const isMob = window.innerWidth < 768;
    positionRef.current = -300;
    directionRef.current = isMob ? 1 : -1; // starts downwards on mobile, left on desktop
    velocityRef.current = isMob ? 45 : 100;
  }, []);

  // Periodic ASCII matrix glitch updates
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      if (!isAnimatingRef.current) return;

      const track = trackRef.current;
      if (track) {
        const asciiContents = track.querySelectorAll('.skills-ascii-content');
        asciiContents.forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.textContent = generateRandomCode(60, 16);
        });
      }
    }, 200);

    return () => clearInterval(interval);
  }, [mounted]);

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
  const handleDragStart = (clientX: number, clientY: number) => {
    isDraggingRef.current = true;
    const currentCoord = isMobileRef.current ? clientY : clientX;
    startMouseXRef.current = currentCoord;
    startPositionRef.current = positionRef.current;
    lastMouseXRef.current = currentCoord;
    mouseVelocityRef.current = 0;

    if (trackRef.current) {
      trackRef.current.classList.add('dragging');
    }
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const currentCoord = isMobileRef.current ? clientY : clientX;
    const delta = currentCoord - startMouseXRef.current;
    positionRef.current = startPositionRef.current + delta;

    const instantDelta = currentCoord - lastMouseXRef.current;
    mouseVelocityRef.current = instantDelta * 60; // scale to velocity px/s
    lastMouseXRef.current = currentCoord;
  };

  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    if (trackRef.current) {
      trackRef.current.classList.remove('dragging');
    }

    const baseSpeed = isMobileRef.current ? 45 : 100;
    if (Math.abs(mouseVelocityRef.current) > 30) {
      velocityRef.current = Math.min(Math.abs(mouseVelocityRef.current), 500);
      directionRef.current = mouseVelocityRef.current > 0 ? 1 : -1;
    } else {
      velocityRef.current = baseSpeed;
    }
  };

  // Setup canvas scanner and auto-scroll loop
  useEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return;

    // Instantiate Canvas particles
    const scanner = new ParticleScanner(canvasRef.current, isMobileRef.current);
    scannerInstance.current = scanner;

    // Set up MutationObserver to detect when theme changes on document.documentElement (dark or bw-mode)
    const observer = new MutationObserver(() => {
      if (scannerInstance.current) {
        scannerInstance.current.onThemeChanged();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Also listen to window bwModeChange event
    const handleBwChange = () => {
      if (scannerInstance.current) {
        scannerInstance.current.onThemeChanged();
      }
    };
    window.addEventListener('bwModeChange', handleBwChange);

    let lastTime = performance.now();
    let animId: number;

    const loop = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      const track = trackRef.current;
      const container = containerRef.current;

      if (track && container) {
        const containerRect = container.getBoundingClientRect();
        const activeIsMobile = isMobileRef.current;

        // Constants depend on mobile vs desktop mode
        const cardSize = activeIsMobile ? 250 : 400; // height on mobile, width on desktop
        const gap = activeIsMobile ? 20 : 32;
        const totalSize = (cardSize + gap) * categories.length;

        // Auto-Scroll physics (constant velocity slide if not dragging)
        if (!isDraggingRef.current && isAnimatingRef.current) {
          const baseSpeed = activeIsMobile ? 45 : 100;
          if (velocityRef.current > baseSpeed) {
            velocityRef.current *= 0.96; // friction decelerate
          } else {
            velocityRef.current = baseSpeed; // constant base speed
          }

          positionRef.current += velocityRef.current * directionRef.current * deltaTime;
        }

        // Loop boundaries for infinite carousel scrolling
        if (positionRef.current > 0) {
          positionRef.current = -totalSize / 2;
        } else if (positionRef.current < -totalSize / 2) {
          positionRef.current = 0;
        }

        // Update DOM transform directly for high performance
        if (activeIsMobile) {
          track.style.transform = `translateY(${positionRef.current}px)`;
        } else {
          track.style.transform = `translateX(${positionRef.current}px)`;
        }

        // Calculate card intersections & clipping boundaries
        let anyCardIntersecting = false;
        const cards = track.querySelectorAll('.skills-card-wrapper');

        if (activeIsMobile) {
          const scannerY = containerRect.top + containerRect.height / 2;
          cards.forEach((card) => {
            const htmlCard = card as HTMLElement;
            const rect = htmlCard.getBoundingClientRect();
            const cardTop = rect.top;
            const cardBottom = rect.bottom;

            if (cardTop < scannerY && cardBottom > scannerY) {
              anyCardIntersecting = true;
              const intersectY = scannerY - cardTop;
              const percentTop = (intersectY / cardSize) * 100;

              htmlCard.style.setProperty('--clip-bottom', `${percentTop}%`);
              htmlCard.style.setProperty('--clip-top', `${percentTop}%`);

              // Fill up progress bars since it is crossing the scanner
              htmlCard.querySelectorAll('.skill-fill').forEach((fill) => {
                const htmlFill = fill as HTMLElement;
                htmlFill.style.width = htmlFill.getAttribute('data-level') + '%';
              });
            } else {
              if (cardBottom <= scannerY) {
                // Card fully above scanner: fully ASCII (code)
                htmlCard.style.setProperty('--clip-bottom', '100%');
                htmlCard.style.setProperty('--clip-top', '100%');

                // Reset progress bars to 0% when card is in fully-code state
                htmlCard.querySelectorAll('.skill-fill').forEach((fill) => {
                  const htmlFill = fill as HTMLElement;
                  htmlFill.style.width = '0%';
                });
              } else if (cardTop >= scannerY) {
                // Card fully below scanner: fully normal (progress bars)
                htmlCard.style.setProperty('--clip-bottom', '0%');
                htmlCard.style.setProperty('--clip-top', '0%');

                // Fill up progress bars since it is in fully-normal state
                htmlCard.querySelectorAll('.skill-fill').forEach((fill) => {
                  const htmlFill = fill as HTMLElement;
                  htmlFill.style.width = htmlFill.getAttribute('data-level') + '%';
                });
              }
            }
          });
        } else {
          const scannerX = containerRect.left + containerRect.width / 2;
          cards.forEach((card) => {
            const htmlCard = card as HTMLElement;
            const rect = htmlCard.getBoundingClientRect();
            const cardLeft = rect.left;
            const cardRight = rect.right;

            if (cardLeft < scannerX && cardRight > scannerX) {
              anyCardIntersecting = true;
              const intersectX = scannerX - cardLeft;
              const percentLeft = (intersectX / cardSize) * 100;

              htmlCard.style.setProperty('--clip-right', `${percentLeft}%`);
              htmlCard.style.setProperty('--clip-left', `${percentLeft}%`);

              // Fill up progress bars since it is crossing the scanner
              htmlCard.querySelectorAll('.skill-fill').forEach((fill) => {
                const htmlFill = fill as HTMLElement;
                htmlFill.style.width = htmlFill.getAttribute('data-level') + '%';
              });
            } else {
              if (cardRight <= scannerX) {
                // Card fully to the left of scanner: fully ASCII (code)
                htmlCard.style.setProperty('--clip-right', '100%');
                htmlCard.style.setProperty('--clip-left', '100%');

                // Reset progress bars to 0% when card is in fully-code state
                htmlCard.querySelectorAll('.skill-fill').forEach((fill) => {
                  const htmlFill = fill as HTMLElement;
                  htmlFill.style.width = '0%';
                });
              } else if (cardLeft >= scannerX) {
                // Card fully to the right of scanner: fully normal (progress bars)
                htmlCard.style.setProperty('--clip-right', '0%');
                htmlCard.style.setProperty('--clip-left', '0%');

                // Fill up progress bars since it is in fully-normal state
                htmlCard.querySelectorAll('.skill-fill').forEach((fill) => {
                  const htmlFill = fill as HTMLElement;
                  htmlFill.style.width = htmlFill.getAttribute('data-level') + '%';
                });
              }
            }
          });
        }

        // Set scanning particle intensity active
        scanner.setScanningActive(anyCardIntersecting);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    // Track resize
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        scanner.onResize(containerRef.current.offsetWidth, containerRef.current.offsetHeight || 320);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('bwModeChange', handleBwChange);
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
      handleDragStart(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      handleDragEnd();
    };

    const onTouchStart = (e: TouchEvent) => {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
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
    <>
    <div
      className="skills-scanner-container w-full relative overflow-hidden"
      style={{ height: isMobile ? '320px' : '400px' }}
      ref={containerRef}
    >
      {/* 2D Canvas Sparks/Dust Particle Overlay */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 bottom-0 left-0 right-0 w-full h-full pointer-events-none z-10"
        style={{ height: '400px' }}
      />

      {/* Slider Draggable Track */}
      <div 
        ref={trackRef} 
        className={`skills-slider-track select-none flex items-center will-change-transform pt-4 ${isMobile ? 'flex-col h-max w-full' : 'flex-row w-max'}`}
        style={{ height: isMobile ? 'max-content' : '320px' }}
      >
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="skills-card-wrapper relative"
            style={{
              width: isMobile ? '320px' : '400px',
              height: '250px',
              flexShrink: 0,
              marginRight: isMobile ? '0' : '32px',
              marginBottom: isMobile ? '20px' : '0'
            }}
          >
            
            {/* 1. LAYER: Decoded Normal Card Layout (Right side of scanner - clipped from left) */}
            <div 
              className="skills-card skills-card-normal"
              style={{
                clipPath: isMobile 
                  ? 'inset(0 0 calc(100% - var(--clip-bottom, 0%)) 0)' 
                  : 'inset(0 0 0 var(--clip-right, 0%))'
              }}
            >
              <div className="skills-header">
                <div className="skills-icon p-1.5 bg-[var(--background)] rounded-xl border border-[var(--glass-border)] flex items-center justify-center">
                  {category.icon}
                </div>
                <span className="skills-title">
                  {t.skills.categories[category.key]}
                </span>
              </div>

              <div className="skills-list">
                {(t.skills.items[category.key] as Skill[]).map((skill, idx) => {
                  const matches = isSkillMatching(skill.id);
                  return (
                    <div 
                      key={idx} 
                      className={`skill-item transition-all duration-300 ${
                        selectedMatcher && !matches 
                          ? 'opacity-20 scale-[0.98]' 
                          : 'opacity-100'
                      }`}
                    >
                      {/* Skill Name */}
                      <span 
                        className={`skill-label transition-colors duration-300 ${
                          selectedMatcher && matches 
                            ? 'text-primary font-bold shadow-sm' 
                            : ''
                        }`} 
                        title={skill.name}
                      >
                        {skill.name}
                      </span>

                      {/* Progress Bar + Percentage */}
                      <div className="skill-bar-container">
                        <div className="skill-track bg-[var(--background)] border border-[var(--glass-border)]">
                          {mounted && (
                            <div
                              data-level={skill.level}
                              style={{ width: '0%' }}
                              className={`skill-fill h-full rounded-full bg-gradient-to-r transition-[width] duration-[1500ms] ease-[cubic-bezier(0.19,1,0.22,1)] ${
                                category.key === 'personal' ? 'from-orange-600 to-orange-400' :
                                category.key === 'school' ? 'from-navy-700 to-navy-500' :
                                category.key === 'digital' ? 'from-green-600 to-green-400' :
                                'from-orange-600 to-navy-600'
                              }`}
                            />
                          )}
                        </div>
                        <span className="skill-percent">
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. LAYER: Encoded ASCII Code Layout (Left side of scanner - clipped from right) */}
            <div 
              className="skills-card skills-card-ascii"
              style={{
                clipPath: isMobile 
                  ? 'inset(var(--clip-top, 0%) 0 0 0)' 
                  : 'inset(0 calc(100% - var(--clip-left, 0%)) 0 0)'
              }}
            >
              <div className="skills-ascii-content">
                {mounted ? generateRandomCode(60, 16) : ""}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>{/* end skills-scanner-container */}

    {/* Control Buttons (Play/Pause, Reset, Direction) - OUTSIDE overflow:hidden container */}
    <div className="flex justify-center gap-3 mt-6 relative z-30 select-none flex-wrap">
      <button 
        onClick={() => setIsAnimating(!isAnimating)}
        className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl border border-[var(--glass-border)] bg-[var(--card)] hover:bg-[var(--badge-bg)] text-[var(--text-main)] transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        {isAnimating ? "⏸️ Pause" : "▶️ Play"}
      </button>
      <button 
        onClick={() => {
          positionRef.current = -300;
          const isMob = window.innerWidth < 768;
          velocityRef.current = isMob ? 45 : 100;
          directionRef.current = isMob ? 1 : -1;
          setIsAnimating(true);
        }}
        className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl border border-[var(--glass-border)] bg-[var(--card)] hover:bg-[var(--badge-bg)] text-[var(--text-main)] transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        🔄 Reset
      </button>
      <button 
        onClick={() => {
          directionRef.current = directionRef.current === 1 ? -1 : 1;
        }}
        className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl border border-[var(--glass-border)] bg-[var(--card)] hover:bg-[var(--badge-bg)] text-[var(--text-main)] transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        {isMobile ? "↕️ Yön" : "↔️ Yön"}
      </button>
    </div>
    </>
  );
};
