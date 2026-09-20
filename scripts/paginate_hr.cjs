const fs = require('fs');

const file = 'app/hr/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('Pagination')) {
  content = content.replace("import { useState", "import Pagination from '../components/Pagination';\nimport { useState");
  
  content = content.replace("const [loading", "const [currentPageAtt, setCurrentPageAtt] = useState(1);\n  const [currentPageLeave, setCurrentPageLeave] = useState(1);\n  const [loading");
  
  content = content.replace(/list\.map\(/g, "list.slice((currentPageAtt - 1) * 10, currentPageAtt * 10).map(");
  
  const hrTableEnd = `                      </tbody>
                    </table>
                  </div>`;
  const hrTablePagEnd = `                      </tbody>
                    </table>
                  </div>
                  <Pagination currentPage={currentPageAtt} totalItems={list.length} itemsPerPage={10} onPageChange={setCurrentPageAtt} />`;
  content = content.replace(hrTableEnd, hrTablePagEnd);

  content = content.replace(/openLeaveRequests\.map\(/g, "openLeaveRequests.slice((currentPageLeave - 1) * 10, currentPageLeave * 10).map(");
  
  const hrLeaveEnd = `                  <PendingApprovalCard key={l.id} leave={l} onClick={() => openLeaveDetail(l)} />
                ))}
              </div>`;
  const hrLeavePagEnd = `                  <PendingApprovalCard key={l.id} leave={l} onClick={() => openLeaveDetail(l)} />
                ))}
                <Pagination currentPage={currentPageLeave} totalItems={openLeaveRequests.length} itemsPerPage={10} onPageChange={setCurrentPageLeave} />
              </div>`;
  content = content.replace(hrLeaveEnd, hrLeavePagEnd);

  fs.writeFileSync(file, content);
  console.log('Paginated HR page cleanly');
}
