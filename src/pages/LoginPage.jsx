// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm'; // Ensure the correct import path

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleLogin = async (data) => {
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
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-12 lg:px-8">
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
