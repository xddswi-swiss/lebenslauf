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

            var oldMetas = document.querySelectorAll('meta[name="theme-color"], meta[name="apple-mobile-web-app-status-bar-style"]');
            for (var i = 0; i < oldMetas.length; i++) {
              if (oldMetas[i].parentNode) {
                oldMetas[i].parentNode.removeChild(oldMetas[i]);
              }
            }

            var meta = document.createElement('meta');
            meta.id = 'theme-color-meta';
            meta.setAttribute('name', 'theme-color');
            meta.setAttribute('content', color);
            document.head.appendChild(meta);

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
