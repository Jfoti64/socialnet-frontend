// src/pages/RegisterPage.jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      await register(data);
      navigate('/'); // Redirect to home page or dashboard after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <RegisterForm onSubmit={handleRegister} />
    </div>
  );
};

export default RegisterPage;
