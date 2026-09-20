import fetch from 'node-fetch';

async function testLeavePatch() {
  try {
    const res = await fetch('http://localhost:3005/api/leaves/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'APPROVED',
        leave_type: 'Sick',
        start_date: '2026-10-01',
        end_date: '2026-10-02',
        notify_email: 0 // Simulating no reminder
      })
    });
    const text = await res.text();
    console.log('Response:', res.status, text);
  } catch (err) {
    console.error('Error:', err);
  }
}

testLeavePatch();
