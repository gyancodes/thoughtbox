import { Client, Account, Databases } from 'appwrite';

// Validate required environment variables
const requiredEnvVars = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID
};

// Optional environment variables for database features
const optionalEnvVars = {
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  notesCollectionId: import.meta.env.VITE_APPWRITE_NOTES_COLLECTION_ID
};

// Check if all required environment variables are present
const missingRequiredVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `VITE_APPWRITE_${key.toUpperCase()}`);

if (missingRequiredVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingRequiredVars.join(', ')}. ` +
    'Please check your .env file and ensure all Appwrite configuration is set.'
  );
}

export const client = new Client();

client
    .setEndpoint(requiredEnvVars.endpoint)
    .setProject(requiredEnvVars.projectId);

export const account = new Account(client);
export const databases = new Databases(client);

// Export configuration for use in other modules
export const appwriteConfig = {
  databaseId: optionalEnvVars.databaseId,
  notesCollectionId: optionalEnvVars.notesCollectionId,
  hasDatabaseConfig: !!(optionalEnvVars.databaseId && optionalEnvVars.notesCollectionId)
};

export { ID } from 'appwrite';
