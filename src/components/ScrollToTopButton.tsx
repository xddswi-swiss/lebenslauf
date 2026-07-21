"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClimbing, setIsClimbing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isClimbing) {
        if (window.scrollY > 300) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClimbing]);

  const handleClick = () => {
    setIsClimbing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnimationComplete = () => {
    if (isClimbing) {
      setIsVisible(false);
      setIsClimbing(false);
    }
  };

  return (
    <>
      <style>{`
        .climbing-stickman {
          transform: rotate(-25deg);
          transition: transform 0.3s ease;
          color: currentColor;
        }
        
        /* Base / standing slow breath */
        .climbing-stickman .left-leg {
          transform-origin: 12px 16.5px;
          animation: stand-breath 3s infinite ease-in-out alternate;
        }
        .climbing-stickman .right-leg {
          transform-origin: 12px 16.5px;
          animation: stand-breath 3s infinite ease-in-out;
        }
        .climbing-stickman .left-arm {
          transform-origin: 12px 11.5px;
          animation: stand-breath 3s infinite ease-in-out;
        }
        .climbing-stickman .right-arm {
          transform-origin: 12px 11.5px;
          animation: stand-breath 3s infinite ease-in-out alternate;
        }

        /* Hovered: Slow walk */
        .climbing-stickman.hovered {
          transform: rotate(-30deg) scale(1.05);
        }
        .climbing-stickman.hovered .left-leg {
          animation: walk-leg-left 0.8s infinite ease-in-out;
        }
        .climbing-stickman.hovered .right-leg {
          animation: walk-leg-right 0.8s infinite ease-in-out;
        }
        .climbing-stickman.hovered .left-arm {
          animation: walk-arm-left 0.8s infinite ease-in-out;
        }
        .climbing-stickman.hovered .right-arm {
          animation: walk-arm-right 0.8s infinite ease-in-out;
        }

        /* Climbing/Running */
        .climbing-stickman.climbing {
          animation: body-bounce 0.15s infinite alternate ease-in-out;
        }
        .climbing-stickman.climbing .left-leg {
          animation: walk-leg-left 0.25s infinite linear;
        }
        .climbing-stickman.climbing .right-leg {
          animation: walk-leg-right 0.25s infinite linear;
        }
        .climbing-stickman.climbing .left-arm {
          animation: walk-arm-left 0.25s infinite linear;
        }
        .climbing-stickman.climbing .right-arm {
          animation: walk-arm-right 0.25s infinite linear;
        }

        @keyframes stand-breath {
          0% { transform: rotate(-5deg); }
          100% { transform: rotate(5deg); }
        }
        @keyframes walk-leg-left {
          0% { transform: rotate(-35deg); }
          50% { transform: rotate(35deg); }
          100% { transform: rotate(-35deg); }
        }
        @keyframes walk-leg-right {
          0% { transform: rotate(35deg); }
          50% { transform: rotate(-35deg); }
          100% { transform: rotate(35deg); }
        }
        @keyframes walk-arm-left {
          0% { transform: rotate(25deg); }
          50% { transform: rotate(-25deg); }
          100% { transform: rotate(25deg); }
        }
        @keyframes walk-arm-right {
          0% { transform: rotate(-25deg); }
          50% { transform: rotate(25deg); }
          100% { transform: rotate(-25deg); }
        }
        @keyframes body-bounce {
          0% { transform: rotate(-35deg) translateY(0); }
          100% { transform: rotate(-35deg) translateY(-3px); }
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: isClimbing ? "-115vh" : 0,
              transition: isClimbing
                ? { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
                : { type: "spring", stiffness: 260, damping: 20 },
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            onAnimationComplete={handleAnimationComplete}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="scroll-top-btn fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 p-3 rounded-full bg-primary hover:opacity-95 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 cursor-pointer flex items-center justify-center w-14 h-14"
            aria-label="Scroll to top"
          >
            <svg
              viewBox="0 0 24 24"
              className={`climbing-stickman ${isClimbing ? "climbing" : ""} ${isHovered && !isClimbing ? "hovered" : ""}`}
              width="36"
              height="36"
            >
              {/* Head with smile and eyes */}
              <g>
                <circle
                  cx="12"
                  cy="6"
                  r="3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="var(--primary)"
                />
                <circle cx="10.8" cy="5.2" r="0.6" fill="currentColor" />
                <circle cx="13.2" cy="5.2" r="0.6" fill="currentColor" />
                <path
                  d="M 10.5 7.2 Q 12 8.7 13.5 7.2"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
              {/* Spine */}
              <line
                x1="12"
                y1="9.5"
                x2="12"
                y2="16.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Left Arm */}
              <line
                className="left-arm"
                x1="12"
                y1="11.5"
                x2="7.5"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Right Arm */}
              <line
                className="right-arm"
                x1="12"
                y1="11.5"
                x2="16.5"
                y2="9"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Left Leg */}
              <line
                className="left-leg"
                x1="12"
                y1="16.5"
                x2="8.5"
                y2="22.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Right Leg */}
              <line
                className="right-leg"
                x1="12"
                y1="16.5"
                x2="15.5"
                y2="22.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
