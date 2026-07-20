const fs = require("fs");
const path = "D:/repos/gemini-lebenslauf/src/app/globals.css";

let css = fs.readFileSync(path, "utf8");

// We need to keep :root (lines 150-176) because bw-mode might need base variables if we don't redefine them all,
// OR we can just let theme-yellow handle the light mode defaults.
// Actually, theme-yellow has :root:not(.dark):not(.bw-mode). So base :root can be removed if bw-mode defines what it needs.
// Let's remove :root (lines 150-176) and :root.dark (178-204)
css = css.replace(/:root\s*\{[\s\S]*?\n\}\n/g, "");
css = css.replace(/:root\.dark\s*\{[\s\S]*?\n\}\n/g, "");

// Remove all :root:not(.dark):not(.bw-mode) blocks
css = css.replace(
  /:root:not\(\.dark\):not\(\.bw-mode\)[^{]*\{[\s\S]*?\n\}\n/g,
  "",
);

// Remove all :root.dark:not(.bw-mode) blocks
css = css.replace(/:root\.dark:not\(\.bw-mode\)[^{]*\{[\s\S]*?\n\}\n/g, "");

// Remove .dark .skills-card-ascii and .dark .skills-ascii-content blocks
css = css.replace(/\.dark \.skills-card-ascii\s*\{[\s\S]*?\n\}\n/g, "");
css = css.replace(/\.dark \.skills-ascii-content\s*\{[\s\S]*?\n\}\n/g, "");

// Remove html:not(.dark):not(.bw-mode) .skills-card-ascii blocks
css = css.replace(
  /html:not\(\.dark\):not\(\.bw-mode\)\s*\.skills[^{]*\{[\s\S]*?\n\}\n/g,
  "",
);

// Clean up multiple empty lines
css = css.replace(/\n\s*\n\s*\n/g, "\n\n");

fs.writeFileSync(path, css);
console.log("Cleaned globals.css");
