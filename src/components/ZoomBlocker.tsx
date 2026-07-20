"use client";

import { useEffect } from "react";

export default function ZoomBlocker() {
  useEffect(() => {
    // İki parmakla dokunulduğunda büyütmeyi (pinch) engeller
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches && event.touches.length > 1) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });
    
    // Ayrıca touchstart için de önlem
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches && event.touches.length > 1) {
        event.preventDefault();
      }
    };
    document.addEventListener("touchstart", handleTouchStart, { passive: false, capture: true });

    // Çift tıklama ile büyütmeyi engeller
    let lastTouchEnd = 0;
    const handleTouchEnd = (event: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener("touchend", handleTouchEnd, { passive: false, capture: true });

    // Safari gestures
    const preventGesture = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", preventGesture, { passive: false, capture: true });
    document.addEventListener("gesturechange", preventGesture, { passive: false, capture: true });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove, { capture: true } as EventListenerOptions);
      document.removeEventListener("touchstart", handleTouchStart, { capture: true } as EventListenerOptions);
      document.removeEventListener("touchend", handleTouchEnd, { capture: true } as EventListenerOptions);
      document.removeEventListener("gesturestart", preventGesture, { capture: true } as EventListenerOptions);
      document.removeEventListener("gesturechange", preventGesture, { capture: true } as EventListenerOptions);
    };
  }, []);

  return null;
}
