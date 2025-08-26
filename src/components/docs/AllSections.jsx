// Offline Section Component
export const OfflineSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Offline Functionality</h2>
    
    <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
      <div className="flex">
        <div className="flex-sn't be limited by internet connectivity.
    </p>

    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Offline-First Design:</strong> ThoughtBox stores all your notes locally and syncs 
            with the cloud when available. You can create, edit, and organize notes without an internet connection.
          </p>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
    
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-xl mr-2">💾</span>
          Local Storage
        </h4>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>• All notes stored in browser's IndexedDB</li>
          <li>• Encrypted locally for security</li>
          <li>• Instant access without network</li>
          <li>• Persistent across browser sessions</li>
        </ul>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-xl mr-2">🔄</span>
          Smart Sync
        </h4>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>• Automatic sync when online</li>
          <li>• Conflict resolution for simultaneous edits</li>
          <li>• Retry failed operations</li>
          <li>• Background synchronization</li>
        </ul>
      </div>
    </div>

    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h4 className="font-semibold text-green-800 mb-3">✅ What Works Offline</h4>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <h5 className="font-medium text-green-900 mb-2">Create & Edit</h5>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Text notes</li>
            <li>• Todo lists</li>
            <li>• Timetables</li>
            <li>• All note types</li>
          </ul>
        </div>
        <div>
          <h5 className="font-medium text-green-900 mb-2">Organize</h5>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Search notes</li>
            <li>• Delete notes</li>
            <li>• Update titles</li>
            <li>• Manage content</li>
          </ul>
        </div>
        <div>
          <h5 className="font-medium text-green-900 mb-2">Security</h5>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Encryption</li>
            <li>• Local storage</li>
            <li>• Privacy protection</li>
            <li>• Secure access</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// API Section Component
export const APISection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">API Reference</h2>
    
    <p className="text-lg text-gray-600 mb-6">
      ThoughtBox provides a clean API for managing notes programmatically. 
      This reference covers the main components and their usage.
    </p>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">NotesContext API</h3>
    
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Usage</h4>
      <div className="bg-gray-900 text-gray-100 rounded p-4 mb-4">
        <pre className="text-sm">
{`import { useNotes } from './contexts/NotesContext';

function MyComponent() {
  const {
    notes,
    createNote,
    updateNote,
    deleteNote,
    isOnline,
    syncStatus
  } = useNotes();
  
  // Your component logic here
}`}
        </pre>
      </div>
    </div>

    <h4 className="text-xl font-semibold text-gray-900 mb-4">Core Methods</h4>
    
    <div className="space-y-6 mb-8">
      <div className="border border-gray-200 rounded-lg p-6">
        <h5 className="text-lg font-semibold text-gray-900 mb-3">createNote(type, content, title)</h5>
        <p className="text-gray-600 mb-3">Creates a new note with the specified type and content.</p>
        <div className="bg-gray-900 text-gray-100 rounded p-4 mb-3">
          <pre className="text-sm">
{`// Create a text note
const note = await createNote('text', {
  text: 'My note content'
}, 'My Note Title');

// Create a todo list
const todo = await createNote('todo', {
  items: [
    { id: '1', text: 'Task 1', completed: false },
    { id: '2', text: 'Task 2', completed: true }
  ]
}, 'My Todo List');`}
          </pre>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6">
        <h5 className="text-lg font-semibold text-gray-900 mb-3">updateNote(noteId, updates)</h5>
        <p className="text-gray-600 mb-3">Updates an existing note with new data.</p>
        <div className="bg-gray-900 text-gray-100 rounded p-4 mb-3">
          <pre className="text-sm">
{`// Update note content
await updateNote('note-id', {
  title: 'Updated Title',
  content: { text: 'Updated content' }
});`}
          </pre>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Note Data Structure</h3>
    
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-3">Base Note Object</h4>
      <div className="bg-gray-900 text-gray-100 rounded p-4">
        <pre className="text-sm">
{`{
  id: "unique-note-id",
  type: "text" | "todo" | "timetable",
  title: "Note Title",
  content: { /* type-specific content */ },
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  userId: "user-id",
  syncStatus: "synced" | "pending" | "error" | "conflict"
}`}
        </pre>
      </div>
    </div>
  </div>
);

// Contributing Section Component  
export const ContributingSection = () => (
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
            <strong>Welcome Contributors!</strong> ThoughtBox is an open source project that welcomes 
            contributions from developers of all skill levels. Every contribution helps make the project better.
          </p>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Ways to Contribute</h3>
    
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-xl mr-2">🐛</span>
          Bug Reports
        </h4>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>• Report issues you encounter</li>
          <li>• Provide detailed reproduction steps</li>
          <li>• Include browser and OS information</li>
          <li>• Suggest potential solutions</li>
        </ul>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-xl mr-2">💻</span>
          Code Contributions
        </h4>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>• Fix bugs and implement features</li>
          <li>• Improve performance and security</li>
          <li>• Add tests and documentation</li>
          <li>• Refactor and optimize code</li>
        </ul>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h3>
    
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <ol className="space-y-3">
        <li className="flex items-start">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
          <div>
            <p><strong>Fork the Repository</strong></p>
            <p className="text-sm text-gray-600">Create your own copy of the project on GitHub</p>
          </div>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
          <div>
            <p><strong>Clone Your Fork</strong></p>
            <div className="bg-gray-900 text-gray-100 rounded p-2 mt-2">
              <code className="text-sm">git clone https://github.com/your-username/thoughtbox.git</code>
            </div>
          </div>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
          <div>
            <p><strong>Create a Branch</strong></p>
            <div className="bg-gray-900 text-gray-100 rounded p-2 mt-2">
              <code className="text-sm">git checkout -b feature/your-feature-name</code>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </div>
);

// Troubleshooting Section Component
export const TroubleshootingSection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Troubleshooting</h2>
    
    <p className="text-lg text-gray-600 mb-6">
      Common issues and their solutions to help you get ThoughtBox running smoothly.
    </p>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Setup Issues</h3>
    
    <div className="space-y-6 mb-8">
      <div className="border border-red-200 rounded-lg p-6 bg-red-50">
        <h4 className="text-lg font-semibold text-red-800 mb-3">❌ "Missing environment variables" Error</h4>
        <p className="text-red-700 mb-3">
          This error occurs when required Appwrite configuration is missing.
        </p>
        <div className="bg-red-100 rounded p-3 mb-3">
          <p className="text-sm text-red-800 font-mono">
            Error: Missing required environment variables: VITE_APPWRITE_PROJECT_ID
          </p>
        </div>
        <div className="text-sm text-red-700">
          <strong>Solution:</strong>
          <ol className="mt-2 ml-4 space-y-1">
            <li>1. Check that your <code>.env</code> file exists in the project root</li>
            <li>2. Verify all required variables are set</li>
            <li>3. Restart your development server after making changes</li>
          </ol>
        </div>
      </div>

      <div className="border border-yellow-200 rounded-lg p-6 bg-yellow-50">
        <h4 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ "Database not configured" Message</h4>
        <p className="text-yellow-700 mb-3">
          The app works but notes don't sync to the cloud.
        </p>
        <div className="text-sm text-yellow-700">
          <strong>Solution:</strong>
          <ol className="mt-2 ml-4 space-y-1">
            <li>1. Set up database and collection in Appwrite console</li>
            <li>2. Add database configuration to your environment variables</li>
            <li>3. Restart the development server</li>
          </ol>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentication Issues</h3>
    
    <div className="space-y-6 mb-8">
      <div className="border border-red-200 rounded-lg p-6 bg-red-50">
        <h4 className="text-lg font-semibold text-red-800 mb-3">🔒 "401 Unauthorized" Errors</h4>
        <p className="text-red-700 mb-3">
          User authentication fails or expires during sync operations.
        </p>
        <div className="text-sm text-red-700">
          <strong>Solutions:</strong>
          <ol className="mt-2 ml-4 space-y-1">
            <li>1. Check Platform Configuration in Appwrite console</li>
            <li>2. Try logging out and back in</li>
            <li>3. Clear browser data and cookies</li>
            <li>4. Verify CORS settings in Appwrite</li>
          </ol>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Getting Help</h3>
    
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">🆘 Support Channels</h4>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>• <strong>GitHub Issues:</strong> Bug reports and feature requests</li>
          <li>• <strong>Discussions:</strong> Community Q&A and help</li>
          <li>• <strong>Discord:</strong> Real-time community support</li>
          <li>• <strong>Documentation:</strong> Comprehensive guides</li>
        </ul>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">📋 When Reporting Issues</h4>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>• Include browser and OS version</li>
          <li>• Provide steps to reproduce the issue</li>
          <li>• Share relevant console error messages</li>
          <li>• Mention if it works in incognito mode</li>
        </ul>
      </div>
    </div>
  </div>
);