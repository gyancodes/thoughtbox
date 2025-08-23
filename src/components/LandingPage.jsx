import { useState } from 'react';
import { LoginForm, SignupForm } from './auth';
import { testAppwriteConnection } from '../utils/authTest';

const LandingPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [testResult, setTestResult] = useState(null);

  const toggleMode = () => setIsLogin(!isLogin);

  const handleTestConnection = async () => {
    console.log('Testing Appwrite connection...');
    const result = await testAppwriteConnection();
    setTestResult(result);
    console.log('Test result:', result);
  };

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
              <span className="text-xl font-semibold text-gray-900">ThoughtBox</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Features</a>
              <a href="#security" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">Security</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">About</a>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center py-16 lg:py-24">
          {/* Left Column - Content */}
          <div className="space-y-10 hero-content">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-light text-gray-900 leading-[1.1] tracking-tight text-balance">
                Your thoughts,
                <br />
                <span className="font-medium">encrypted</span> and
                <br />
                <span className="font-medium">secure</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Create, organize, and sync your notes across all devices with military-grade encryption. 
                Your privacy is our priority.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4 feature-item">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 hover-lift">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">End-to-End Encryption</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Your notes are encrypted before leaving your device</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 feature-item">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 hover-lift">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Real-time Sync</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Access your notes from anywhere, anytime</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 feature-item">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 hover-lift">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Multiple Note Types</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Text notes, todo lists, and timetables</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 feature-item">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 hover-lift">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Offline Ready</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Work without internet, sync when connected</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">Zero-knowledge architecture</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">Open source</span>
              </div>
            </div>
          </div>

          {/* Right Column - Auth Form */}
          <div className="lg:pl-8">
            {/* Test Connection Button */}
            <div className="mb-6">
              <button
                onClick={handleTestConnection}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors text-sm border border-gray-200 hover-lift"
              >
                🔍 Test Appwrite Connection
              </button>
              {testResult && (
                <div className={`mt-3 p-3 rounded-lg text-sm ${
                  testResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {testResult.success ? '✅' : '❌'} {testResult.message || testResult.error}
                </div>
              )}
            </div>

            {isLogin ? (
              <LoginForm onSuccess={onAuthSuccess} onToggleMode={toggleMode} />
            ) : (
              <SignupForm onSuccess={onAuthSuccess} onToggleMode={toggleMode} />
            )}
          </div>
        </div>

        {/* Security Section */}
        <section id="security" className="py-20 lg:py-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 leading-tight text-balance">
              Security you can trust
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We use industry-standard encryption to ensure your notes remain private and secure
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center card-hover">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-lift">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">AES-256 Encryption</h3>
              <p className="text-gray-600 leading-relaxed">Military-grade encryption protects your data with the same standards used by governments</p>
            </div>

            <div className="text-center card-hover">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-lift">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Zero Knowledge</h3>
              <p className="text-gray-600 leading-relaxed">We can't read your notes even if we wanted to. Your encryption keys never leave your device</p>
            </div>

            <div className="text-center card-hover">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 hover-lift">
                <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">Open Source</h3>
              <p className="text-gray-600 leading-relaxed">Our code is transparent and auditable. Security through transparency, not obscurity</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
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
    </div>
  );
};

export default LandingPage;