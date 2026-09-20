const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./erp.db');
db.run("UPDATE members SET role='Admin', email='admin@erp-connect.com' WHERE name='Jane Doe'");
db.run("DELETE FROM members WHERE name='System Admin'");
console.log('done');
