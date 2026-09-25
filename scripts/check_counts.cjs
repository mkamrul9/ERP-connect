const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('erp.db');
const tables = ['attendance', 'leave_requests', 'expenses'];
tables.forEach(t => {
  db.get('SELECT COUNT(*) as c FROM ' + t, (err, row) => {
    if (!err) console.log(t + ': ' + row.c);
    else console.log(t + ': error');
  });
});
