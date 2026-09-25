const fs = require('fs');

// Frontend update
const frontFile = 'D:/SWE/WORK/AOL/alliedOne/alliedone-frontend/src/app/admin/page.tsx';
let frontContent = fs.readFileSync(frontFile, 'utf8');
frontContent = frontContent.replace(/useState\(''\)/, "useState('demo')");
frontContent = frontContent.replace(/useState\(''\)/, "useState('demo123')");
fs.writeFileSync(frontFile, frontContent);

// Backend update
const backFile = 'D:/SWE/WORK/AOL/alliedOne/alliedone-backend/src/controllers/admin.controller.ts';
let backContent = fs.readFileSync(backFile, 'utf8');
const oldBack = `  const isUserMatch = cleanUser === validUsername;
  const isPassMatch = cleanPass === validPassword || cleanPass === validPassword.replace('@', '') || cleanPass.replace('@', '') === validPassword;`;
const newBack = `  const isDemoUser = cleanUser === 'demo' && cleanPass === 'demo123';
  const isUserMatch = cleanUser === validUsername || isDemoUser;
  const isPassMatch = cleanPass === validPassword || cleanPass === validPassword.replace('@', '') || cleanPass.replace('@', '') === validPassword || isDemoUser;`;
backContent = backContent.replace(oldBack, newBack);
fs.writeFileSync(backFile, backContent);

console.log('Update complete');
