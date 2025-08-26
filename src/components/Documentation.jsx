import { useState } from 'react';

const Documentation = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'features', title: 'Features', icon: '✨' },
    { id: 'setup', title: 'Setup Guide', icon: '🚀' },
    { id: 'database', title: 'Database Configuration', icon: '🗄️' },
    { id: 'api', title: 'API Reference', icon: '🔧' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: '🔍' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">ThoughtBox Documentation</h1>
              <p className="text-blue-100">Secure note-taking with PostgreSQL and Clerk</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <nav className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Table of Contents
              </h3>
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{section.icon}</span>
                      <span>{section.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8">
              {activeSection === 'overview' && <OverviewSection setActiveSection={setActiveSection} />}
              {activeSection === 'features' && <FeaturesSection />}
              {activeSection === 'setup' && <SetupSection />}
              {activeSection === 'database' && <DatabaseSection />}
              {activeSection === 'api' && <APISection />}
              {activeSection === 'troubleshooting' && <TroubleshootingSection />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Section Component
const OverviewSection = ({ setActiveSection }) => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to ThoughtBox</h2>
    
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Modern Stack:</strong> ThoughtBox uses React, PostgreSQL/Neon, and Clerk for a secure, scalable note-taking experience.
          </p>
        </div>
      </div>
    </div>

    <p className="text-lg text-gray-600 mb-6">
      ThoughtBox is a modern, secure note-taking application built with React and powered by PostgreSQL/Neon DB. 
      It provides secure authentication with Clerk and seamless synchronization across devices.
    </p>

    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">🔒 Secure Authentication</h3>
        <p className="text-gray-600">
          Powered by Clerk for robust user authentication and session management with enterprise-grade security.
        </p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">🗄️ PostgreSQL Database</h3>
        <p className="text-gray-600">
          Reliable data storage with PostgreSQL hosted on Neon for scalability and performance.
        </p>
      </div>
    </div>

    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-green-900 mb-3">🚀 Quick Start</h3>
      <p className="text-green-800 mb-3">Ready to get started? Follow these steps:</p>
      <ol className="text-green-700 space-y-1">
        <li>1. <button onClick={() => setActiveSection('setup')} className="text-green-600 hover:text-green-800 underline">Set up your development environment</button></li>
        <li>2. <button onClick={() => setActiveSection('database')} className="text-green-600 hover:text-green-800 underline">Configure your PostgreSQL database</button></li>
        <li>3. Set up Clerk authentication</li>
        <li>4. Start building your notes!</li>
      </ol>
    </div>
  </div>
);

export default Documentation;

// Features Section Component
const FeaturesSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Features</h2>
    
    <div className="grid gap-8">
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-3">📝</span>
          Multiple Note Types
        </h3>
        <p className="text-gray-600 mb-4">
          ThoughtBox supports different types of notes to match your workflow:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            <strong>Text Notes:</strong> Rich text editing for general note-taking
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
            <strong>Todo Lists:</strong> Interactive checklists with progress tracking
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            <strong>Timetables:</strong> Schedule management with time-based entries
          </li>
        </ul>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-3">🔐</span>
          Secure Authentication
        </h3>
        <p className="text-gray-600 mb-4">
          Built-in security features powered by Clerk:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            <strong>Multi-factor Authentication:</strong> Optional 2FA for enhanced security
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            <strong>Social Login:</strong> Sign in with Google, GitHub, and more
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
            <strong>Session Management:</strong> Secure session handling and token refresh
          </li>
        </ul>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <span className="text-2xl mr-3">🔍</span>
          Search & Organization
        </h3>
        <p className="text-gray-600 mb-4">
          Find your notes quickly with powerful search:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            <strong>Full-text Search:</strong> Search through titles and content
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            <strong>Real-time Filtering:</strong> Instant results as you type
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
            <strong>Type Filtering:</strong> Filter by note type (text, todo, timetable)
          </li>
        </ul>
      </div>
    </div>
  </div>
);

// Setup Section Component
const SetupSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Setup Guide</h2>
    
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Prerequisites:</strong> Make sure you have Node.js 18+ and npm installed on your system.
          </p>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Clone the Repository</h3>
    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6">
      <pre className="text-sm">
{`# Using HTTPS
git clone https://github.com/your-username/thoughtbox.git

# Navigate to project directory
cd thoughtbox`}
      </pre>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Install Dependencies</h3>
    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6">
      <pre className="text-sm">
{`# Install all dependencies
npm install`}
      </pre>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Environment Configuration</h3>
    <p className="text-gray-600 mb-4">
      Create a <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file in the root directory:
    </p>
    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6">
      <pre className="text-sm">
{`# Clerk Configuration (Authentication)
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key_here"

# API Configuration (Postgres/Neon Database)
VITE_API_BASE_URL="http://localhost:3001/api"

# App Configuration
VITE_APP_NAME="ThoughtBox"
VITE_APP_VERSION="1.0.0"`}
      </pre>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Set Up Clerk Authentication</h3>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <ol className="space-y-2 text-blue-800">
        <li>1. Visit <a href="https://clerk.com" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Clerk.com</a> and create an account</li>
        <li>2. Create a new application</li>
        <li>3. Copy your publishable key to the .env file</li>
        <li>4. Configure your sign-in/sign-up settings in the Clerk dashboard</li>
      </ol>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">5. Start Development Server</h3>
    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6">
      <pre className="text-sm">
{`# Start the development server
npm run dev

# The application will be available at:
# http://localhost:5173`}
      </pre>
    </div>
  </div>
);

// Database Section Component
const DatabaseSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Database Configuration</h2>
    
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>PostgreSQL with Neon:</strong> ThoughtBox uses PostgreSQL hosted on Neon for reliable, scalable data storage.
          </p>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Create Neon Account</h3>
    <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4 mb-6">
      <li>Visit <a href="https://neon.tech" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Neon.tech</a></li>
      <li>Sign up for a free account</li>
      <li>Create a new project</li>
      <li>Copy your database connection string</li>
    </ol>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Database Schema</h3>
    <p className="text-gray-700 mb-3">The backend API will create the following table structure:</p>
    
    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6">
      <pre className="text-sm">
{`CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);`}
      </pre>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Backend API Setup</h3>
    <p className="text-gray-700 mb-3">You'll need to set up a backend API server that connects to your Neon database:</p>
    
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <p className="text-sm text-yellow-800">
        <strong>Note:</strong> The backend API is not included in this frontend repository. 
        You'll need to create a separate Node.js/Express server or use your preferred backend framework.
      </p>
    </div>

    <h4 className="text-lg font-semibold text-gray-900 mb-3">Required API Endpoints:</h4>
    <ul className="space-y-2 text-gray-700 ml-4">
      <li>• <code className="bg-gray-100 px-2 py-1 rounded">GET /api/notes</code> - Fetch user's notes</li>
      <li>• <code className="bg-gray-100 px-2 py-1 rounded">POST /api/notes</code> - Create new note</li>
      <li>• <code className="bg-gray-100 px-2 py-1 rounded">PUT /api/notes/:id</code> - Update note</li>
      <li>• <code className="bg-gray-100 px-2 py-1 rounded">DELETE /api/notes/:id</code> - Delete note</li>
    </ul>
  </div>
);

// API Section Component
const APISection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">API Reference</h2>
    
    <h3 className="text-2xl font-bold text-gray-900 mb-4">NotesContext API</h3>
    <div className="space-y-4 mb-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">createNote(type, content, title)</h4>
        <p className="text-sm text-gray-600 mb-2">Creates a new note and saves it to the database</p>
        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
          <pre>{`const { createNote } = useNotes();

const newNote = await createNote(
  'text',           // Note type: 'text', 'todo', 'timetable'
  'Note content',   // Note content
  'Note Title'      // Optional title
);`}</pre>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">updateNote(noteId, updates)</h4>
        <p className="text-sm text-gray-600 mb-2">Updates an existing note</p>
        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
          <pre>{`const { updateNote } = useNotes();

const updatedNote = await updateNote('note-id', {
  title: 'Updated Title',
  content: 'Updated content'
});`}</pre>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">deleteNote(noteId)</h4>
        <p className="text-sm text-gray-600 mb-2">Deletes a note from the database</p>
        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
          <pre>{`const { deleteNote } = useNotes();

await deleteNote('note-id');`}</pre>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">ClerkAuthContext API</h3>
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">user</h4>
        <p className="text-sm text-gray-600 mb-2">Current authenticated user object from Clerk</p>
        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
          <pre>{`const { user } = useClerkAuth();

if (user) {
  console.log('User ID:', user.id);
  console.log('Email:', user.primaryEmailAddress?.emailAddress);
}`}</pre>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">isLoading</h4>
        <p className="text-sm text-gray-600 mb-2">Boolean indicating if authentication is still loading</p>
        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
          <pre>{`const { isLoading } = useClerkAuth();

if (isLoading) {
  return <div>Loading...</div>;
}`}</pre>
        </div>
      </div>
    </div>
  </div>
);

// Troubleshooting Section Component
const TroubleshootingSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Troubleshooting</h2>
    
    <h3 className="text-2xl font-bold text-gray-900 mb-4">Common Issues</h3>
    
    <div className="space-y-4 mb-6">
      <div className="border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-2">❌ Authentication Failed</h4>
        <p className="text-sm text-red-800 mb-2"><strong>Symptoms:</strong> Cannot sign in, getting authentication errors</p>
        <p className="text-sm text-red-800 mb-2"><strong>Solutions:</strong></p>
        <ul className="text-sm text-red-700 ml-4 space-y-1">
          <li>• Verify your Clerk publishable key in .env file</li>
          <li>• Check Clerk dashboard for application settings</li>
          <li>• Ensure your domain is added to Clerk's allowed origins</li>
          <li>• Clear browser cache and cookies</li>
        </ul>
      </div>

      <div className="border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ API Connection Failed</h4>
        <p className="text-sm text-yellow-800 mb-2"><strong>Symptoms:</strong> Cannot create, update, or fetch notes</p>
        <p className="text-sm text-yellow-800 mb-2"><strong>Solutions:</strong></p>
        <ul className="text-sm text-yellow-700 ml-4 space-y-1">
          <li>• Check if your backend API server is running</li>
          <li>• Verify VITE_API_BASE_URL in .env file</li>
          <li>• Check network connection</li>
          <li>• Verify database connection in backend</li>
        </ul>
      </div>

      <div className="border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">ℹ️ Notes Not Loading</h4>
        <p className="text-sm text-blue-800 mb-2"><strong>Symptoms:</strong> Empty notes list, loading indefinitely</p>
        <p className="text-sm text-blue-800 mb-2"><strong>Solutions:</strong></p>
        <ul className="text-sm text-blue-700 ml-4 space-y-1">
          <li>• Check browser console for error messages</li>
          <li>• Verify user authentication status</li>
          <li>• Check backend API logs</li>
          <li>• Ensure database table exists and has correct schema</li>
        </ul>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Getting Help</h3>
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <p className="text-gray-700 mb-4">
        If you're still experiencing issues, here are some resources:
      </p>
      <ul className="space-y-2 text-gray-700">
        <li>• Check the browser console for detailed error messages</li>
        <li>• Review the network tab in developer tools for API errors</li>
        <li>• Consult the <a href="https://clerk.com/docs" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Clerk documentation</a></li>
        <li>• Check the <a href="https://neon.tech/docs" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Neon documentation</a></li>
      </ul>
    </div>
  </div>
);