// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api';
import { jwtDecode } from 'jwt-decode'; // Ensure correct import

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state to indicate checking auth

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Token in useEffect:', token); // Debug statement
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        console.log('User set from token in localStorage: ', decodedUser); // Debug statement
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    } else {
      console.log('No token found in localStorage'); // Debug statement
    }
    setIsCheckingAuth(false); // Indicate that auth check is complete
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
