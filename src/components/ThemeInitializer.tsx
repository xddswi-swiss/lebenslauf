"use client";

import { useServerInsertedHTML } from 'next/navigation';

export function ThemeInitializer() {
  useServerInsertedHTML(() => {
    return (
      <script
        id="theme-initializer"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var bw = localStorage.getItem('bw-mode');
              if (bw === 'false') {
                document.documentElement.classList.remove('bw-mode');
              } else {
                document.documentElement.classList.add('bw-mode');
              }
            })();

            // Prevent pinch-to-zoom and double-tap zoom on mobile devices (e.g. iOS Safari)
            document.addEventListener('gesturestart', function(e) {
              e.preventDefault();
            });
            document.addEventListener('touchmove', function(e) {
              if (e.touches.length > 1) {
                e.preventDefault();
              }
            }, { passive: false });
            var lastTouchEnd = 0;
            document.addEventListener('touchend', function(e) {
              var now = (new Date()).getTime();
              if (now - lastTouchEnd <= 300) {
                e.preventDefault();
              }
              lastTouchEnd = now;
            }, false);
          `,
        }}
      />
    );
  });

  return null;
}
