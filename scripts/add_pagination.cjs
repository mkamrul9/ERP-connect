const fs = require('fs');
const path = require('path');

const targets = [
  { file: 'app/meetings/page.tsx', list: 'meetings' },
  { file: 'app/tenders/page.tsx', list: 'tenders' },
  { file: 'app/credentials/page.tsx', list: 'creds' },
  { file: 'app/accounts/page.tsx', list: 'expenses' }
];

targets.forEach(t => {
  const p = path.join(process.cwd(), t.file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');

  // Fix hardcoded hover states
  content = content.replace(/style\.background\s*=\s*['"]#161926['"]/g, "style.background = 'var(--card)'");
  content = content.replace(/style\.borderColor\s*=\s*['"]#2a3050['"]/g, "style.borderColor = 'var(--border)'");
  content = content.replace(/style\.background\s*=\s*['"]rgba\(79,126,255,0\.04\)['"]/g, "style.background = 'var(--primary-dim)'");
  content = content.replace(/style\.borderColor\s*=\s*['"]#4f7eff['"]/g, "style.borderColor = 'var(--primary)'");

  // Inject pagination
  if (!content.includes('Pagination')) {
    content = content.replace("import { useState", "import Pagination from '../components/Pagination';\nimport { useState");
    content = content.replace("const [loading", "const [currentPage, setCurrentPage] = useState(1);\n  const [loading");
    
    const mapReg = new RegExp(`${t.list}\\.map\\(`, 'g');
    content = content.replace(mapReg, `${t.list}.slice((currentPage - 1) * 10, currentPage * 10).map(`);
    
    // Safe replacement for the end of the div
    content = content.replace(
      `${t.list}.slice((currentPage - 1) * 10, currentPage * 10).map(`,
      `${t.list}.slice((currentPage - 1) * 10, currentPage * 10).map(`
    );

    // Instead of replacing the end of the div, let's inject it before the "add button" which is `<button\n        onClick={() => {` or similar
    const buttonRegex = /(<button\s+onClick=\{\(\) => \{\s+setAddForm)/g;
    content = content.replace(buttonRegex, `<Pagination currentPage={currentPage} totalItems={${t.list}.length} itemsPerPage={10} onPageChange={setCurrentPage} />\n      $1`);
  }
  
  fs.writeFileSync(p, content);
  console.log(`Paginated ${t.file}`);
});
