// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
    setIsCheckingAuth(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    localStorage.setItem('authToken', data.token);
    const decodedUser = jwtDecode(data.token);
    setUser(decodedUser);
  };

  const register = async (userInfo) => {
    const data = await registerApi(userInfo);
    localStorage.setItem('authToken', data.token);
    const decodedUser = jwtDecode(data.token);
    setUser(decodedUser);
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
