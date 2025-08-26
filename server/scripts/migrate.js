import { initializeDatabase, testConnection } from '../config/database.js';

async function migrate() {
  console.log('🔄 Starting database migration...');
  
  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot connect to database. Please check your DATABASE_URL.');
    process.exit(1);
  }

  // Initialize database tables
  const initialized = await initializeDatabase();
  if (!initialized) {
    console.error('❌ Database migration failed.');
    process.exit(1);
  }

  console.log('✅ Database migration completed successfully!');
  process.exit(0);
}

migrate().catch((error) => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});