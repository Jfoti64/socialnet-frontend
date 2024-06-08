// src/pages/GoogleCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const GoogleCallback = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      if (token) {
        // Assuming your backend sends a token as a query parameter
        setUser({ token });
        navigate('/'); // Redirect to home page or dashboard after successful login
      } else {
        navigate('/login'); // Redirect to login page if no token found
      }
    };

    handleGoogleCallback();
  }, [navigate, setUser]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
