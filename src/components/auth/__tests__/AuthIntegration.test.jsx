import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from '../../../contexts/AuthContext';
import LoginForm from '../LoginForm';
import { appwriteService } from '../../../lib/appwrite';

// Mock the appwrite service
vi.mock('../../../lib/appwrite', () => ({
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

describe('Authentication Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    delete window.encryptionKey;
  });

  it('should complete full authentication flow', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const mockUser = { $id: '123', email: 'test@example.com' };

    // Mock initial unauthenticated state
    appwriteService.getCurrentUser.mockRejectedValueOnce(new Error('Not authenticated'));
    
    // Mock successful login
    appwriteService.authenticate.mockResolvedValue({ sessionId: 'session123' });
    appwriteService.getCurrentUser.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <LoginForm onSuccess={onSuccess} onToggleMode={vi.fn()} />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    // Fill in credentials
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');

    // Submit form
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    // Verify authentication was called
    await waitFor(() => {
      expect(appwriteService.authenticate).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    // Verify success callback was called
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should handle authentication errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock initial unauthenticated state
    appwriteService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));
    
    // Mock authentication failure
    appwriteService.authenticate.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <LoginForm onSuccess={vi.fn()} onToggleMode={vi.fn()} />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    // Fill in credentials
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');

    // Submit form
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    // Verify error is displayed
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials|Authentication error/)).toBeInTheDocument();
    });
  });

  it('should validate form inputs', async () => {
    const user = userEvent.setup();
    
    appwriteService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));

    render(
      <AuthProvider>
        <LoginForm onSuccess={vi.fn()} onToggleMode={vi.fn()} />
      </AuthProvider>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    // Try to submit without filling fields
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/required|Authentication error/)).toBeInTheDocument();
    });

    // Verify authenticate was not called
    expect(appwriteService.authenticate).not.toHaveBeenCalled();
  });
});