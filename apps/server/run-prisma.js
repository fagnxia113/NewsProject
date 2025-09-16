require('dotenv').config({ path: '.env.local' });
const { execSync } = require('child_process');

console.log('Running Prisma DB push...');
execSync('npx prisma db push', { stdio: 'inherit' });