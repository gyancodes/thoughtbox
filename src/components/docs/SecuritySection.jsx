const SecuritySection = () => (
  <div className="prose max-w-none">
    <h2 className="text-3xl font-bold text-gray-900 mb-6">Security & Encryption</h2>
    
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            <strong>Zero-Knowledge Architecture:</strong> ThoughtBox is designed so that even we cannot read your notes. All encryption happens on your device.
          </p>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Encryption Overview</h3>
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">🔐 AES-256 Encryption</h4>
        <p className="text-gray-600 mb-3">
          All note content is encrypted using AES-256-CBC, a military-grade encryption standard.
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 256-bit encryption keys</li>
          <li>• Cipher Block Chaining (CBC) mode</li>
          <li>• Random initialization vectors</li>
          <li>• PKCS#7 padding</li>
        </ul>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">🔑 Key Management</h4>
        <p className="text-gray-600 mb-3">
          Encryption keys are derived from your password and never leave your device.
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• PBKDF2 key derivation</li>
          <li>• 100,000 iterations</li>
          <li>• Random salt per user</li>
          <li>• Keys stored in memory only</li>
        </ul>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Security Model</h3>
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-green-900 mb-3">✅ What We Protect</h4>
        <ul className="space-y-2 text-green-800">
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Note content and titles are encrypted
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Encryption keys never leave your device
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Data is encrypted before network transmission
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Local storage is encrypted
          </li>
        </ul>
      </div>

      <div className="bg-yellow-50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-yellow-900 mb-3">⚠️ What's Not Encrypted</h4>
        <ul className="space-y-2 text-yellow-800">
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Note metadata (creation/update times, note type)
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            User email and account information
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Network traffic patterns and timing
          </li>
        </ul>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Encryption Process</h3>
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Flow Diagram</h4>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-32 bg-blue-100 text-blue-800 px-3 py-2 rounded text-center text-sm font-medium">
            Plain Text Note
          </div>
          <div className="text-gray-400">→</div>
          <div className="w-32 bg-green-100 text-green-800 px-3 py-2 rounded text-center text-sm font-medium">
            AES-256 Encrypt
          </div>
          <div className="text-gray-400">→</div>
          <div className="w-32 bg-purple-100 text-purple-800 px-3 py-2 rounded text-center text-sm font-medium">
            Encrypted Data
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="w-32 bg-purple-100 text-purple-800 px-3 py-2 rounded text-center text-sm font-medium">
            Encrypted Data
          </div>
          <div className="text-gray-400">→</div>
          <div className="w-32 bg-orange-100 text-orange-800 px-3 py-2 rounded text-center text-sm font-medium">
            Local Storage
          </div>
          <div className="text-gray-400">→</div>
          <div className="w-32 bg-red-100 text-red-800 px-3 py-2 rounded text-center text-sm font-medium">
            Cloud Sync
          </div>
        </div>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4">Implementation Details</h3>
    <div className="space-y-6">
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">Key Derivation</h4>
        <pre className="text-sm overflow-x-auto">
{`// Derive encryption key from password
const salt = CryptoJS.lib.WordArray.random(256/8);
const key = CryptoJS.PBKDF2(password, salt, {
  keySize: 256/32,
  iterations: 100000,
  hasher: CryptoJS.algo.SHA256
});`}
        </pre>
      </div>

      <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">Encryption</h4>
        <pre className="text-sm overflow-x-auto">
{`// Encrypt note content
const iv = CryptoJS.lib.WordArray.random(128/8);
const encrypted = CryptoJS.AES.encrypt(content, key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});`}
        </pre>
      </div>

      <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
        <h4 className="text-lg font-semibold mb-3">Decryption</h4>
        <pre className="text-sm overflow-x-auto">
{`// Decrypt note content
const decrypted = CryptoJS.AES.decrypt(encryptedContent, key, {
  iv: iv,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
});
const plaintext = decrypted.toString(CryptoJS.enc.Utf8);`}
        </pre>
      </div>
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Security Best Practices</h3>
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">For Users</h4>
        <ul className="space-y-2 text-gray-700">
          <li>• Use a strong, unique password</li>
          <li>• Enable two-factor authentication if available</li>
          <li>• Keep your browser updated</li>
          <li>• Log out on shared devices</li>
          <li>• Regularly backup your data</li>
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3">For Developers</h4>
        <ul className="space-y-2 text-gray-700">
          <li>• Never log encryption keys</li>
          <li>• Use secure random number generation</li>
          <li>• Implement proper key rotation</li>
          <li>• Regular security audits</li>
          <li>• Follow OWASP guidelines</li>
        </ul>
      </div>
    </div>

    <div className="bg-red-50 border-l-4 border-red-400 p-6 mt-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            <strong>Important:</strong> If you forget your password, your notes cannot be recovered. 
            The encryption is designed to be unbreakable, even by us.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default SecuritySection;