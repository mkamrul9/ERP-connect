const fs = require('fs');

const file = 'src/db.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('CREATE TABLE IF NOT EXISTS automations')) {

  const pgAutomations = `
      CREATE TABLE IF NOT EXISTS automations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        trigger_event TEXT NOT NULL,
        action_type TEXT NOT NULL,
        action_payload TEXT,
        is_active INTEGER DEFAULT 1,
        created_by INTEGER REFERENCES members(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS automation_logs (
        id SERIAL PRIMARY KEY,
        automation_id INTEGER REFERENCES automations(id) ON DELETE CASCADE,
        triggered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'SUCCESS',
        details TEXT
      );
`;

  const sqliteAutomations = `
      CREATE TABLE IF NOT EXISTS automations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        trigger_event TEXT NOT NULL,
        action_type TEXT NOT NULL,
        action_payload TEXT,
        is_active INTEGER DEFAULT 1,
        created_by INTEGER REFERENCES members(id) ON DELETE SET NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS automation_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        automation_id INTEGER REFERENCES automations(id) ON DELETE CASCADE,
        triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'SUCCESS',
        details TEXT
      );
`;

  // Inject into Postgres block
  content = content.replace(
    "CREATE TABLE IF NOT EXISTS email_jobs",
    pgAutomations + "\n      CREATE TABLE IF NOT EXISTS email_jobs"
  );
  
  // Inject into SQLite block
  content = content.replace(
    "CREATE TABLE IF NOT EXISTS email_jobs (",
    sqliteAutomations + "\n      CREATE TABLE IF NOT EXISTS email_jobs ("
  );

  fs.writeFileSync(file, content);
  console.log('Automations schema injected into db.ts');
} else {
  console.log('Automations schema already present in db.ts');
}
