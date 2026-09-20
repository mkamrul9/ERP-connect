const fs = require('fs');

const files = [
  'app/login/page.tsx',
  'app/page.tsx',
  'app/hr/page.tsx',
  'app/dashboard/page.tsx',
  'app/admin/page.tsx',
  'app/components/Topbar.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    // Replace Purple with Enterprise Blue
    content = content.replace(/#6366f1/gi, '#2563eb');
    content = content.replace(/#4f46e5/gi, '#1d4ed8'); // darker purple to darker blue
    content = content.replace(/99,\s*102,\s*241/g, '37, 99, 235'); // rgb purple to rgb blue
    
    // For HR page
    content = content.replace(/#4f7eff/gi, 'var(--primary)');
    content = content.replace(/rgba\(79,126,255,/gi, 'rgba(37,99,235,');
    
    fs.writeFileSync(f, content);
  }
});
console.log('Colors fixed');
