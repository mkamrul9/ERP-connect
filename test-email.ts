import { resolveMemberNotificationEmails } from './src/brevo.js';

async function test() {
  const emails = await resolveMemberNotificationEmails('Kamrul Islam');
  console.log('Resolved emails for Kamrul Islam:', emails);
}

test().catch(console.error);
