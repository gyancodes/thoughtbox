
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import './App.css';

// Main App component that uses the auth context
function AppContent() {
  const { user, loading, logout } = useAuth();

  const handleAuthSuccess = () => {
    // The AuthContext will automatically update the user state
    // No need to manually check auth here
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ThoughtBox</h2>
          <p className="text-gray-600">Loading your secure workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LandingPage onAuthSuccess={handleAuthSuccess} />
      )}
    </>
  );
}

// Root App component that provides the AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
