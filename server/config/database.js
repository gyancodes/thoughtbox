import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Create database connection
export const sql = neon(process.env.DATABASE_URL);

// Test database connection
export const testConnection = async () => {
  try {
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected successfully:', result[0].current_time);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  try {
    // Create notes table
    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'text',
        title TEXT DEFAULT '',
        content TEXT NOT NULL,
        color TEXT DEFAULT '#ffffff',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create index on user_id for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id)
    `;

    // Create index on created_at for sorting
    await sql`
      CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC)
    `;

    console.log('✅ Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
};