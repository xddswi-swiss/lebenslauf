export function ThemeInitializer() {
  return (
    <script
      id="theme-initializer"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var theme = localStorage.getItem('theme-mode');
            if (!theme) {
              var bw = localStorage.getItem('bw-mode');
              if (bw === 'false') {
                var pref = localStorage.getItem('preferred-theme');
                theme = pref === 'dark' ? 'blue' : 'yellow';
              } else {
                theme = 'white';
              }
            }

            var colors = {
              white: '#ffffff',
              yellow: '#ffc72c',
              blue: '#102552'
            };
            var color = colors[theme] || '#ffffff';

            if (theme === 'white') {
              document.documentElement.classList.add('bw-mode');
              document.documentElement.classList.remove('dark');
            } else if (theme === 'yellow') {
              document.documentElement.classList.remove('bw-mode');
              document.documentElement.classList.remove('dark');
            } else if (theme === 'blue') {
              document.documentElement.classList.remove('bw-mode');
              document.documentElement.classList.add('dark');
            }

            document.querySelectorAll('meta[name="theme-color"]').forEach(function(el) {
              el.remove();
            });
            var meta = document.createElement('meta');
            meta.id = 'theme-color-meta';
            meta.setAttribute('name', 'theme-color');
            meta.setAttribute('content', color);
            document.head.prepend(meta);

            var appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
            if (!appleMeta) {
              appleMeta = document.createElement('meta');
              appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
              appleMeta.setAttribute('content', 'black-translucent');
              document.head.prepend(appleMeta);
            } else {
              appleMeta.setAttribute('content', 'black-translucent');
            }

            document.documentElement.style.background = color;
            document.documentElement.style.backgroundColor = color;
            if (document.body) {
              document.body.style.background = color;
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
