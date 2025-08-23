import { useState } from 'react';
import { account, appwriteConfig } from '../lib/appwrite';

const Dashboard = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await account.deleteSession('current');
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center hover-lift">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-lg font-medium text-gray-900">ThoughtBox</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover-lift">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-sm text-gray-700 font-medium">{user?.name || 'User'}</span>
              </div>
              
              <button
                onClick={handleLogout}
                disabled={loading}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors hover-lift"
                title="Sign out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="mb-12 hero-content">
          <h2 className="text-3xl font-light text-gray-900 mb-3 leading-tight text-balance">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}!
          </h2>
          <p className="text-gray-600 text-lg">Ready to capture your thoughts securely?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-200 group hover:border-gray-200 card-hover">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors hover-lift">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 text-lg mb-1">New Text Note</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Quick thoughts and ideas</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-200 group hover:border-gray-200 card-hover">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors hover-lift">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 text-lg mb-1">Todo List</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Track your tasks</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-200 group hover:border-gray-200 card-hover">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors hover-lift">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-medium text-gray-900 text-lg mb-1">Timetable</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Schedule your day</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Notes Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 card-hover">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-medium text-gray-900">Recent Notes</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors hover-lift">
              View all
            </button>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 hover-lift">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            {appwriteConfig.hasDatabaseConfig ? (
              <>
                <h4 className="text-xl font-medium text-gray-900 mb-3">No notes yet</h4>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed max-w-md mx-auto text-balance">
                  Create your first encrypted note to get started with secure note-taking
                </p>
                <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium transition-colors btn-primary">
                  Create Note
                </button>
              </>
            ) : (
              <>
                <h4 className="text-xl font-medium text-gray-900 mb-3">Database not configured</h4>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed max-w-lg mx-auto text-balance">
                  To store notes, you need to set up a database in Appwrite.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-left max-w-lg mx-auto card-hover">
                  <h5 className="font-medium text-blue-900 mb-3 text-lg">Quick Setup:</h5>
                  <ol className="text-sm text-blue-800 space-y-2 leading-relaxed">
                    <li className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs font-medium flex-shrink-0">1</span>
                      <span>Create a database in your Appwrite console</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs font-medium flex-shrink-0">2</span>
                      <span>Create a "notes" collection</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 text-xs font-medium flex-shrink-0">3</span>
                      <span>Add the IDs to your .env file</span>
                    </li>
                  </ol>
                  <p className="text-xs text-blue-600 mt-4 font-medium">
                    See SETUP.md for detailed instructions
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;