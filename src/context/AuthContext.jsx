// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { login as loginApi, register as registerApi } from '../api';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          // Token has expired
          logout();
        } else {
          setUser(decodedToken);
        }
      } catch (error) {
        console.error('Failed to decode token', error);
        setAuthError('Failed to decode token');
        logout();
      }
    }
    setIsCheckingAuth(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await loginApi(credentials);
      localStorage.setItem('authToken', data.token);
      const decodedUser = jwtDecode(data.token);
      setUser(decodedUser);
      setAuthError(null);
      return data;
    } catch (error) {
      console.error('Error during login:', error);
      const errorMessage = error.response?.data?.msg || 'Login failed';
      setAuthError(errorMessage);
      throw error;
    }
  };

  const register = async (userInfo) => {
    try {
      const data = await registerApi(userInfo);
      localStorage.setItem('authToken', data.token);
      const decodedUser = jwtDecode(data.token);
      setUser(decodedUser);
      setAuthError(null);
      return data;
    } catch (error) {
      console.error('Error during registration:', error);
      const errorMessage = error.response?.data?.msg || 'Registration failed';
      setAuthError(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setAuthError(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isCheckingAuth, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
