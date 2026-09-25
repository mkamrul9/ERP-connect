const fs = require('fs');
let content = fs.readFileSync('src/db.ts', 'utf8');

const tables = [
  'members', 'attendance', 'tasks', 'leave_requests', 
  'expense_categories', 'expenses', 'credentials', 'meetings', 
  'tenders', 'automations', 'automation_logs', 'email_jobs', 'notifications', 'active_sessions'
];

// Add PG tenants table
content = content.replace('CREATE TABLE IF NOT EXISTS members (', 
`CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        subdomain TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS members (`);

// Add SQLite tenants table
content = content.replace('CREATE TABLE IF NOT EXISTS members (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,',
`CREATE TABLE IF NOT EXISTS tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subdomain TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,`);

// Insert tenant_id into PG schema definitions
for (const table of tables) {
  content = content.replace(
    new RegExp(`(CREATE TABLE IF NOT EXISTS ${table} \\(\\s+id SERIAL PRIMARY KEY,)`),
    `$1\n        tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,`
  );
}

// Special case for active_sessions which doesn't have SERIAL PRIMARY KEY
content = content.replace(
  `CREATE TABLE IF NOT EXISTS active_sessions (\n        member_id INTEGER PRIMARY KEY,`,
  `CREATE TABLE IF NOT EXISTS active_sessions (\n        member_id INTEGER PRIMARY KEY,\n        tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,`
);

// Insert tenant_id into SQLite schema definitions
for (const table of tables) {
  content = content.replace(
    new RegExp(`(CREATE TABLE IF NOT EXISTS ${table} \\(\\s+id INTEGER PRIMARY KEY AUTOINCREMENT,)`),
    `$1\n        tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,`
  );
}

// Add migrations for PG
const pgMigrations = tables.map(t => `    try { await pgPool.query("ALTER TABLE ${t} ADD COLUMN IF NOT EXISTS tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE"); } catch (e) {}`).join('\n');
content = content.replace(
  'try { await pgPool.query("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link TEXT DEFAULT \'\'"); } catch (e) {}',
  `try { await pgPool.query("ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link TEXT DEFAULT ''"); } catch (e) {}\n${pgMigrations}`
);

// Add migrations for SQLite
const sqliteMigrations = tables.map(t => `    try { await sqliteDb.exec("ALTER TABLE ${t} ADD COLUMN tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE"); } catch (e) {}`).join('\n');
content = content.replace(
  'try { await sqliteDb.exec("ALTER TABLE notifications ADD COLUMN link TEXT DEFAULT \'\'"); } catch (e) {}',
  `try { await sqliteDb.exec("ALTER TABLE notifications ADD COLUMN link TEXT DEFAULT ''"); } catch (e) {}\n${sqliteMigrations}`
);

// Add default tenant seeding logic
const tenantSeedCode = `
  // Ensure default tenant exists for migration
  const tenantCount = await dbGet('SELECT COUNT(*) as c FROM tenants');
  if (Number((tenantCount as any)?.c || (tenantCount as any)?.count || 0) === 0) {
    await dbRun("INSERT INTO tenants (name, subdomain) VALUES ('Default Organization', 'default')");
  }
  const defaultTenant = await dbGet('SELECT id FROM tenants ORDER BY id ASC LIMIT 1');
  let defaultTenantId = 1;
  if (defaultTenant) {
    defaultTenantId = (defaultTenant as any).id;
    const tablesToMigrate = ['members', 'attendance', 'tasks', 'leave_requests', 'expense_categories', 'expenses', 'credentials', 'meetings', 'tenders', 'automations', 'automation_logs', 'email_jobs', 'notifications', 'active_sessions'];
    for (const tbl of tablesToMigrate) {
      await dbRun(\`UPDATE \${tbl} SET tenant_id = ? WHERE tenant_id IS NULL\`, [defaultTenantId]);
    }
  }
`;

content = content.replace(
  '// Seed default admin and employee accounts',
  tenantSeedCode + '\n\n  // Seed default admin and employee accounts'
);

// Update account seeding to use tenant_id
content = content.replace(
  /INSERT INTO members \(name, email, password_hash, role, avatar_color, notify_email\) VALUES \(\?, \?, \?, \?, \?, \?\)/,
  `INSERT INTO members (name, email, password_hash, role, avatar_color, notify_email, tenant_id) VALUES (?, ?, ?, ?, ?, ?, ?)`
);
content = content.replace(
  /\[acc\.name, acc\.email, acc\.hash, acc\.role, acc\.color, acc\.notify_email \|\| ''\]/,
  `[acc.name, acc.email, acc.hash, acc.role, acc.color, acc.notify_email || '', defaultTenantId]`
);

fs.writeFileSync('src/db.ts', content, 'utf8');
console.log('db.ts patched successfully!');
