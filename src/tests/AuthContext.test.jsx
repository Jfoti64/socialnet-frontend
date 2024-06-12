// src/tests/AuthContext.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthProvider, { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import jwt from 'jsonwebtoken';
import { vi } from 'vitest';

// Mock console.error to suppress error output
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Clear localStorage and reset mocks after each test
afterEach(() => {
  localStorage.clear();
  vi.resetAllMocks();
});

// Restore console.error after all tests
afterAll(() => {
  console.error.mockRestore();
});

describe('AuthContext', () => {
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

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    expect(screen.getByText(/isCheckingAuth: false/i)).toBeInTheDocument();
  });

  it('provides user when token exists in localStorage', () => {
    const token = jwt.sign({ name: 'Test User' }, 'testSecret');
    localStorage.setItem('authToken', token);

    const TestComponent = () => {
      const { user } = React.useContext(AuthContext);
      return <div>user: {user ? user.name : 'No user'}</div>;
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/user: Test User/i)).toBeInTheDocument();
  });

  it('updates user after login', async () => {
    const mockUser = { name: 'Test User' };
    const token = jwt.sign(mockUser, 'testSecret');
    vi.spyOn(api, 'login').mockResolvedValue({ token });

    const TestComponent = () => {
      const { user, login } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={() => login({ username: 'test', password: 'test' })}>Login</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Login'));

    await screen.findByText(/user: Test User/i);
  });

  it('logs out the user', () => {
    const token = jwt.sign({ name: 'Test User' }, 'testSecret');
    localStorage.setItem('authToken', token);

    const TestComponent = () => {
      const { user, logout } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={logout}>Logout</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/user: Test User/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('registers a new user', async () => {
    const mockUser = { name: 'New User' };
    const token = jwt.sign(mockUser, 'testSecret');
    vi.spyOn(api, 'register').mockResolvedValue({ token });

    const TestComponent = () => {
      const { user, register } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={() => register({ username: 'new', password: 'user' })}>Register</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Register'));

    await screen.findByText(/user: New User/i);
  });

  it('handles token decoding failure', () => {
    const invalidToken = 'invalid.token.here';
    localStorage.setItem('authToken', invalidToken);

    const TestComponent = () => {
      const { user, isCheckingAuth, authError } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <div>isCheckingAuth: {isCheckingAuth ? 'true' : 'false'}</div>
          <div>{authError}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    expect(screen.getByText(/isCheckingAuth: false/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed to decode token/i)).toBeInTheDocument();
  });

  it('remains logged in after re-mount', () => {
    const token = jwt.sign({ name: 'Persistent User' }, 'testSecret');
    localStorage.setItem('authToken', token);

    const TestComponent = () => {
      const { user } = React.useContext(AuthContext);
      return <div>user: {user ? user.name : 'No user'}</div>;
    };

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/user: Persistent User/i)).toBeInTheDocument();

    unmount();

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/user: Persistent User/i)).toBeInTheDocument();
  });

  it('handles login API error', async () => {
    vi.spyOn(api, 'login').mockRejectedValue(new Error('Login failed'));

    const TestComponent = () => {
      const { user, login, authError } = React.useContext(AuthContext);
      return (
        <div>
          <div>user: {user ? user.name : 'No user'}</div>
          <button onClick={() => login({ username: 'test', password: 'test' })}>Login</button>
          <div>{authError}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
      expect(screen.getByText(/user: No user/i)).toBeInTheDocument();
    });
  });
});