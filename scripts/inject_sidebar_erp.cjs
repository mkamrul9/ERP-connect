const fs = require('fs');

const file = 'app/components/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('href="/crm"')) {
  // Add Users and Package to imports if not there
  if (!content.includes('Package')) {
     content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, Package } from 'lucide-react';");
  }

  // Inject CRM and Inventory right above Automations
  const automationsLink = `<Link href="/automations"`;
  const crmInventoryLinks = `        <Link href="/crm" style={navLinkSt('/crm')} onClick={() => setMobileOpen(false)}>
          <Users size={20} />
          <span>CRM</span>
        </Link>
        <Link href="/inventory" style={navLinkSt('/inventory')} onClick={() => setMobileOpen(false)}>
          <Package size={20} />
          <span>Inventory</span>
        </Link>
        <Link href="/automations"`;
        
  content = content.replace(automationsLink, crmInventoryLinks);
  
  fs.writeFileSync(file, content);
  console.log('Sidebar updated with CRM and Inventory links');
}
