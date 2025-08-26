#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Setting up ThoughtBox Backend...\n');

// Check if we're in the right directory
if (!existsSync('server/package.json')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

try {
  // Step 1: Install server dependencies
  console.log('📦 Installing server dependencies...');
  execSync('npm install', { cwd: 'server', stdio: 'inherit' });
  console.log('✅ Server dependencies installed\n');

  // Step 2: Copy environment file if it doesn't exist
  const envPath = join('server', '.env');
  const envExamplePath = join('server', '.env.example');
  
  if (!existsSync(envPath)) {
    console.log('📝 Creating environment file...');
    copyFileSync(envExamplePath, envPath);
    console.log('✅ Environment file created at server/.env\n');
  } else {
    console.log('📝 Environment file already exists\n');
  }

  // Step 3: Instructions
  console.log('🎉 Backend setup complete!\n');
  console.log('📋 Next steps:');
  console.log('1. Update server/.env with your actual database and Clerk credentials');
  console.log('2. Run: cd server && npm run db:migrate');
  console.log('3. Run: cd server && npm run dev');
  console.log('');
  console.log('🔗 Get your credentials:');
  console.log('• Neon Database: https://console.neon.tech/');
  console.log('• Clerk Secret Key: https://dashboard.clerk.com/');
  console.log('');
  console.log('📚 See server/README.md for detailed setup instructions');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}