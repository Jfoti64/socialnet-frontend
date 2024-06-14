// src/components/auth/ProtectedRoute.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';
import LoginPage from '../pages/LoginPage';

const renderWithAuthContext = (ui, { providerProps, route = '/' }) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <AuthContext.Provider {...providerProps}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users', async () => {
    const providerProps = {
      value: { user: null, isCheckingAuth: false },
    };

    renderWithAuthContext(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/protected"
          element={<ProtectedRoute element={() => <div>Protected</div>} />}
        />
      </Routes>,
      { providerProps, route: '/protected' }
    );

    await waitFor(() => {
      const loginElements = screen.getAllByText(/Log in/i);
      expect(loginElements.length).toBeGreaterThan(0);
    });
  });

  it('allows authenticated users', async () => {
    const providerProps = {
      value: { user: { id: '1', name: 'Test User' }, isCheckingAuth: false },
    };

    renderWithAuthContext(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/protected"
          element={<ProtectedRoute element={() => <div>Protected</div>} />}
        />
      </Routes>,
      { providerProps, route: '/protected' }
    );

    await waitFor(() => {
      expect(screen.getByText(/Protected/i)).toBeInTheDocument();
    });
  });

  it('renders the element when the user is authenticated', async () => {
    const providerProps = {
      value: { user: { id: '1', name: 'Test User' }, isCheckingAuth: false },
    };

    renderWithAuthContext(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
      </Routes>,
      { providerProps }
    );

    await waitFor(() => {
      expect(screen.getByText(/Compose/i)).toBeInTheDocument();
    });
  });

  it('redirects to login when the user is not authenticated', async () => {
    const providerProps = {
      value: { user: null, isCheckingAuth: false },
    };

    renderWithAuthContext(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
      </Routes>,
      { providerProps }
    );

    await waitFor(() => {
      const loginElements = screen.getAllByText(/Log in/i);
      expect(loginElements.length).toBeGreaterThan(0);
    });
  });

  it('shows loading when checking authentication', () => {
    const providerProps = {
      value: { user: null, isCheckingAuth: true },
    };

    renderWithAuthContext(
      <Routes>
        <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>,
      { providerProps }
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
