import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import AuthSuccess from '../pages/AuthSuccess';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AuthSuccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('extracts token from URL and stores it in localStorage', () => {
    const token = 'testToken';
    window.history.pushState({}, 'Test page', `?token=${token}`);

    render(
      <MemoryRouter initialEntries={['/auth-success']}>
        <Routes>
          <Route path="/auth-success" element={<AuthSuccess />} />
        </Routes>
      </MemoryRouter>
    );

    expect(localStorage.getItem('authToken')).toBe(token);
  });

  it('navigates to the home page after storing the token', () => {
    const token = 'testToken';
    window.history.pushState({}, 'Test page', `?token=${token}`);

    render(
      <MemoryRouter initialEntries={['/auth-success']}>
        <Routes>
          <Route path="/auth-success" element={<AuthSuccess />} />
        </Routes>
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('displays logging message', () => {
    render(
      <MemoryRouter initialEntries={['/auth-success']}>
        <Routes>
          <Route path="/auth-success" element={<AuthSuccess />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Logging you in.../i)).toBeInTheDocument();
  });
});
