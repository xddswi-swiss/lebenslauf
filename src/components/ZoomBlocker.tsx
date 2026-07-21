"use client";

import { useEffect } from "react";

export default function ZoomBlocker() {
  useEffect(() => {
    // Sadece dokunmatik ekran hareketlerini engellemek için fonksiyonlar
    const handleTouchMove = (event: TouchEvent) => {
      // Eğer ekranda birden fazla parmak varsa (iki parmakla büyütme yapılıyorsa) engelle
      if (event.touches && event.touches.length > 1) {
        if (event.cancelable) {
          event.preventDefault();
        }
      }
    };

    let lastTouchEnd = 0;
    const handleTouchEnd = (event: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        // Çift dokunarak büyütmeyi engelle ama normal buton tıklamalarına dokunma
        if (event.cancelable) {
          event.preventDefault();
        }
      }
      lastTouchEnd = now;
    };

    // Bu dinleyicileri SADECE dokunmatik cihazlarda çalışacak şekilde ekliyoruz
    // 'passive: false' tarayıcının bu engellemeyi zorunlu kılmasını sağlar
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return null;
}
