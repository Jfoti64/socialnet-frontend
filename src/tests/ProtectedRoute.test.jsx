import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { AuthContext } from '../context/AuthContext';

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthContext.Provider value={{ user: null }}>
          <Routes>
            <Route
              path="/protected"
              element={<ProtectedRoute element={() => <div>Protected</div>} />}
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  it('allows authenticated users', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthContext.Provider value={{ user: { id: '1', name: 'Test User' } }}>
          <Routes>
            <Route
              path="/protected"
              element={<ProtectedRoute element={() => <div>Protected</div>} />}
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText(/Protected/i)).toBeInTheDocument();
  });
});
