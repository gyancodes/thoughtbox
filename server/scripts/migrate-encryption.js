import { sql } from '../config/database.js';
import { encryptNote } from '../utils/encryption.js';

async function migrateToEncryption() {
  console.log('🔄 Starting encryption migration...');
  
  try {
    // First, alter the table to change content from JSONB to TEXT
    console.log('📝 Updating table schema...');
    await sql`
      ALTER TABLE notes 
      ALTER COLUMN content TYPE TEXT USING content::text
    `;
    
    // Get all existing notes
    console.log('📋 Fetching existing notes...');
    const existingNotes = await sql`
      SELECT * FROM notes
    `;
    
    console.log(`Found ${existingNotes.length} notes to encrypt`);
    
    // Encrypt each note
    for (const note of existingNotes) {
      try {
        // Parse content if it's JSON string
        let content;
        try {
          content = typeof note.content === 'string' ? JSON.parse(note.content) : note.content;
        } catch {
          content = note.content;
        }
        
        // Create note object for encryption
        const noteToEncrypt = {
          title: note.title,
          content: content
        };
        
        // Encrypt the note
        const encryptedNote = encryptNote(noteToEncrypt);
        
        // Update the note in database
        await sql`
          UPDATE notes 
          SET 
            title = ${encryptedNote.title},
            content = ${encryptedNote.content}
          WHERE id = ${note.id}
        `;
        
        console.log(`✅ Encrypted note: ${note.id}`);
      } catch (error) {
        console.error(`❌ Failed to encrypt note ${note.id}:`, error);
      }
    }
    
    console.log('✅ Encryption migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration
migrateToEncryption()
  .then(() => {
    console.log('🎉 Migration completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });