import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/auth/LoginForm';
import { AuthContext } from '../context/AuthContext';
import { vi } from 'vitest';

describe('LoginForm', () => {
  it('should render the login form', () => {
    render(<LoginForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should show validation errors', async () => {
    render(<LoginForm onSubmit={() => {}} />);
    fireEvent.submit(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  it('should call login function on submit', async () => {
    const loginMock = vi.fn();
    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <LoginForm onSubmit={loginMock} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });
    fireEvent.submit(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'testpassword',
      });
    });
  });
});
