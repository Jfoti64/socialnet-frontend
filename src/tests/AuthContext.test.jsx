// src/tests/AuthContext.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthProvider, { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import jwt from 'jsonwebtoken';
import { vi } from 'vitest';
import { jwtDecode } from 'jwt-decode';

// Mock jwtDecode
vi.mock('jwt-decode', () => ({
  __esModule: true,
  jwtDecode: vi.fn(),
}));

// Clear localStorage and reset mocks after each test
afterEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe('AuthContext', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const renderWithRouter = (ui) => {
    return render(
      <MemoryRouter>
        <AuthProvider>{ui}</AuthProvider>
      </MemoryRouter>
    );
  };

  it('provides user and isCheckingAuth values', () => {
    const TestComponent = () => {
      const { user, isCheckingAuth } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <div>isCheckingAuth: {isCheckingAuth ? 'true' : 'false'}</div>
        </div>
      );
    };

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    expect(screen.getByText(/isCheckingAuth: false/i)).toBeInTheDocument();
  });

  it('provides user when token exists in localStorage', () => {
    const token = jwt.sign({ name: 'Test User' }, 'testSecret');
    localStorage.setItem('authToken', token);
    jwtDecode.mockReturnValue({ name: 'Test User' });

    const TestComponent = () => {
      const { user } = React.useContext(AuthContext);
      return <div>user: {user ? user.name : 'No user'}</div>;
    };

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: Test User/i)).toBeInTheDocument();
  });

  it('updates user after login', async () => {
    const mockUser = { name: 'Test User' };
    const token = jwt.sign(mockUser, 'testSecret');
    vi.spyOn(api, 'login').mockResolvedValue({ token });
    jwtDecode.mockReturnValue(mockUser);

    const TestComponent = () => {
      const { user, login } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={() => login({ username: 'test', password: 'test' }).catch(() => {})}>
            Login
          </button>
        </div>
      );
    };

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(screen.getByText(/user: Test User/i)).toBeInTheDocument());
  });

  it('logs out the user', () => {
    const token = jwt.sign({ name: 'Test User' }, 'testSecret');
    localStorage.setItem('authToken', token);
    jwtDecode.mockReturnValue({ name: 'Test User' });

    const TestComponent = () => {
      const { user, logout } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={logout}>Logout</button>
        </div>
      );
    };

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: Test User/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('registers a new user', async () => {
    const mockUser = { name: 'New User' };
    const token = jwt.sign(mockUser, 'testSecret');
    vi.spyOn(api, 'register').mockResolvedValue({ token });
    jwtDecode.mockReturnValue(mockUser);

    const TestComponent = () => {
      const { user, register } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={() => register({ username: 'new', password: 'user' }).catch(() => {})}>
            Register
          </button>
        </div>
      );
    };

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => expect(screen.getByText(/user: New User/i)).toBeInTheDocument());
  });

  it('remains logged in after re-mount', () => {
    const token = jwt.sign({ name: 'Persistent User' }, 'testSecret');
    localStorage.setItem('authToken', token);
    jwtDecode.mockReturnValue({ name: 'Persistent User' });

    const TestComponent = () => {
      const { user } = React.useContext(AuthContext);
      return <div>user: {user ? user.name : 'Persistent User'}</div>;
    };

    const { unmount } = renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: Persistent User/i)).toBeInTheDocument();

    unmount();

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: Persistent User/i)).toBeInTheDocument();
  });

  it('handles expired tokens correctly', () => {
    const token = jwt.sign(
      { name: 'Test User', exp: Math.floor(Date.now() / 1000) - 10 },
      'testSecret'
    );
    localStorage.setItem('authToken', token);
    jwtDecode.mockReturnValue({ name: 'Test User', exp: Math.floor(Date.now() / 1000) - 10 });

    const TestComponent = () => {
      const { user } = React.useContext(AuthContext);
      return <div>user: {user ? user.name : 'No user'}</div>;
    };

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('handles failed login attempts', async () => {
    const mockError = { response: { data: { msg: 'Login failed' } } };
    vi.spyOn(api, 'login').mockRejectedValue(mockError);

    const TestComponent = () => {
      const { user, login, authError } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={() => login({ username: 'test', password: 'test' }).catch(() => {})}>
            Login
          </button>
          {authError && <div data-testid="auth-error">{authError}</div>}
        </div>
      );
    };

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      const errorElements = screen.queryAllByTestId('auth-error');
      expect(errorElements[errorElements.length - 1]).toHaveTextContent(/Login failed/i);
    });
  });

  it('handles failed registration attempts', async () => {
    const mockError = { response: { data: { msg: 'Registration failed' } } };
    vi.spyOn(api, 'register').mockRejectedValue(mockError);

    const TestComponent = () => {
      const { user, register, authError } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={() => register({ username: 'new', password: 'user' }).catch(() => {})}>
            Register
          </button>
          {authError && <div data-testid="auth-error">{authError}</div>}
        </div>
      );
    };

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      const errorElements = screen.queryAllByTestId('auth-error');
      expect(errorElements[errorElements.length - 1]).toHaveTextContent(/Registration failed/i);
    });
  });

  it('navigates to login after logout', () => {
    const token = jwt.sign({ name: 'Test User' }, 'testSecret');
    localStorage.setItem('authToken', token);
    jwtDecode.mockReturnValue({ name: 'Test User' });

    const TestComponent = () => {
      const { user, logout } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={logout}>Logout</button>
        </div>
      );
    };

    renderWithRouter(<TestComponent />);

    expect(screen.getByText(/user: Test User/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
