const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.ts') || dirFile.endsWith('.tsx') || dirFile.endsWith('.cjs')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const allFiles = [...walkSync(path.join(process.cwd(), 'app')), ...walkSync(path.join(process.cwd(), 'src')), path.join(process.cwd(), 'scripts', 'migrate.cjs')];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Fix CSS colors (black hovering, white text in light mode, etc)
  content = content.replace(/['"]#161926['"]/g, "'var(--card)'");
  content = content.replace(/['"]#0b0f1a['"]/g, "'var(--bg)'");
  content = content.replace(/['"]#2a3050['"]/g, "'var(--border)'");
  content = content.replace(/['"]#f1f5f9['"]/g, "'var(--text)'");
  content = content.replace(/['"]#f8fafc['"]/g, "'var(--text)'");
  content = content.replace(/['"]#e2e8f0['"]/g, "'var(--text)'");
  content = content.replace(/colorScheme:\s*['"]dark['"],?/g, "");
  content = content.replace(/color:\s*['"]#38bdf8['"]/g, "color: 'var(--primary)'");
  
  // Specific fix for "fAssignee ? '#38bdf8' : '#f1f5f9'"
  content = content.replace(/\? '#38bdf8' : '#f1f5f9'/g, "? 'var(--primary)' : 'var(--text)'");
  content = content.replace(/\? '#e2e8f0' : '#64748b'/g, "? 'var(--text)' : 'var(--muted)'");

  // rgba fixes for light theme
  content = content.replace(/rgba\(255,255,255,0\.06\)/g, "var(--card-hover)");
  content = content.replace(/rgba\(255,255,255,0\.12\)/g, "var(--border)");
  content = content.replace(/rgba\(0,0,0,0\.25\)/g, "var(--bg)");
  content = content.replace(/rgba\(255,255,255,0\.03\)/g, "var(--bg)");

  // 2. Fix Dummy Data Names and Emails
  content = content.replace(/Ahsan Kabir/gi, "Jane Doe");
  content = content.replace(/Tajimur Rafi/gi, "John Smith");
  content = content.replace(/Arijit Orko/gi, "Alex Johnson");
  content = content.replace(/Kamrul Islam/gi, "Sam Wilson");

  content = content.replace(/ahsankabir13@gmail\.com/gi, "jane@example.com");
  content = content.replace(/tajimurrafi@gmail\.com/gi, "john@example.com");
  content = content.replace(/orko552@gmail\.com/gi, "alex@example.com");
  
  content = content.replace(/alliedone\.com/gi, "erp-connect.com");
  content = content.replace(/AlliedOne/g, "ERP-connect");
  content = content.replace(/alliedone/gi, "erpconnect");

  // Specific name references in logic (hr/page.tsx initials logic)
  content = content.replace(/ahsan/gi, "jane");
  content = content.replace(/kabir/gi, "doe");
  content = content.replace(/tajimur/gi, "john");
  content = content.replace(/rafi/gi, "smith");
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Fixed: ${file}`);
  }
});
