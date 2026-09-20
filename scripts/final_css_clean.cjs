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

const allFiles = walkSync(path.join(process.cwd(), 'app'));

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Final cleanup of explicit hex codes used in TSX logic
  content = content.replace(/['"]#2a3050['"]/gi, "'var(--border)'");
  content = content.replace(/['"]#64748b['"]/gi, "'var(--muted)'");
  content = content.replace(/['"]#94a3b8['"]/gi, "'var(--muted)'");
  content = content.replace(/['"]#38bdf8['"]/gi, "'var(--primary)'");
  content = content.replace(/['"]#f8fafc['"]/gi, "'var(--text)'");

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Final CSS Clean: ${file}`);
  }
});
