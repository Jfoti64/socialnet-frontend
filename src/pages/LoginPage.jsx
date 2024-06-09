// src/pages/LoginPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm'; // Ensure the correct import path

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      await login(data);
      navigate('/'); // Redirect to home page or dashboard after successful login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
