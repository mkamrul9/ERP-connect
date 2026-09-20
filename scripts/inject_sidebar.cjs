const fs = require('fs');

const file = 'app/components/Sidebar.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('href="/automations"')) {
  // Add Zap icon import if missing
  if (!content.includes('Zap')) {
    content = content.replace(
      "import { LayoutDashboard, CheckSquare, Users, FileText, Calendar, Key, DollarSign, Settings, LogOut, ChevronRight } from 'lucide-react';",
      "import { LayoutDashboard, CheckSquare, Users, FileText, Calendar, Key, DollarSign, Settings, LogOut, ChevronRight, Zap } from 'lucide-react';"
    );
    // Alternatively just add Zap in case it uses a different import format
    if (!content.includes('Zap')) {
       content = content.replace(/import \{([^}]+)\} from 'lucide-react';/, "import { $1, Zap } from 'lucide-react';");
    }
  }

  // Find Settings link to inject Automations right before it
  const settingsLink = `<Link href="/admin"`;
  const automationsLink = `        <Link href="/automations" style={navLinkSt('/automations')} onClick={() => setMobileOpen(false)}>
          <Zap size={20} />
          <span>Automations</span>
        </Link>
        <Link href="/admin"`;
        
  content = content.replace(settingsLink, automationsLink);
  
  fs.writeFileSync(file, content);
  console.log('Sidebar updated with Automations link');
}
