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
      console.error('Login failed:', err);
      setError('Login failed'); // Set error message
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
