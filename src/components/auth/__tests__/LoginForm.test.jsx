import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';
import { AuthProvider } from '../../../contexts/AuthContext';
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

const renderLoginForm = (props = {}) => {
  const defaultProps = {
    onSuccess: vi.fn(),
    onToggleMode: vi.fn(),
    ...props
  };

  return render(
    <AuthProvider>
      <LoginForm {...defaultProps} />
    </AuthProvider>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    appwriteService.getCurrentUser.mockRejectedValue(new Error('Not authenticated'));
  });

  it('should render login form with all required fields', async () => {
    renderLoginForm();

    await waitFor(() => {
      expect(screen.getByText('Welcome back')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    });

    // Try to submit without filling fields
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('should validate email format', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await waitFor(() => {
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    // Enter invalid email
    await user.type(screen.getByLabelText('Email address'), 'invalid-email');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await waitFor(() => {
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    // Enter short password
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), '123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters long')).toBeInTheDocument();
    });
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const mockUser = { $id: '123', email: 'test@example.com' };

    appwriteService.authenticate.mockResolvedValue({ sessionId: 'session123' });
    appwriteService.getCurrentUser.mockResolvedValue(mockUser);

    renderLoginForm({ onSuccess });

    await waitFor(() => {
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    // Fill in valid credentials
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(appwriteService.authenticate).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    // Wait for success callback
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should handle login failure', async () => {
    const user = userEvent.setup();
    
    appwriteService.authenticate.mockRejectedValue(new Error('Invalid credentials'));

    renderLoginForm();

    await waitFor(() => {
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    // Fill in credentials
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
    });
  });

  it('should show loading state during login', async () => {
    const user = userEvent.setup();
    
    // Create a promise that we can control
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    
    appwriteService.authenticate.mockReturnValue(loginPromise);

    renderLoginForm();

    await waitFor(() => {
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    // Fill in credentials and submit
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });

    // Button should be disabled
    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeDisabled();

    // Resolve the login
    resolveLogin({ sessionId: 'session123' });
  });

  it('should call onToggleMode when sign up link is clicked', async () => {
    const user = userEvent.setup();
    const onToggleMode = vi.fn();

    renderLoginForm({ onToggleMode });

    await waitFor(() => {
      expect(screen.getByText('Sign up')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Sign up'));

    expect(onToggleMode).toHaveBeenCalled();
  });

  it('should clear errors when component mounts', async () => {
    // First render with an error state
    appwriteService.authenticate.mockRejectedValue(new Error('Test error'));
    
    const { rerender } = renderLoginForm();

    await waitFor(() => {
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    // Trigger an error
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Email address'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
    });

    // Rerender the component (simulating remount)
    rerender(
      <AuthProvider>
        <LoginForm onSuccess={vi.fn()} onToggleMode={vi.fn()} />
      </AuthProvider>
    );

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Login failed. Please try again.')).not.toBeInTheDocument();
    });
  });

  it('should trim whitespace from email input', async () => {
    const user = userEvent.setup();
    const mockUser = { $id: '123', email: 'test@example.com' };

    appwriteService.authenticate.mockResolvedValue({ sessionId: 'session123' });
    appwriteService.getCurrentUser.mockResolvedValue(mockUser);

    renderLoginForm();

    await waitFor(() => {
      expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    });

    // Enter email with whitespace
    await user.type(screen.getByLabelText('Email address'), '  test@example.com  ');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(appwriteService.authenticate).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});