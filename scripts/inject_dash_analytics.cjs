const fs = require('fs');

const file = 'app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ProductivityAnalytics')) {
  // Import the component
  content = content.replace(
    "import Pagination from '../components/Pagination';",
    "import Pagination from '../components/Pagination';\nimport ProductivityAnalytics from '../components/ProductivityAnalytics';"
  );
  
  // Find where tabs are defined: const TABS = ['my', 'team'];
  // Actually, we can just replace 'my', 'team' with 'my', 'team', 'analytics' if it's an array,
  // or we can search for the tab rendering logic.
  // Wait, let's just replace the type of `tab` state if it's there.
  content = content.replace(
    "const [tab, setTab] = useState<'my' | 'team'>('my');",
    "const [tab, setTab] = useState<'my' | 'team' | 'analytics'>('my');"
  );
  // Also if it was declared without types:
  content = content.replace(
    "const [tab, setTab] = useState('my');",
    "const [tab, setTab] = useState<'my' | 'team' | 'analytics'>('my');"
  );
  
  // Find the tabs rendering array
  content = content.replace(
    "['my', 'team'].map(t => (",
    "['my', 'team', 'analytics'].map(t => ("
  );
  
  // Tab label capitalization is handled by `t.charAt(0).toUpperCase() + t.slice(1)` usually.
  // If not, it just prints 'analytics'.
  
  // Find the end of the `team` tab render logic to inject `analytics`
  // It looks like:
  //         ) : tab === 'team' ? (
  //           ...
  //         ) : null
  
  const targetEnd = `) : null
        )}

      </div>`;
  
  const newEnd = `) : tab === 'analytics' ? (
            <div style={{ marginTop: '20px' }}>
              <ProductivityAnalytics tasks={filteredTasks} />
            </div>
          ) : null
        )}

      </div>`;
      
  content = content.replace(targetEnd, newEnd);
  
  fs.writeFileSync(file, content);
  console.log('Dashboard Analytics tab injected');
}
