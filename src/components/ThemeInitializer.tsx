export function ThemeInitializer() {
  return (
    <script
      id="theme-initializer"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var bw = localStorage.getItem('bw-mode');
            var isBw = bw !== 'false';
            if (isBw) {
              document.documentElement.classList.add('bw-mode');
            } else {
              document.documentElement.classList.remove('bw-mode');
            }

            var savedTheme = localStorage.getItem('preferred-theme');
            var isDark = false;
            if (savedTheme === 'dark') {
              isDark = true;
            } else if (savedTheme === 'light') {
              isDark = false;
            } else {
              isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }

            var color = '#ffffff';
            if (!isBw) {
              color = isDark ? '#102552' : '#ffc72c';
            }

            // Remove old theme-color and apple status bar style tags
            var oldMetas = document.querySelectorAll('meta[name="theme-color"], meta[name="apple-mobile-web-app-status-bar-style"]');
            for (var i = 0; i < oldMetas.length; i++) {
              if (oldMetas[i].parentNode) {
                oldMetas[i].parentNode.removeChild(oldMetas[i]);
              }
            }

            // Fresh meta tag to trigger WebKit Safari status bar repaint
            var meta = document.createElement('meta');
            meta.setAttribute('name', 'theme-color');
            meta.setAttribute('content', color);
            document.head.appendChild(meta);

            // Set html and body background-color directly
            document.documentElement.style.backgroundColor = color;
            if (document.body) {
              document.body.style.backgroundColor = color;
            }
          })();

          // Prevent pinch-to-zoom gestures on mobile devices (e.g. iOS Safari)
          document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
          });
          
          // Prevent zoom during momentum scroll (inertia)
          function preventMultiTouch(e) {
            if (e.touches && e.touches.length > 1) {
              if (e.cancelable) {
                e.preventDefault();
              }
            }
          }
          document.addEventListener('touchstart', preventMultiTouch, { passive: false });
          document.addEventListener('touchmove', preventMultiTouch, { passive: false });
        `,
      }}
    />
  );
}
