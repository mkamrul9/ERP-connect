const fs = require('fs');

const file = 'app/accounts/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('FinancialAnalytics')) {
  // Import the component
  content = content.replace(
    "import Pagination from '../components/Pagination';",
    "import Pagination from '../components/Pagination';\nimport FinancialAnalytics from '../components/FinancialAnalytics';"
  );
  
  // Add the tab state
  content = content.replace(
    "const [month, setMonth]",
    "const [tab, setTab] = useState<'list' | 'analytics'>('list');\n  const [month, setMonth]"
  );
  
  // Add Tabs UI right below the month picker
  const monthPickerStr = `        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Month
          </label>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
            style={{ ...fieldInputSt, width: 'auto', minWidth: 150,  }}
          />
          <div style={{ marginLeft: 'auto', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text)' }}>
            {fmtBDT(monthTotal)}
          </div>
        </div>`;
        
  const tabsStr = `${monthPickerStr}

        <div className="tabs" style={{ display: 'flex', gap: 20, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
          <div 
            onClick={() => setTab('list')}
            style={{ padding: '10px 10px', fontSize: '0.88rem', fontWeight: tab === 'list' ? 700 : 500, color: tab === 'list' ? 'var(--primary)' : 'var(--muted)', borderBottom: tab === 'list' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
            Expenses List
          </div>
          <div 
            onClick={() => setTab('analytics')}
            style={{ padding: '10px 10px', fontSize: '0.88rem', fontWeight: tab === 'analytics' ? 700 : 500, color: tab === 'analytics' ? 'var(--primary)' : 'var(--muted)', borderBottom: tab === 'analytics' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
            Analytics BI
          </div>
        </div>`;
        
  content = content.replace(monthPickerStr, tabsStr);
  
  // Conditional rendering
  const listRender = `{loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text)', opacity: 0.6, fontSize: '0.85rem' }}>Loading...</div>
        ) : expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text)', opacity: 0.6, fontSize: '0.85rem' }}>
            No expenses this month. Tap + to add one.
          </div>
        ) : (
          expenses.slice((currentPage - 1) * 10, currentPage * 10).map(exp => <CompactExpenseCard key={exp.id} expense={exp} onClick={() => openDetail(exp)} />)
        )}`;
        
  const newRender = `{tab === 'list' ? (
          <>
            ${listRender}
            <Pagination currentPage={currentPage} totalItems={expenses.length} itemsPerPage={10} onPageChange={setCurrentPage} />
          </>
        ) : (
          <FinancialAnalytics expenses={expenses} />
        )}`;
        
  content = content.replace(listRender, newRender);
  
  // Remove the old Pagination that was just sitting below the div
  content = content.replace(/<Pagination currentPage=\{currentPage\} totalItems=\{expenses\.length\} itemsPerPage=\{10\} onPageChange=\{setCurrentPage\} \/>\s*<button/, "<button");
  
  fs.writeFileSync(file, content);
  console.log('Accounts Analytics tab injected');
}
