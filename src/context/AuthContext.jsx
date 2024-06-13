import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login as loginApi, register as registerApi } from '../api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Failed to decode token', error);
        setAuthError('Failed to decode token');
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
    } catch (error) {
      setAuthError('Login failed');
    }
  };

  const register = async (userInfo) => {
    try {
      const data = await registerApi(userInfo);
      localStorage.setItem('authToken', data.token);
      const decodedUser = jwtDecode(data.token);
      setUser(decodedUser);
      setAuthError(null);
    } catch (error) {
      setAuthError('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setAuthError(null);
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
