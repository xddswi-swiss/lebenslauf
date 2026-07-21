"use client";

import { useEffect } from "react";

export default function ZoomBlocker() {
  useEffect(() => {
    // 1. Safari'ye özel "iki parmakla büyütme" jestini anında öldürür
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    // 2. Çift dokunma (double-tap) ile yakınlaştırmayı engeller
    let lastTouchEnd = 0;
    const preventDoubleTap = (e: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        if (e.cancelable) e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // 3. Sayfa kayarken (momentum scroll) ikinci parmak değdiğinde büyütmeyi engeller
    const preventMultiTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    // Olay Dinleyicileri
    document.addEventListener("gesturestart", preventGesture, { passive: false });
    document.addEventListener("gesturechange", preventGesture, { passive: false });
    document.addEventListener("gestureend", preventGesture, { passive: false });
    document.addEventListener("touchend", preventDoubleTap, { passive: false });
    document.addEventListener("touchmove", preventMultiTouchMove, { passive: false });

    return () => {
      document.removeEventListener("gesturestart", preventGesture);
      document.removeEventListener("gesturechange", preventGesture);
      document.removeEventListener("gestureend", preventGesture);
      document.removeEventListener("touchend", preventDoubleTap);
      document.removeEventListener("touchmove", preventMultiTouchMove);
    };
  }, []);

  return null;
}
