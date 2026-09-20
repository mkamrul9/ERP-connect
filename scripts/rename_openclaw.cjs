const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('.git') && !dirFile.includes('.next')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      filelist.push(dirFile);
    }
  }
  return filelist;
};

const allFiles = walkSync(path.join(__dirname, '..'));

const exts = ['.ts', '.tsx', '.js', '.cjs', '.json', '.md'];

let replacedFiles = 0;

allFiles.forEach(file => {
  if (exts.some(ext => file.endsWith(ext))) {
    const originalContent = fs.readFileSync(file, 'utf8');
    let content = originalContent;
    
    if (file.endsWith('package.json')) {
      content = content.replace(/"name": "company-erp-bot"/g, '"name": "erp-connect"');
    }
    
    // Replace DB names
    content = content.replace(/openclaw\.db/g, 'erp.db');
    
    // Replace module name and class
    content = content.replace(/erp-engine/g, 'erp-engine');
    content = content.replace(/ERPEngine/g, 'ERPEngine');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      replacedFiles++;
      console.log(`Updated: ${file}`);
    }
  }
});

console.log(`Replaced in ${replacedFiles} files.`);
