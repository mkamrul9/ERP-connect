const fs = require('fs');

const file = 'app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('Pagination')) {
  content = content.replace("import { useState", "import Pagination from '../components/Pagination';\nimport { useState");
  content = content.replace("const [loading", "const [currentPage, setCurrentPage] = useState(1);\n  const [loading");
  
  content = content.replace(/filteredTasks\.map\(/g, "filteredTasks.slice((currentPage - 1) * 10, currentPage * 10).map(");
  
  const endTable = `                      </tbody>
                    </table>
                  </div>`;
  const endTableWithPag = `                      </tbody>
                    </table>
                  </div>
                  <Pagination currentPage={currentPage} totalItems={filteredTasks.length} itemsPerPage={10} onPageChange={setCurrentPage} />`;
                  
  content = content.replace(endTable, endTableWithPag);
  
  fs.writeFileSync(file, content);
  console.log('Paginated Dashboard cleanly');
}
