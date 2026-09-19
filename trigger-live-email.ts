async function testEmail() {
  try {
    // 1. Get members
    console.log('Fetching members from live app...');
    const membersRes = await fetch('https://aol-erp-bot-8tpe.onrender.com/api/members');
    const members = await membersRes.json();
    
    // Find Kamrul
    const kamrul = members.find((m: any) => m.name.toLowerCase().includes('kamrul'));
    if (!kamrul) {
      console.log('Kamrul not found in live database!');
      return;
    }
    console.log('Found Kamrul, ID:', kamrul.id);

    // 2. Create a test task assigned to Kamrul
    console.log('Sending a test task to trigger email...');
    const taskPayload = {
      title: 'TEST EMAIL NOTIFICATION',
      description: 'This is a test to verify Brevo is working from Render.',
      dueDate: '2026-10-01',
      dueTime: '12:00',
      assignees: [String(kamrul.id)]
    };

    const taskRes = await fetch('https://aol-erp-bot-8tpe.onrender.com/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskPayload)
    });

    const taskResult = await taskRes.json();
    console.log('Task creation response:', taskRes.status, taskResult);
    
    if (taskRes.ok) {
      console.log('✅ Test task created on live app! Brevo should be sending the email to kamrulmdislam19@gmail.com right now.');
    } else {
      console.log('❌ Failed to create task on live app.');
    }

  } catch (err) {
    console.error('Error testing live app:', err);
  }
}

testEmail();
