const fs = require('fs');
let content = fs.readFileSync('src/db.ts', 'utf8');

// Strip whatsapp and telegram columns from PG schema
content = content.replace(/\\s*whatsapp_number TEXT DEFAULT '',/g, '');
content = content.replace(/\\s*telegram_chat_id TEXT DEFAULT '',/g, '');
content = content.replace(/\\s*notify_telegram INTEGER DEFAULT 0,/g, '');

// Strip whatsapp and telegram columns from SQLite schema
content = content.replace(/\\s*try \\{ await pgPool\\.query\\("ALTER TABLE [a-zA-Z_]+ ADD COLUMN IF NOT EXISTS (whatsapp_number|telegram_chat_id|notify_telegram).*?"\\); \\} catch \\(e\\) \\{\\}\\r?\\n/g, '');
content = content.replace(/\\s*try \\{ await sqliteDb\\.exec\\("ALTER TABLE [a-zA-Z_]+ ADD COLUMN (whatsapp_number|telegram_chat_id|notify_telegram).*?"\\); \\} catch \\(e\\) \\{\\}\\r?\\n/g, '');

fs.writeFileSync('src/db.ts', content, 'utf8');
