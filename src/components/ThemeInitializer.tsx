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

            // Ensure theme-color-meta is set
            var meta = document.getElementById('theme-color-meta');
            if (!meta) {
              meta = document.createElement('meta');
              meta.id = 'theme-color-meta';
              meta.setAttribute('name', 'theme-color');
              document.head.appendChild(meta);
            }
            meta.setAttribute('content', color);

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
