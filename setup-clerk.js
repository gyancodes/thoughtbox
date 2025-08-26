#!/usr/bin/env node

/**
 * Setup script to switch ThoughtBox from Appwrite to Clerk authentication
 * This script will backup current files and switch to Clerk-based authentication
 */

import fs from 'fs';
import path from 'path';

console.log('🔄 Setting up Clerk authentication for ThoughtBox...\n');

// File mappings for the switch
const fileMappings = [
  {
    from: 'src/App.jsx',
    to: 'src/App-appwrite.jsx',
    description: 'Backing up Appwrite App component'
  },
  {
    from: 'src/App-clerk.jsx',
    to: 'src/App.jsx',
    description: 'Switching to Clerk App component'
  },
  {
    from: 'src/main.jsx',
    to: 'src/main-appwrite.jsx',
    description: 'Backing up Appwrite main file'
  },
  {
    from: 'src/main-clerk.jsx',
    to: 'src/main.jsx',
    description: 'Switching to Clerk main file'
  },
  {
    from: 'src/components/LandingPage.jsx',
    to: 'src/components/LandingPage-appwrite.jsx',
    description: 'Backing up Appwrite LandingPage'
  },
  {
    from: 'src/components/LandingPage-clerk.jsx',
    to: 'src/components/LandingPage.jsx',
    description: 'Switching to Clerk LandingPage'
  },
  {
    from: 'src/components/Dashboard.jsx',
    to: 'src/components/Dashboard-appwrite.jsx',
    description: 'Backing up Appwrite Dashboard'
  },
  {
    from: 'src/components/Dashboard-clerk.jsx',
    to: 'src/components/Dashboard.jsx',
    description: 'Switching to Clerk Dashboard'
  },
  {
    from: 'src/contexts/NotesContext.jsx',
    to: 'src/contexts/NotesContext-appwrite.jsx',
    description: 'Backing up Appwrite NotesContext'
  },
  {
    from: 'src/contexts/NotesContext-clerk.jsx',
    to: 'src/contexts/NotesContext.jsx',
    description: 'Switching to Clerk NotesContext'
  }
];

// Function to copy file
function copyFile(source, destination, description) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
      console.log(`✅ ${description}`);
      return true;
    } else {
      console.log(`⚠️  ${description} - Source file not found: ${source}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - Error: ${error.message}`);
    return false;
  }
}

// Function to move file
function moveFile(source, destination, description) {
  try {
    if (fs.existsSync(source)) {
      fs.renameSync(source, destination);
      console.log(`✅ ${description}`);
      return true;
    } else {
      console.log(`⚠️  ${description} - Source file not found: ${source}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - Error: ${error.message}`);
    return false;
  }
}

// Perform the file operations
console.log('📁 Switching files...\n');

let successCount = 0;
let totalOperations = fileMappings.length;

fileMappings.forEach(mapping => {
  // First backup the original if it exists and backup doesn't exist
  if (fs.existsSync(mapping.to) && !fs.existsSync(mapping.to.replace('-clerk', '-appwrite'))) {
    // This is a backup operation
    if (copyFile(mapping.from, mapping.to, mapping.description)) {
      successCount++;
    }
  } else {
    // This is a switch operation
    if (moveFile(mapping.from, mapping.to, mapping.description)) {
      successCount++;
    }
  }
});

console.log(`\n📊 Operations completed: ${successCount}/${totalOperations}\n`);

// Update package.json scripts if needed
console.log('📝 Checking package.json...');
try {
  const packageJsonPath = 'package.json';
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add Clerk-specific scripts if they don't exist
    if (!packageJson.scripts['setup:clerk']) {
      packageJson.scripts['setup:clerk'] = 'node setup-clerk.js';
      packageJson.scripts['setup:appwrite'] = 'node setup-appwrite.js';
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Added setup scripts to package.json');
    } else {
      console.log('✅ Setup scripts already exist in package.json');
    }
  }
} catch (error) {
  console.log(`⚠️  Could not update package.json: ${error.message}`);
}

console.log('\n🎉 Clerk setup complete!\n');

console.log('📋 Next steps:');
console.log('1. Sign up for Clerk at https://clerk.com');
console.log('2. Create a new application in your Clerk dashboard');
console.log('3. Copy your Publishable Key from the Clerk dashboard');
console.log('4. Update your .env file with: VITE_CLERK_PUBLISHABLE_KEY="your-key-here"');
console.log('5. Enable Google OAuth in your Clerk dashboard (optional)');
console.log('6. Run: npm run dev');
console.log('\n🔐 Your app now uses Clerk for authentication with Google sign-in support!');
console.log('\n📚 Need help? Check the documentation at /docs in your app.');