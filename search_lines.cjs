const fs = require('fs');
const lines = fs.readFileSync('src/backend.ts', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes("app.post('/api/auth/login'")) console.log('Login:', i + 1);
  if (l.includes("jwt.verify(")) console.log('JWT:', i + 1);
});
