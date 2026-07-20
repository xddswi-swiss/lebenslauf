export function ThemeInitializer() {
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

          // Prevent pinch-to-zoom gestures on mobile devices (e.g. iOS Safari)
          document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
          });
        `,
      }}
    />
  );
}
