// src/tests/AuthContext.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthProvider, { AuthContext } from '../context/AuthContext';
import * as api from '../api';
import jwt from 'jsonwebtoken';
import { vi } from 'vitest';

// Clear localStorage and reset mocks after each test
afterEach(() => {
  localStorage.clear();
  vi.resetAllMocks();
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
});
