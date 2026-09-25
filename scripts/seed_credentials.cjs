const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('erp.db');

db.serialize(() => {
  // Let's first check if credentials table exists and print its columns,
  // Or just insert some dummy credentials.
  const stmt = db.prepare(`
    INSERT INTO credentials 
    (name, cred_type, url, username, expiry_date, last_changed_date, notify_email, reminder_days) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run('AWS Production Root', 'Cloud', 'https://aws.amazon.com', 'admin@company.com', '2027-01-01', '2024-01-01', 1, 30);
  stmt.run('Stripe Dashboard', 'Finance', 'https://dashboard.stripe.com', 'finance@company.com', '2028-05-15', '2023-11-20', 1, 7);
  stmt.run('Google Workspace Admin', 'IT', 'https://admin.google.com', 'it@company.com', '2026-10-10', '2024-02-14', 1, 14);
  stmt.run('Mailchimp Marketing', 'Marketing', 'https://mailchimp.com', 'marketing@company.com', null, '2024-03-01', 0, null);
  stmt.run('Github Organization', 'DevOps', 'https://github.com/company', 'devops@company.com', null, '2024-05-22', 0, null);
  
  stmt.finalize();
  console.log('Dummy credentials added!');
});

db.close();
