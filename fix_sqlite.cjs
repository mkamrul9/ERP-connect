const fs = require('fs');
let content = fs.readFileSync('src/db.ts', 'utf8');

// Strip whatsapp and telegram columns entirely
content = content.replace(/.*whatsapp_number.*\r?\n/g, '');
content = content.replace(/.*telegram_chat_id.*\r?\n/g, '');
content = content.replace(/.*notify_telegram.*\r?\n/g, '');

// Ensure tenants table is in sqlite block
if (!content.includes('CREATE TABLE IF NOT EXISTS tenants (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,')) {
    content = content.replace(/CREATE TABLE IF NOT EXISTS members \(\r?\n\s*id INTEGER PRIMARY KEY AUTOINCREMENT,/, 
`CREATE TABLE IF NOT EXISTS tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subdomain TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,`);
}

// Ensure active_sessions has tenant_id in sqlite block
content = content.replace(/CREATE TABLE IF NOT EXISTS active_sessions \(\r?\n\s*member_id INTEGER PRIMARY KEY,\r?\n\s*last_seen/,
`CREATE TABLE IF NOT EXISTS active_sessions (
        member_id INTEGER PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
        last_seen`);

fs.writeFileSync('src/db.ts', content, 'utf8');
