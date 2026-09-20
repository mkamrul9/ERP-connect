const fs = require('fs');

const file = 'app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace constants
content = content.replace(/const WHITE = '#ffffff';/g, "const WHITE = 'var(--text)';");
content = content.replace(/const MUTED_LABEL = 'rgba\\(255,255,255,0\\.55\\)';/g, "const MUTED_LABEL = 'var(--muted)';");
content = content.replace(/const BLUE = '#4f7eff';/g, "const BLUE = 'var(--primary)';");
content = content.replace(/const BLUE_BG = 'rgba\\(79,126,255,0\\.15\\)';/g, "const BLUE_BG = 'var(--primary-dim)';");
content = content.replace(/const BLUE_GRAD = 'linear-gradient\\(135deg, #4f7eff, #6c4fe3\\)';/g, "const BLUE_GRAD = 'var(--primary)';");

// Replace hardcoded hexes in styles
content = content.replace(/'#131722'/g, "'var(--surface)'");
content = content.replace(/'#161926'/g, "'var(--card)'");
content = content.replace(/'#2a3050'/g, "'var(--border)'");
content = content.replace(/'#3a4568'/g, "'var(--border)'");
content = content.replace(/colorScheme: 'dark'/g, "colorScheme: 'light dark'");
content = content.replace(/background: '#0b0f1a'/g, "background: 'var(--bg)'");
content = content.replace(/background: '#1a2236'/g, "background: 'var(--card)'");
content = content.replace(/'#0b0f1a'/g, "'var(--bg)'");

fs.writeFileSync(file, content, 'utf8');
console.log('Dashboard inline colors replaced with CSS variables.');
