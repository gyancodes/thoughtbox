import { useState } from 'react';

const Documentation = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: '📋' },
    { id: 'features', title: 'Features', icon: '✨' },
    { id: 'setup', title: 'Setup Guide', icon: '🚀' },
    { id: 'appwrite', title: 'Appwrite Setup', icon: '☁️' },
    { id: 'database', title: 'Database Configuration', icon: '🗄️' },
    { id: 'security', title: 'Security & Encryption', icon: '🔒' },
    { id: 'offline', title: 'Offline Functionality', icon: '📱' },
    { id: 'api', title: 'API Reference', icon: '🔧' },
    { id: 'contributing', title: 'Contributing', icon: '🤝' },
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
              <p className="text-blue-100">Secure, encrypted note-taking with offline support</p>
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
              {activeSection === 'appwrite' && <AppwriteSection />}
              {activeSection === 'database' && <DatabaseSection />}
              {activeSection === 'security' && <SecuritySection />}
              {activeSection === 'offline' && <OfflineSection />}
              {activeSection === 'api' && <APISection />}
              {activeSection === 'contributing' && <ContributingSection />}
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
            <strong>Open Source Project:</strong> ThoughtBox is designed to be a community-driven, 
            secure note-taking application. We welcome contributions from developers worldwide!
          </p>
        </div>
      </div>
    </div>

    <p className="text-lg text-gray-600 mb-6">
      ThoughtBox is a modern, secure note-taking application built with React and powered by Appwrite. 
      It provides end-to-end encryption, offline functionality, and seamless synchronization across devices.
    </p>

    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">🔒 Security First</h3>
        <p className="text-gray-600">
          All notes are encrypted client-side using AES-256 encryption. Your data remains private 
          and secure, even from us.
        </p>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">📱 Offline Ready</h3>
        <p className="text-gray-600">
          Create and edit notes even without an internet connection. Changes sync automatically 
          when you're back online.
        </p>
      </div>
    </div>
  </div>
);

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
          <span className="text-2xl mr-3">🔒</span>
          End-to-End Encryption
        </h3>
        <p className="text-gray-600 mb-4">
          Your privacy is our priority. All notes are encrypted before leaving your device:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
            <strong>AES-256 Encryption:</strong> Military-grade encryption for all content
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
            <strong>Client-Side Keys:</strong> Encryption keys never leave your device
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
            <strong>Zero-Knowledge:</strong> Even we can't read your notes
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
{`# Appwrite Configuration
VITE_APPWRITE_PROJECT_ID="your-project-id"
VITE_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
VITE_APPWRITE_DATABASE_ID="your-database-id"
VITE_APPWRITE_NOTES_COLLECTION_ID="your-collection-id"`}
      </pre>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">4. Start Development Server</h3>
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

// Appwrite Section Component
const AppwriteSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Appwrite Setup</h2>
    
    <p className="text-lg text-gray-600 mb-6">
      Appwrite is the backend service that powers ThoughtBox. Follow these steps to set up your Appwrite project.
    </p>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Create Appwrite Account</h3>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <ol className="space-y-3">
        <li className="flex items-start">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
          <div>
            <p>Visit <a href="https://cloud.appwrite.io" className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">Appwrite Cloud</a></p>
            <p className="text-sm text-gray-600">Or set up a self-hosted instance if preferred</p>
          </div>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
          <div>
            <p>Sign up for a free account</p>
            <p className="text-sm text-gray-600">You can use GitHub, Google, or email signup</p>
          </div>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
          <div>
            <p>Verify your email address</p>
            <p className="text-sm text-gray-600">Check your inbox and click the verification link</p>
          </div>
        </li>
      </ol>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Create New Project</h3>
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <ol className="space-y-3">
        <li className="flex items-start">
          <span className="flex-shrink-0 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
          <div>
            <p><strong>Click "Create Project"</strong></p>
            <p className="text-sm text-gray-600">From your Appwrite dashboard</p>
          </div>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
          <div>
            <p><strong>Enter Project Details:</strong></p>
            <ul className="text-sm text-gray-600 mt-1 ml-4 space-y-1">
              <li>• Name: <code className="bg-gray-100 px-1 rounded">ThoughtBox</code></li>
              <li>• Project ID: <code className="bg-gray-100 px-1 rounded">thoughtbox</code> (or auto-generated)</li>
              <li>• Region: Choose closest to your users</li>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  </div>
);

// Database Section Component
const DatabaseSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Database Configuration</h2>
    
    <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            <strong>Critical:</strong> Proper database setup is essential for note storage and synchronization.
          </p>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Database</h3>
    <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4 mb-6">
      <li>Go to "Databases" section in your Appwrite project</li>
      <li>Click "Create Database"</li>
      <li>Name it <code className="bg-gray-100 px-2 py-1 rounded">thoughtbox-db</code></li>
      <li>Copy the Database ID to your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file</li>
    </ol>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Create Notes Collection</h3>
    <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4 mb-6">
      <li>Inside your database, click "Create Collection"</li>
      <li>Name it <code className="bg-gray-100 px-2 py-1 rounded">notes</code></li>
      <li>Copy the Collection ID to your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file</li>
    </ol>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Configure Collection Attributes</h3>
    <p className="text-gray-700 mb-3">Add these attributes to your notes collection:</p>
    
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Attribute Key</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Size</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Required</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr><td className="px-4 py-2 text-sm text-gray-900 font-mono">type</td><td className="px-4 py-2 text-sm text-gray-700">String</td><td className="px-4 py-2 text-sm text-gray-700">50</td><td className="px-4 py-2 text-sm text-gray-700">Yes</td></tr>
          <tr><td className="px-4 py-2 text-sm text-gray-900 font-mono">title</td><td className="px-4 py-2 text-sm text-gray-700">String</td><td className="px-4 py-2 text-sm text-gray-700">255</td><td className="px-4 py-2 text-sm text-gray-700">No</td></tr>
          <tr><td className="px-4 py-2 text-sm text-gray-900 font-mono">content</td><td className="px-4 py-2 text-sm text-gray-700">String</td><td className="px-4 py-2 text-sm text-gray-700">1000000</td><td className="px-4 py-2 text-sm text-gray-700">Yes</td></tr>
          <tr><td className="px-4 py-2 text-sm text-gray-900 font-mono">userId</td><td className="px-4 py-2 text-sm text-gray-700">String</td><td className="px-4 py-2 text-sm text-gray-700">50</td><td className="px-4 py-2 text-sm text-gray-700">Yes</td></tr>
          <tr><td className="px-4 py-2 text-sm text-gray-900 font-mono">createdAt</td><td className="px-4 py-2 text-sm text-gray-700">String</td><td className="px-4 py-2 text-sm text-gray-700">50</td><td className="px-4 py-2 text-sm text-gray-700">Yes</td></tr>
          <tr><td className="px-4 py-2 text-sm text-gray-900 font-mono">updatedAt</td><td className="px-4 py-2 text-sm text-gray-700">String</td><td className="px-4 py-2 text-sm text-gray-700">50</td><td className="px-4 py-2 text-sm text-gray-700">Yes</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

// Security Section Component
const SecuritySection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Security & Encryption</h2>
    
    <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            <strong>Zero-Knowledge Architecture:</strong> ThoughtBox uses client-side encryption to ensure your data remains private.
          </p>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Encryption Details</h3>
    <div className="space-y-4 mb-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">AES-256 Encryption</h4>
        <p className="text-sm text-gray-600">All note content is encrypted using AES-256 in CBC mode with PKCS7 padding.</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Key Derivation</h4>
        <p className="text-sm text-gray-600">Encryption keys are derived from user passwords using PBKDF2 with 10,000 iterations.</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Salt Generation</h4>
        <p className="text-sm text-gray-600">Each user gets a unique salt for key derivation, stored securely in the browser.</p>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Flow Security</h3>
    <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
      <li><strong>User Input:</strong> Plain text note content entered by user</li>
      <li><strong>Client-Side Encryption:</strong> Content encrypted using user's derived key</li>
      <li><strong>Local Storage:</strong> Encrypted content stored in browser's IndexedDB</li>
      <li><strong>Cloud Sync:</strong> Only encrypted content sent to Appwrite servers</li>
      <li><strong>Server Storage:</strong> Appwrite stores encrypted content without access to keys</li>
      <li><strong>Retrieval:</strong> Encrypted content downloaded and decrypted client-side</li>
    </ol>
  </div>
);

// Offline Section Component
const OfflineSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Offline Functionality</h2>
    
    <p className="text-lg text-gray-600 mb-6">
      ThoughtBox is designed to work seamlessly offline, ensuring you can always access and edit your notes.
    </p>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
    <div className="space-y-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">📱 Local Storage</h4>
        <p className="text-sm text-blue-800">All notes are stored locally using IndexedDB, providing fast access even when offline.</p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-900 mb-2">🔄 Automatic Sync</h4>
        <p className="text-sm text-green-800">When connection is restored, changes are automatically synced to the cloud.</p>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h4 className="font-medium text-purple-900 mb-2">⚡ Network Detection</h4>
        <p className="text-sm text-purple-800">The app monitors network status and shows indicators for online/offline state.</p>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Offline Features</h3>
    <ul className="space-y-2 text-gray-700 ml-4">
      <li>• Create new notes without internet connection</li>
      <li>• Edit existing notes offline</li>
      <li>• Delete notes (synced when online)</li>
      <li>• Search through locally stored notes</li>
      <li>• View offline change counter</li>
      <li>• Automatic conflict resolution</li>
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
        <p className="text-sm text-gray-600 mb-2">Creates a new encrypted note</p>
        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
          <pre>{`const { createNote } = useNotes();

const newNote = await createNote(
  'text',           // Note type
  'Note content',   // Note content (will be encrypted)
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
        <p className="text-sm text-gray-600 mb-2">Deletes a note</p>
        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
          <pre>{`const { deleteNote } = useNotes();

await deleteNote('note-id');`}</pre>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">AuthContext API</h3>
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">login(email, password)</h4>
        <p className="text-sm text-gray-600 mb-2">Authenticates user and sets up encryption</p>
        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
          <pre>{`const { login } = useAuth();

const user = await login('user@example.com', 'password');`}</pre>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">register(email, password, name)</h4>
        <p className="text-sm text-gray-600 mb-2">Creates new user account</p>
        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm">
          <pre>{`const { register } = useAuth();

const user = await register(
  'user@example.com',
  'password',
  'User Name'
);`}</pre>
        </div>
      </div>
    </div>
  </div>
);

// Contributing Section Component
const ContributingSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Contributing</h2>
    
    <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            <strong>Welcome Contributors!</strong> We're excited to have you contribute to ThoughtBox. Every contribution, big or small, is valuable.
          </p>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Contribute</h3>
    <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4 mb-6">
      <li><strong>Fork the repository</strong> on GitHub</li>
      <li><strong>Clone your fork</strong> locally</li>
      <li><strong>Create a new branch</strong> for your feature or bug fix</li>
      <li><strong>Make your changes</strong> and write tests</li>
      <li><strong>Ensure all tests pass</strong> and code follows our style guide</li>
      <li><strong>Commit your changes</strong> with a clear, descriptive message</li>
      <li><strong>Push to your fork</strong> and submit a pull request</li>
    </ol>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Development Setup</h3>
    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6">
      <pre className="text-sm">
{`# Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/thoughtbox.git
cd thoughtbox

# Install dependencies
npm install

# Create your feature branch
git checkout -b feature/amazing-feature

# Start development server
npm run dev`}
      </pre>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Areas for Contribution</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-2">🐛 Bug Fixes</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Fix reported issues</li>
          <li>• Improve error handling</li>
          <li>• Performance optimizations</li>
        </ul>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 mb-2">✨ New Features</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Note categories and tags</li>
          <li>• Export/import functionality</li>
          <li>• Advanced search filters</li>
        </ul>
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
        <h4 className="font-medium text-red-900 mb-2">❌ Authentication Failed (401)</h4>
        <p className="text-sm text-red-800 mb-2"><strong>Symptoms:</strong> Cannot create or sync notes, getting 401 errors</p>
        <p className="text-sm text-red-800 mb-2"><strong>Solutions:</strong></p>
        <ul className="text-sm text-red-700 ml-4 space-y-1">
          <li>• Verify your .env file has correct Appwrite credentials</li>
          <li>• Log out and log back in</li>
          <li>• Check Appwrite console for project settings</li>
        </ul>
      </div>
      
      <div className="border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">⚠️ Notes Not Syncing</h4>
        <p className="text-sm text-yellow-800 mb-2"><strong>Symptoms:</strong> Notes created offline don't sync when online</p>
        <p className="text-sm text-yellow-800 mb-2"><strong>Solutions:</strong></p>
        <ul className="text-sm text-yellow-700 ml-4 space-y-1">
          <li>• Check network connection</li>
          <li>• Verify Appwrite database and collection setup</li>
          <li>• Check browser console for sync errors</li>
          <li>• Try refreshing the page</li>
        </ul>
      </div>
      
      <div className="border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">ℹ️ Slow Performance</h4>
        <p className="text-sm text-blue-800 mb-2"><strong>Symptoms:</strong> App feels slow, especially with many notes</p>
        <p className="text-sm text-blue-800 mb-2"><strong>Solutions:</strong></p>
        <ul className="text-sm text-blue-700 ml-4 space-y-1">
          <li>• Clear browser cache and local storage</li>
          <li>• Check if you have too many notes (consider archiving old ones)</li>
          <li>• Ensure you're using a modern browser</li>
        </ul>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Getting Help</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">📖 Documentation</h4>
        <p className="text-sm text-blue-800">Check this documentation for detailed guides and API references.</p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2">🐛 Issues</h4>
        <p className="text-sm text-green-800">Report bugs or request features on our GitHub issues page.</p>
      </div>
    </div>
  </div>
);

export default Documentation;