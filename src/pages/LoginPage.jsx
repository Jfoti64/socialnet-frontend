import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      await login(data);
      navigate('/'); // Redirect to home page or dashboard after successful login
    } catch (err) {
      console.error('Login error:', err); // Log the full error for debugging
      if (err.response) {
        console.error('Login error response:', err.response); // Log the error response for debugging
        if (err.response.status === 401 || err.response.status === 400) {
          setError('Incorrect username or password');
        } else {
          setError('Login failed');
        }
      } else {
        console.error('Unexpected error:', err); // Log unexpected errors
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    handleLogin({ email: 'johndoe@example.com', password: '123456' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-md shadow-md mb-4">{error}</div>
        )}
        {loading ? (
          <LoadingSpinner loading={loading} />
        ) : (
          <LoginForm onSubmit={handleLogin} onDemoLogin={handleDemoLogin} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
