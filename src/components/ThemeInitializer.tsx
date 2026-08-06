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

          // Pinch-to-zoom is blocked by 'touch-action: pan-x pan-y' on <html>
          // (see globals.css). This listener only covers iOS Safari, which
          // ignores touch-action for pinch gestures. It never fires during a
          // normal scroll, unlike the non-passive touchstart/touchmove pair that
          // used to live here — those ran on every frame of every swipe and made
          // the browser wait on the main thread before it could scroll.
          document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
          });
        `,
      }}
    />
  );
}
