// src/pages/AuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Store the token in localStorage
      localStorage.setItem('authToken', token);

      // Optionally, you can set the token in your AuthContext here

      // Redirect to the home page or dashboard
      navigate('/');
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;
