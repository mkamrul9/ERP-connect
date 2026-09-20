const fs = require('fs');

const file = 'app/hr/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('currentPageAtt')) {
  content = content.replace("const [curDate", "const [currentPageAtt, setCurrentPageAtt] = useState(1);\n  const [currentPageLeave, setCurrentPageLeave] = useState(1);\n  const [curDate");
  fs.writeFileSync(file, content);
  console.log('Fixed HR page states');
}
