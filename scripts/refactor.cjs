const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('app', (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace Hardcoded Backgrounds
    content = content.replace(/background:\s*['"]#(131722|161926|111827|0b0f1a)['"]/g, "background: 'var(--card)'");
    // Replace Hardcoded Borders
    content = content.replace(/border:\s*['"]1px solid #(2a3050|3a4568|1f2937)['"]/g, "border: '1px solid var(--border)'");
    content = content.replace(/borderColor:\s*['"]#(2a3050|3a4568|1f2937)['"]/g, "borderColor: 'var(--border)'");
    // Replace Hardcoded Texts
    content = content.replace(/color:\s*WHITE/g, "color: 'var(--text)'");
    content = content.replace(/color:\s*['"]#ffffff['"]/g, "color: 'var(--text)'");
    content = content.replace(/color:\s*['"]#e2e8f8['"]/g, "color: 'var(--text)'");
    content = content.replace(/color:\s*MUTED_LABEL/g, "color: 'var(--muted)'");
    content = content.replace(/color:\s*['"]rgba\(255,\s*255,\s*255,\s*0\.55\)['"]/g, "color: 'var(--muted)'");
    content = content.replace(/color:\s*['"]#94a3b8['"]/g, "color: 'var(--muted)'");
    
    // Emojis to remove or replace
    content = content.replace(/💼|📈|🤝|🕒|💸|📝|📅|👥|🔐|⚡|🚀|✨|⚠️|✅|❌|🔥|💡/g, '');

    fs.writeFileSync(filePath, content, 'utf8');
  }
});
console.log('UI Hardcoded Styles & Emojis Refactored');
