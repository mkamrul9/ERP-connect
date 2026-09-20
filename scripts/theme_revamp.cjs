const fs = require('fs');
const file = 'app/globals.css';
let css = fs.readFileSync(file, 'utf8');

const newDarkTheme = `:root,[data-theme="dark"]{
  --bg:          #0a0a0a;
  --surface:     #121212;
  --card:        #171717;
  --card-hover:  #202020;
  --border:      #262626;
  --border-subtle: #1a1a1a;

  --primary:     #ffffff;
  --primary-dim: rgba(255,255,255,0.08);
  --primary-glow:rgba(255,255,255,0.15);
  --primary-hover:#e5e5e5;

  --accent:      #22c55e;
  --accent-dim:  rgba(34,197,94,0.12);

  --text:        #f5f5f5;
  --text-sec:    #a3a3a3;
  --muted:       #737373;

  --red:         #ef4444;
  --rs:          rgba(239,68,68,.13);
  --orange:      #f59e0b;
  --os:          rgba(245,158,11,.13);
  --green:       #10b981;
  --gs:          rgba(16,185,129,.13);

  --sidebar:     240px;
  --radius:      10px;
  --radius-lg:   14px;
  --radius-sm:   6px;

  --shadow-sm:   0 1px 3px rgba(0,0,0,0.5);
  --shadow-md:   0 4px 16px rgba(0,0,0,0.6);
  --shadow-lg:   0 10px 32px rgba(0,0,0,0.7);

  --topbar-bg:   rgba(10,10,10,0.85);
  --glass-blur:  blur(12px);
}`;

const newLightTheme = `[data-theme="light"]{
  --bg:          #fafafa;
  --surface:     #ffffff;
  --card:        #ffffff;
  --card-hover:  #f5f5f5;
  --border:      #e5e5e5;
  --border-subtle:#f0f0f0;

  --primary:     #0a0a0a;
  --primary-dim: rgba(0,0,0,0.05);
  --primary-glow:rgba(0,0,0,0.15);
  --primary-hover:#262626;

  --accent:      #22c55e;
  --accent-dim:  rgba(34,197,94,0.08);

  --text:        #171717;
  --text-sec:    #525252;
  --muted:       #a3a3a3;

  --red:         #e11d48;
  --rs:          rgba(225,29,72,.09);
  --orange:      #d97706;
  --os:          rgba(217,119,6,.09);
  --green:       #059669;
  --gs:          rgba(5,150,105,.09);

  --shadow-sm:   0 1px 3px rgba(0,0,0,0.05);
  --shadow-md:   0 4px 16px rgba(0,0,0,0.06);
  --shadow-lg:   0 10px 32px rgba(0,0,0,0.08);

  --topbar-bg:   rgba(255,255,255,0.88);
}`;

// Replace Dark Theme block
css = css.replace(/:root,\[data-theme="dark"\]\{[\s\S]*?--glass-blur:[^}]*\}/, newDarkTheme);
// Replace Light Theme block
css = css.replace(/\[data-theme="light"\]\{[\s\S]*?--topbar-bg:[^}]*\}/, newLightTheme);

// Fix gradients and hardcoded colors
css = css.replace(/background:linear-gradient\(135deg,#6366f1 0%,#14b8a6 100%\);/g, 'background:var(--primary);');
css = css.replace(/box-shadow:0 4px 12px rgba\(99,102,241,\.4\);/g, 'box-shadow:var(--shadow-md);');
css = css.replace(/background:linear-gradient\(135deg,#6366f1,#14b8a6\);/g, 'background:var(--primary);');

// Fix buttons
css = css.replace(/background:linear-gradient\(135deg,#6366f1,#4f46e5\);/g, 'background:var(--primary);');
css = css.replace(/color:#fff;box-shadow:0 2px 8px var\(--primary-glow\);/g, 'color:var(--bg);box-shadow:0 2px 8px var(--primary-glow);');
css = css.replace(/background:linear-gradient\(135deg,#4f46e5,#3730a3\);/g, 'background:var(--primary-hover);');

// The dashboard modal "close/save" buttons uses BLUE_GRAD, which we set to var(--primary). 
// But wait, the text inside is color: WHITE. In light mode, var(--primary) is black, so WHITE text is perfectly fine!

fs.writeFileSync(file, css, 'utf8');
console.log('Globals.css theme updated.');
