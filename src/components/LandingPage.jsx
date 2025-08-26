import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import Documentation from './Documentation';

const LandingPage = () => {
  const [showDocumentation, setShowDocumentation] = useState(false);
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center hover-lift">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">ThoughtBox</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDocumentation(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Documentation
              </button>
              <SignInButton mode="modal">
                <button className="text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              End-to-end encrypted notes
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your thoughts,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              completely secure
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            ThoughtBox provides military-grade encryption for your notes, ensuring your private thoughts 
            stay private. Work offline, sync seamlessly, and never worry about data breaches.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <SignUpButton mode="modal">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Get Started Free</span>
              </button>
            </SignUpButton>
            
            <SignInButton mode="modal">
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center">
                Sign In
              </button>
            </SignInButton>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => setShowDocumentation(true)}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Documentation
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">End-to-End Encryption</h3>
            <p className="text-gray-600">
              Your notes are encrypted on your device before being stored. Even we can't read them.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Offline First</h3>
            <p className="text-gray-600">
              Create and edit notes without internet. Everything syncs automatically when you're back online.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
            <p className="text-gray-600">
              Built with modern React and optimized for performance. Your notes load instantly.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-24 text-center">
          <p className="text-gray-500 mb-8">Trusted by privacy-conscious users worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Open Source</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Zero Knowledge</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Cross Platform</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center hover-lift">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-medium text-gray-900">ThoughtBox</span>
            </div>
            <p className="text-gray-600 text-sm">© 2025 ThoughtBox. Your thoughts, secured.</p>
          </div>
        </div>
      </footer>

      {/* Documentation Modal */}
      {showDocumentation && (
        <Documentation onClose={() => setShowDocumentation(false)} />
      )}
    </div>
  );
};

export default LandingPage;