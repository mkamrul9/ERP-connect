const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project();
const sourceFile = project.addSourceFileAtPath('../src/backend.ts');

const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

let modifiedCount = 0;

for (const callExpr of callExpressions) {
    const expr = callExpr.getExpression();
    if (expr.getKind() === SyntaxKind.Identifier) {
        const name = expr.getText();
        if (name === 'dbRun' || name === 'dbGet' || name === 'dbAll') {
            const args = callExpr.getArguments();
            if (args.length > 0) {
                const sqlArg = args[0];
                let sqlText = sqlArg.getText();
                
                // Only process template literals or string literals
                if (sqlArg.getKind() === SyntaxKind.NoSubstitutionTemplateLiteral || 
                    sqlArg.getKind() === SyntaxKind.StringLiteral ||
                    sqlArg.getKind() === SyntaxKind.TemplateExpression) {
                    
                    // Simple regexes for SQL modification
                    // INSERT INTO table (...) VALUES (...) -> INSERT INTO table (tenant_id, ...) VALUES (?, ...)
                    if (/INSERT\s+INTO\s+(\w+)\s*\((.*?)\)\s*VALUES\s*\((.*?)\)/i.test(sqlText)) {
                        sqlText = sqlText.replace(/INSERT\s+INTO\s+(\w+)\s*\((.*?)\)\s*VALUES\s*\((.*?)\)/i, (match, table, cols, vals) => {
                            if (cols.includes('tenant_id')) return match; // already handled
                            return `INSERT INTO ${table} (tenant_id, ${cols}) VALUES (?, ${vals})`;
                        });
                    }
                    
                    // UPDATE table SET ... WHERE ... -> UPDATE table SET ... WHERE tenant_id = ? AND ...
                    else if (/UPDATE\s+(\w+)\s+SET\s+(.*?)\s+WHERE\s+(.*)/i.test(sqlText)) {
                        sqlText = sqlText.replace(/UPDATE\s+(\w+)\s+SET\s+(.*?)\s+WHERE\s+(.*)/i, (match, table, set, where) => {
                            if (where.includes('tenant_id')) return match;
                            return `UPDATE ${table} SET ${set} WHERE tenant_id = ? AND ${where}`;
                        });
                    }

                    // DELETE FROM table WHERE ... -> DELETE FROM table WHERE tenant_id = ? AND ...
                    else if (/DELETE\s+FROM\s+(\w+)\s+WHERE\s+(.*)/i.test(sqlText)) {
                        sqlText = sqlText.replace(/DELETE\s+FROM\s+(\w+)\s+WHERE\s+(.*)/i, (match, table, where) => {
                            if (where.includes('tenant_id')) return match;
                            return `DELETE FROM ${table} WHERE tenant_id = ? AND ${where}`;
                        });
                    }

                    // SELECT ... FROM table WHERE ... -> SELECT ... FROM table WHERE tenant_id = ? AND ...
                    else if (/SELECT\s+(.*?)\s+FROM\s+(\w+)\s+WHERE\s+(.*?)(ORDER BY|GROUP BY|LIMIT|$)/i.test(sqlText)) {
                        sqlText = sqlText.replace(/SELECT\s+(.*?)\s+FROM\s+(\w+)\s+WHERE\s+(.*?)(ORDER BY|GROUP BY|LIMIT|$)/i, (match, sel, table, where, rest) => {
                            if (where.includes('tenant_id')) return match;
                            return `SELECT ${sel} FROM ${table} WHERE tenant_id = ? AND ${where}${rest}`;
                        });
                    }

                    // SELECT ... FROM table -> SELECT ... FROM table WHERE tenant_id = ?
                    else if (/SELECT\s+(.*?)\s+FROM\s+(\w+)\s*(ORDER BY|GROUP BY|LIMIT|$)/i.test(sqlText) && !sqlText.includes('WHERE')) {
                        sqlText = sqlText.replace(/SELECT\s+(.*?)\s+FROM\s+(\w+)\s*(ORDER BY|GROUP BY|LIMIT|$)/i, (match, sel, table, rest) => {
                            return `SELECT ${sel} FROM ${table} WHERE tenant_id = ? ${rest}`;
                        });
                    }

                    if (sqlText !== sqlArg.getText()) {
                        sqlArg.replaceWithText(sqlText);
                        
                        // Now append tId to the params array, or create one if it doesn't exist
                        if (args.length === 1) {
                            callExpr.addArgument('[tId]');
                        } else {
                            const paramsArg = args[1];
                            if (paramsArg.getKind() === SyntaxKind.ArrayLiteralExpression) {
                                const elements = paramsArg.getElements();
                                if (/SELECT|UPDATE|DELETE/i.test(sqlText)) {
                                    // tenant_id = ? is injected first (for SELECT/DELETE) or after SET (for UPDATE wait, SET doesn't use ? for tenant_id)
                                    // Wait! UPDATE table SET a = ? WHERE tenant_id = ? AND b = ?
                                    // In UPDATE, SET bindings come before WHERE bindings! 
                                    // So we can't just unshift tId!
                                }
                            }
                        }
                        modifiedCount++;
                    }
                }
            }
        }
    }
}

sourceFile.saveSync();
console.log(`Modified ${modifiedCount} SQL queries.`);
