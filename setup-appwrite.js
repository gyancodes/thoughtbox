#!/usr/bin/env node

/**
 * Setup script to switch ThoughtBox back from Clerk to Appwrite authentication
 * This script will restore Appwrite-based authentication
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Switching back to Appwrite authentication for ThoughtBox...\n');

// File mappings for the switch back
const fileMappings = [
  {
    from: 'src/App-appwrite.jsx',
    to: 'src/App.jsx',
    description: 'Restoring Appwrite App component'
  },
  {
    from: 'src/main-appwrite.jsx',
    to: 'src/main.jsx',
    description: 'Restoring Appwrite main file'
  },
  {
    from: 'src/components/LandingPage-appwrite.jsx',
    to: 'src/components/LandingPage.jsx',
    description: 'Restoring Appwrite LandingPage'
  },
  {
    from: 'src/components/Dashboard-appwrite.jsx',
    to: 'src/components/Dashboard.jsx',
    description: 'Restoring Appwrite Dashboard'
  },
  {
    from: 'src/contexts/NotesContext-appwrite.jsx',
    to: 'src/contexts/NotesContext.jsx',
    description: 'Restoring Appwrite NotesContext'
  }
];

// Function to move file
function moveFile(source, destination, description) {
  try {
    if (fs.existsSync(source)) {
      // Backup current file first
      if (fs.existsSync(destination)) {
        const backupName = destination.replace('.jsx', '-clerk.jsx');
        fs.renameSync(destination, backupName);
      }
      
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
console.log('📁 Switching files back to Appwrite...\n');

let successCount = 0;
let totalOperations = fileMappings.length;

fileMappings.forEach(mapping => {
  if (moveFile(mapping.from, mapping.to, mapping.description)) {
    successCount++;
  }
});

console.log(`\n📊 Operations completed: ${successCount}/${totalOperations}\n`);

console.log('🎉 Appwrite setup restored!\n');

console.log('📋 Next steps:');
console.log('1. Make sure your Appwrite project is configured');
console.log('2. Update your .env file with correct Appwrite credentials');
console.log('3. Run: npm run dev');
console.log('\n🔐 Your app now uses Appwrite for authentication again!');
console.log('\n📚 Need help? Check the documentation at /docs in your app.');