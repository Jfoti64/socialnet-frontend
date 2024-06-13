import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import LoginPage from '../pages/LoginPage';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock the useNavigate function from react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

describe('LoginPage', () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock the implementation of useAuth and useNavigate
    useAuth.mockReturnValue({
      login: mockLogin,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the LoginPage component', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
  });

  it('calls the login function and navigates on successful login', async () => {
    mockLogin.mockResolvedValueOnce();

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays an error message when login fails', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Login failed'));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
      });
    });

    // Assuming you display an error message somewhere in the component, mock this display for the test
    // This is just a placeholder example; update according to your actual implementation
    const errorMessage = screen.getByText(/login failed/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
