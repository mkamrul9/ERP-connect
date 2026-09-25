const fs = require('fs');
let content = fs.readFileSync('src/backend.ts', 'utf8');

const tIdInject = \n    const tId = (req as any).user?.tenant_id;;

// members
content = content.replace(
  pp.get('/api/members', async (_req, res) => {,
  pp.get('/api/members', async (req, res) => {
);
content = content.replace(
  SELECT id, name, email, role, avatar_color, created_at FROM members ORDER BY name,
  SELECT id, name, email, role, avatar_color, created_at FROM members WHERE tenant_id = ? ORDER BY name\, [tId]
);

content = content.replace(
  pp.post('/api/members', requireRole('Admin'), async (req, res) => {,
  pp.post('/api/members', requireRole('Admin'), async (req, res) => {
);
content = content.replace(
  INSERT INTO members(name, email, role, avatar_color, password_hash) VALUES (?, ?, ?, ?, ?),
  INSERT INTO members(tenant_id, name, email, role, avatar_color, password_hash) VALUES (?, ?, ?, ?, ?, ?)\,\n      [tId, name, email || '', role || 'Employee', color, pwdHash]
);
content = content.replace(
  [name, email || '', role || 'Employee', color, pwdHash],,
  `
);

// I can just replace the whole members block easily. Let's do members, tasks, and attendance first.
