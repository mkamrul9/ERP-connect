import { initDB, dbRun, dbGet, dbAll } from '../src/db.js';

async function seed() {
  await initDB();
  console.log('Seeding dummy data...');

  const members = await dbAll('SELECT id FROM members');
  if (members.length === 0) {
    console.log('No members found. Run app first to create default members.');
    return;
  }

  const memberIds = members.map((m: any) => m.id);
  const randomMember = () => memberIds[Math.floor(Math.random() * memberIds.length)];

  const categories = await dbAll('SELECT id FROM expense_categories');
  const catIds = categories.map((c: any) => c.id);
  const randomCategory = () => catIds[Math.floor(Math.random() * catIds.length)];

  // Seed Attendance (past 30 days)
  console.log('Seeding Attendance...');
  for (let i = 0; i < 100; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    // In
    date.setHours(9, Math.floor(Math.random() * 30), 0);
    await dbRun('INSERT INTO attendance (member_id, action_type, timestamp) VALUES (?, ?, ?)', 
      [randomMember(), 'IN', date.toISOString()]);
      
    // Out
    date.setHours(17, Math.floor(Math.random() * 60), 0);
    await dbRun('INSERT INTO attendance (member_id, action_type, timestamp) VALUES (?, ?, ?)', 
      [randomMember(), 'OUT', date.toISOString()]);
  }

  // Seed Tasks
  console.log('Seeding Tasks...');
  const taskTitles = ['Prepare monthly report', 'Client meeting follow-up', 'Update server infrastructure', 'Code review', 'Design UI mockups'];
  for (let i = 0; i < 30; i++) {
    const title = taskTitles[Math.floor(Math.random() * taskTitles.length)] + ' ' + i;
    const dateStr = new Date(Date.now() + (Math.random() * 10 - 5) * 86400000).toISOString().split('T')[0];
    const status = Math.random() > 0.5 ? 'DONE' : 'PENDING';
    const priority = ['GREEN', 'ORANGE', 'RED'][Math.floor(Math.random() * 3)];
    await dbRun('INSERT INTO tasks (title, description, task_date, priority, status, assigned_to) VALUES (?, ?, ?, ?, ?, ?)',
      [title, 'Dummy description for task', dateStr, priority, status, randomMember()]);
  }

  // Seed Leave Requests
  console.log('Seeding Leave Requests...');
  for (let i = 0; i < 15; i++) {
    const type = ['ANNUAL', 'SICK', 'CASUAL'][Math.floor(Math.random() * 3)];
    const status = ['PENDING', 'APPROVED', 'REJECTED'][Math.floor(Math.random() * 3)];
    const sd = new Date();
    sd.setDate(sd.getDate() + Math.floor(Math.random() * 20));
    const ed = new Date(sd);
    ed.setDate(ed.getDate() + Math.floor(Math.random() * 5) + 1);
    
    await dbRun('INSERT INTO leave_requests (member_id, leave_type, start_date, end_date, status, reason) VALUES (?, ?, ?, ?, ?, ?)',
      [randomMember(), type, sd.toISOString().split('T')[0], ed.toISOString().split('T')[0], status, 'Need some time off']);
  }

  // Seed Expenses
  console.log('Seeding Expenses...');
  for (let i = 0; i < 40; i++) {
    const amount = Math.floor(Math.random() * 5000) + 500;
    const dateStr = new Date(Date.now() - Math.random() * 30 * 86400000).toISOString().split('T')[0];
    await dbRun('INSERT INTO expenses (category_id, amount, company_name, expense_head, description, entered_by, expense_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [randomCategory(), amount, 'Supplier Co', 'Misc Head', 'Purchased items', randomMember(), dateStr]);
  }

  // Seed Credentials
  console.log('Seeding Credentials...');
  for (let i = 0; i < 10; i++) {
    const name = 'Service Account ' + i;
    const exp = new Date(Date.now() + Math.random() * 100 * 86400000).toISOString().split('T')[0];
    await dbRun('INSERT INTO credentials (name, cred_type, url, username, cost, expiry_date) VALUES (?, ?, ?, ?, ?, ?)',
      [name, 'API_KEY', 'https://api.example.com', 'admin_user_' + i, Math.floor(Math.random() * 100), exp]);
  }

  // Seed Meetings
  console.log('Seeding Meetings...');
  for (let i = 0; i < 20; i++) {
    const date = new Date(Date.now() + (Math.random() * 14 - 7) * 86400000);
    await dbRun('INSERT INTO meetings (title, contact_name, scheduled_at) VALUES (?, ?, ?)',
      ['Project Sync ' + i, 'Client ' + i, date.toISOString()]);
  }

  // Seed Tenders
  console.log('Seeding Tenders...');
  for (let i = 0; i < 15; i++) {
    const pub = new Date(Date.now() - Math.random() * 30 * 86400000).toISOString().split('T')[0];
    const sub = new Date(Date.now() + Math.random() * 30 * 86400000).toISOString().split('T')[0];
    const val = Math.floor(Math.random() * 1000000) + 10000;
    const status = ['UPCOMING', 'SUBMITTED', 'WON', 'LOST'][Math.floor(Math.random() * 4)];
    await dbRun('INSERT INTO tenders (title, organization, published_date, submission_deadline, estimated_value, status, assigned_to) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['Tender ' + i, 'Org ' + i, pub, sub, val, status, randomMember()]);
  }

  console.log('Done seeding dummy data!');
}

seed().catch(console.error);
