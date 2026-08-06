"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface GsapHeroTextProps {
  text: string;
  className?: string;
  delay?: number;
  tag?: React.ElementType;
}

export const GsapHeroText: React.FC<GsapHeroTextProps> = ({
  text,
  className = "",
  delay = 0,
  tag = "h1",
}) => {
  const Tag = tag as any;
  const containerRef = useRef<HTMLElement>(null);

  const words = text.split(" ").map((word, wordIndex) => {
    return (
      <span
        key={wordIndex}
        className="inline-block opacity-0 translate-y-8 rotate-6 origin-bottom char-reveal mr-[0.25em] whitespace-nowrap"
      >
        {word}
      </span>
    );
  });

  useGSAP(
    () => {
      // Much more dramatic GSAP reveal for letters
      gsap.fromTo(
        ".char-reveal",
        {
          y: 100,
          opacity: 0,
          rotationX: -90,
          rotationZ: 15,
          scale: 0.3,
          transformOrigin: "bottom center"
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          rotationZ: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.04,
          ease: "elastic.out(1, 0.4)",
          delay: delay,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <Tag ref={containerRef as any} className={className} style={{ perspective: "1000px" }}>
      {words}
    </Tag>
  );
};
