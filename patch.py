import re
import sys

with open('src/backend.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add tId = (req as any).user.tenant_id; to every route
# We can match pp.(get|post|put|patch|delete)('/api/.*?',.*?async \\((_req|req), res\\) => \\{
def inject_tid(match):
    return match.group(0) + '\n    const tId = (req as any).user?.tenant_id;'

content = re.sub(r'app\.(get|post|put|patch|delete)\(''/api/.*?'',.*?async \((?:_req|req), res\) => \{', inject_tid, content)

# But wait, sometimes it's req, sometimes _req. 
# Also req might not be any, so (req as any).user?.tenant_id is safe.

# 2. Modify SELECT queries
# SELECT ... FROM table -> SELECT ... FROM table WHERE tenant_id = ?
# SELECT ... FROM table WHERE ... -> SELECT ... FROM table WHERE tenant_id = ? AND ...
# (Requires careful handling of ORDER BY, GROUP BY)

