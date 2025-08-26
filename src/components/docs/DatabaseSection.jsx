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
    <div className="space-y-4">
      <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
        <li>Navigate to your Appwrite project dashboard</li>
        <li>Click on "Databases" in the left sidebar</li>
        <li>Click "Create Database"</li>
        <li>Enter database name: <code className="bg-gray-100 px-2 py-1 rounded">thoughtbox-db</code></li>
        <li>Copy the Database ID and add it to your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file</li>
      </ol>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Create Notes Collection</h3>
    <div className="space-y-4">
      <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
        <li>Inside your database, click "Create Collection"</li>
        <li>Enter collection name: <code className="bg-gray-100 px-2 py-1 rounded">notes</code></li>
        <li>Copy the Collection ID and add it to your <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file</li>
      </ol>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Configure Collection Attributes</h3>
    <p className="text-gray-600 mb-4">Add these attributes to your notes collection:</p>
    
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Attribute Key</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Size</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Required</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Default</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-3 text-sm font-mono text-gray-900">type</td>
            <td className="px-4 py-3 text-sm text-gray-700">String</td>
            <td className="px-4 py-3 text-sm text-gray-700">50</td>
            <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
            <td className="px-4 py-3 text-sm text-gray-700">-</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm font-mono text-gray-900">title</td>
            <td className="px-4 py-3 text-sm text-gray-700">String</td>
            <td className="px-4 py-3 text-sm text-gray-700">255</td>
            <td className="px-4 py-3 text-sm text-gray-700">No</td>
            <td className="px-4 py-3 text-sm text-gray-700">-</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm font-mono text-gray-900">content</td>
            <td className="px-4 py-3 text-sm text-gray-700">String</td>
            <td className="px-4 py-3 text-sm text-gray-700">1000000</td>
            <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
            <td className="px-4 py-3 text-sm text-gray-700">-</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm font-mono text-gray-900">userId</td>
            <td className="px-4 py-3 text-sm text-gray-700">String</td>
            <td className="px-4 py-3 text-sm text-gray-700">50</td>
            <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
            <td className="px-4 py-3 text-sm text-gray-700">-</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm font-mono text-gray-900">createdAt</td>
            <td className="px-4 py-3 text-sm text-gray-700">String</td>
            <td className="px-4 py-3 text-sm text-gray-700">50</td>
            <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
            <td className="px-4 py-3 text-sm text-gray-700">-</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm font-mono text-gray-900">updatedAt</td>
            <td className="px-4 py-3 text-sm text-gray-700">String</td>
            <td className="px-4 py-3 text-sm text-gray-700">50</td>
            <td className="px-4 py-3 text-sm text-gray-700">Yes</td>
            <td className="px-4 py-3 text-sm text-gray-700">-</td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm font-mono text-gray-900">syncStatus</td>
            <td className="px-4 py-3 text-sm text-gray-700">String</td>
            <td className="px-4 py-3 text-sm text-gray-700">20</td>
            <td className="px-4 py-3 text-sm text-gray-700">No</td>
            <td className="px-4 py-3 text-sm text-gray-700">synced</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Configure Permissions</h3>
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Security Critical:</strong> Proper permissions ensure users can only access their own notes.
          </p>
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900">Collection Permissions:</h4>
      <ul className="space-y-2 text-gray-700 ml-4">
        <li>• <strong>Create:</strong> <code className="bg-gray-100 px-2 py-1 rounded">users</code> (any authenticated user)</li>
        <li>• <strong>Read:</strong> <code className="bg-gray-100 px-2 py-1 rounded">user:[USER_ID]</code> (document owner only)</li>
        <li>• <strong>Update:</strong> <code className="bg-gray-100 px-2 py-1 rounded">user:[USER_ID]</code> (document owner only)</li>
        <li>• <strong>Delete:</strong> <code className="bg-gray-100 px-2 py-1 rounded">user:[USER_ID]</code> (document owner only)</li>
      </ul>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Create Indexes (Optional)</h3>
    <p className="text-gray-600 mb-4">For better performance, create these indexes:</p>
    
    <div className="space-y-3">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900">userId_index</h4>
        <p className="text-sm text-gray-600">Type: Key, Attributes: userId (ASC)</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900">updatedAt_index</h4>
        <p className="text-sm text-gray-600">Type: Key, Attributes: updatedAt (DESC)</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900">user_updated_compound</h4>
        <p className="text-sm text-gray-600">Type: Key, Attributes: userId (ASC), updatedAt (DESC)</p>
      </div>
    </div>

    <div className="bg-green-50 border-l-4 border-green-400 p-6 mt-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            <strong>Complete!</strong> Your database is now configured. Update your .env file with the Database ID and Collection ID, then restart your development server.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default DatabaseSection;