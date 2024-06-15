// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      await register(data);
      navigate('/'); // Redirect to home page or dashboard after successful registration
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.msg === 'User already exists') {
          setErrorMessage('This email is already taken. Please use a different email.');
        } else {
          setErrorMessage(error.response.data.message || 'Registration failed. Please try again.');
        }
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Registration failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {errorMessage && (
          <div className="bg-red-500 text-white p-4 rounded-md shadow-md mb-4">{errorMessage}</div>
        )}
        {loading ? (
          <LoadingSpinner loading={loading} />
        ) : (
          <RegisterForm onSubmit={handleRegister} />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
