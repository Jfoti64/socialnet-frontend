import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LoginForm from '../components/auth/LoginForm';
import { AuthContext } from '../context/AuthContext';
import { vi } from 'vitest';

describe('LoginForm', () => {
  it('should render the login form', () => {
    render(<LoginForm onSubmit={() => {}} onDemoLogin={() => {}} />);
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should show validation errors', async () => {
    render(<LoginForm onSubmit={() => {}} onDemoLogin={() => {}} />);
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
        <LoginForm onSubmit={loginMock} onDemoLogin={() => {}} />
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

  it('should render and handle demo login button', async () => {
    const demoLoginMock = vi.fn();

    render(<LoginForm onSubmit={() => {}} onDemoLogin={demoLoginMock} />);

    const demoLoginButton = screen.getByRole('button', { name: /Login as Demo User/i });
    expect(demoLoginButton).toBeInTheDocument();

    fireEvent.click(demoLoginButton);

    await waitFor(
      () => {
        expect(demoLoginMock).toHaveBeenCalled();
      },
      { timeout: 5000 }
    );
  });

  it('should disable form fields during demo login typing', async () => {
    render(<LoginForm onSubmit={() => {}} onDemoLogin={() => {}} />);

    const demoLoginButton = screen.getByRole('button', { name: /Login as Demo User/i });
    fireEvent.click(demoLoginButton);

    const emailField = screen.getByLabelText(/Email address/i);
    const passwordField = screen.getByLabelText(/password/i);

    expect(emailField).toBeDisabled();
    expect(passwordField).toBeDisabled();

    await waitFor(
      () => {
        expect(emailField).not.toBeDisabled();
        expect(passwordField).not.toBeDisabled();
      },
      { timeout: 5000 }
    ); // adjust timeout based on your typing speed settings
  });

  it('should redirect to Google login', () => {
    delete window.location;
    window.location = { href: 'http://localhost:3000/' };

    render(<LoginForm onSubmit={() => {}} onDemoLogin={() => {}} />);

    const googleLoginButton = screen.getByRole('button', { name: /Continue with Google/i });
    expect(googleLoginButton).toBeInTheDocument();

    fireEvent.click(googleLoginButton);

    expect(window.location.href).toBe('http://localhost:3000/auth/google');
  });

  it('should show validation error for invalid email format', async () => {
    render(<LoginForm onSubmit={() => {}} onDemoLogin={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Email address/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
    });
  });
});
