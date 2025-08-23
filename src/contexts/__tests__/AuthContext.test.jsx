import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { appwriteService } from '../../lib/appwrite';

// Mock the appwrite service
vi.mock('../../lib/appwrite', () => ({
  appwriteService: {
    getCurrentUser: vi.fn(),
    authenticate: vi.fn(),
    logout: vi.fn()
  },
  AuthenticationError: class AuthenticationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AuthenticationError';
    }
  },
  NetworkError: class NetworkError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NetworkError';
    }
  }
}));

// Test component to access auth context
const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="user">{auth.user ? auth.user.email : 'null'}</div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="authenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="error">{auth.error || 'null'}</div>
      <button onClick={() => auth.login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={() => auth.logout()}>Logout</button>
      <button onClick={() => auth.clearError()}>Clear Error</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    // Clear window.encryptionKey if it exists
    delete window.encryptionKey;
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should provide auth context to children', () => {
    appwriteService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('should throw error when useAuth is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });

  it('should initialize with loading state and check authentication', async () => {
    const mockUser = { $id: '123', email: 'test@example.com' };
    appwriteService.getCurrentUser.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially loading should be true
    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    // Wait for auth check to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
  });

  it('should handle authentication failure during initialization', async () => {
    appwriteService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('null');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('should handle successful login', async () => {
    const mockUser = { $id: '123', email: 'test@example.com' };
    appwriteService.getCurrentUser
      .mockRejectedValueOnce(new Error('Not authenticated')) // Initial check
      .mockResolvedValue(mockUser); // After login
    appwriteService.authenticate.mockResolvedValue({ sessionId: 'session123' });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial auth check
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Perform login
    await act(async () => {
      try {
        screen.getByText('Login').click();
      } catch (error) {
        // Expected error, ignore
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    expect(appwriteService.authenticate).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should handle login failure', async () => {
    appwriteService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));
    appwriteService.authenticate.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    await act(async () => {
      try {
        screen.getByText('Login').click();
      } catch (error) {
        // Expected error, ignore
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('should handle logout and clear sensitive data', async () => {
    const mockUser = { $id: '123', email: 'test@example.com' };
    
    // Set up some sensitive data
    localStorage.setItem('encryptionKey', 'sensitive-key');
    sessionStorage.setItem('userKey', 'user-key');
    window.encryptionKey = 'memory-key';

    appwriteService.getCurrentUser.mockResolvedValue(mockUser);
    appwriteService.logout.mockResolvedValue();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for initial auth
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Perform logout
    await act(async () => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user')).toHaveTextContent('null');
    });

    // Verify sensitive data was cleared
    expect(localStorage.getItem('encryptionKey')).toBeNull();
    expect(sessionStorage.getItem('userKey')).toBeNull();
    expect(window.encryptionKey).toBeUndefined();
  });

  it('should clear sensitive data even if logout fails', async () => {
    const mockUser = { $id: '123', email: 'test@example.com' };
    
    // Set up some sensitive data
    localStorage.setItem('encryptionKey', 'sensitive-key');
    window.encryptionKey = 'memory-key';

    appwriteService.getCurrentUser.mockResolvedValue(mockUser);
    appwriteService.logout.mockRejectedValue(new Error('Network error'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    await act(async () => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });

    // Verify sensitive data was still cleared despite logout failure
    expect(localStorage.getItem('encryptionKey')).toBeNull();
    expect(window.encryptionKey).toBeUndefined();
  });

  it('should clear error state', async () => {
    appwriteService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));
    appwriteService.authenticate.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    // Trigger an error
    await act(async () => {
      try {
        screen.getByText('Login').click();
      } catch (error) {
        // Expected error, ignore
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).not.toHaveTextContent('null');
    });

    // Clear the error
    await act(async () => {
      screen.getByText('Clear Error').click();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });

  it('should handle session expiry monitoring', async () => {
    vi.useFakeTimers();
    
    const mockUser = { $id: '123', email: 'test@example.com' };
    appwriteService.getCurrentUser.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Fast forward time to simulate session expiry (15+ minutes)
    await act(async () => {
      vi.advanceTimersByTime(16 * 60 * 1000); // 16 minutes
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('error')).toHaveTextContent('Session expired. Please log in again.');
    });

    vi.useRealTimers();
  }, 10000); // Increase timeout for this test
});