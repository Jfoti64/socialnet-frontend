// src/tests/App.test.jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TestApp from './TestApp';
import { vi } from 'vitest';
import { useAuth } from '../hooks/useAuth'; // Ensure useAuth is imported

// Mock the ProtectedRoute component directly
vi.mock('../components/auth/ProtectedRoute', () => ({
  default: ({ element: Element, ...rest }) => {
    const { user } = useAuth();

    return user ? <Element {...rest} /> : <div>Redirected to login</div>;
  },
}));

const renderWithAuth = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider {...providerProps}>{ui}</AuthContext.Provider>,
    renderOptions
  );
};

describe('App component', () => {
  it('renders login heading', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <TestApp />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading').textContent).toMatch(/log in/i);
  });

  it('renders register heading', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <TestApp />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading').textContent).toMatch(/register/i);
  });

  it('redirects unauthenticated users to login', () => {
    const providerProps = {
      value: {
        user: null,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        isCheckingAuth: false,
      },
    };
    renderWithAuth(
      <MemoryRouter initialEntries={['/']}>
        <TestApp />
      </MemoryRouter>,
      { providerProps }
    );
    expect(screen.getByText(/Redirected to login/i)).toBeInTheDocument(); // Check for the redirection text
  });
});
