import { AsyncLocalStorage } from 'async_hooks';

export const tenantStorage = new AsyncLocalStorage<number>();

function injectTenant(originalSql: string, originalParams: any[]): { sql: string; params: any[] } {
  const tId = tenantStorage.getStore();
  // If no tenant context, or query explicitly handles tenant_id, skip.
  if (!tId || originalSql.toLowerCase().includes('tenant_id') || originalSql.toLowerCase().includes('tenants')) {
    return { sql: originalSql, params: originalParams };
  }

  let sql = originalSql;
  let params = [...originalParams];

  if (/^\s*SELECT\b/i.test(sql)) {
    if (/\bWHERE\b/i.test(sql)) {
      sql = sql.replace(/\bWHERE\b/i, 'WHERE tenant_id = ? AND');
      params.unshift(tId);
    } else {
      const match = sql.match(/\b(ORDER BY|GROUP BY|LIMIT)\b/i);
      if (match) {
        sql = sql.replace(match[0], \WHERE tenant_id = ? \\);
        // Find how many ? are before the match
        const beforeMatch = sql.substring(0, sql.search(/\b(ORDER BY|GROUP BY|LIMIT)\b/i));
        const qCount = (beforeMatch.match(/\?/g) || []).length;
        params.splice(qCount, 0, tId);
      } else {
        sql = \\ WHERE tenant_id = ?\;
        params.push(tId);
      }
    }
  } else if (/^\s*UPDATE\b/i.test(sql)) {
    if (/\bWHERE\b/i.test(sql)) {
      const beforeWhere = sql.substring(0, sql.search(/\bWHERE\b/i));
      const qCount = (beforeWhere.match(/\?/g) || []).length;
      sql = sql.replace(/\bWHERE\b/i, 'WHERE tenant_id = ? AND');
      params.splice(qCount, 0, tId);
    } else {
      sql = \\ WHERE tenant_id = ?\;
      params.push(tId);
    }
  } else if (/^\s*DELETE\b/i.test(sql)) {
    if (/\bWHERE\b/i.test(sql)) {
      sql = sql.replace(/\bWHERE\b/i, 'WHERE tenant_id = ? AND');
      params.unshift(tId);
    } else {
      sql = \\ WHERE tenant_id = ?\;
      params.push(tId);
    }
  } else if (/^\s*INSERT\b/i.test(sql)) {
    // INSERT INTO table (cols) VALUES (vals)
    // Avoid replacing SELECTs inside INSERTs for now by just replacing the first parens
    sql = sql.replace(/\((.*?)\)/, '(tenant_id, )');
    sql = sql.replace(/VALUES\s*\((.*?)\)/i, 'VALUES (?, )');
    params.unshift(tId);
  }
  
  return { sql, params };
}
