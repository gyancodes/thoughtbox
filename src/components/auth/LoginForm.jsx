import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const LoginForm = ({ onSuccess, onToggleMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  
  const { login, loading, error: authError, clearError, isAuthenticated } = useAuth();

  // Clear errors when component mounts or when switching between forms
  useEffect(() => {
    setLocalError("");
    clearError();
  }, [clearError]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated && onSuccess) {
      onSuccess();
    }
  }, [isAuthenticated, onSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    // Client-side validation
    if (!email.trim()) {
      setLocalError("Email is required");
      return;
    }

    if (!password.trim()) {
      setLocalError("Password is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long");
      return;
    }

    try {
      await login(email.trim(), password);
      // Success is handled by the useEffect above
    } catch (err) {
      // Error is handled by the AuthContext and displayed below
      console.error("Login error:", err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 card-hover">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-900 mb-3">
            Welcome back
          </h2>
          <p className="text-gray-600 text-sm">Sign in to your secure notes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors bg-gray-50 focus:bg-white input-focus enhanced-focus"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-colors bg-gray-50 focus:bg-white input-focus enhanced-focus"
              placeholder="Enter your password"
            />
          </div>

          {(localError || authError) && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{localError || authError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-xl transition-colors focus:ring-2 focus:ring-black focus:ring-offset-2 btn-primary enhanced-focus"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              onClick={onToggleMode}
              className="text-black hover:text-gray-700 font-medium transition-colors hover-lift"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
