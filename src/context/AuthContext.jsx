// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if there's a token in localStorage and set the user state accordingly
    const token = localStorage.getItem('authToken');
    if (token) {
      // Optionally, you can decode the token to get the user information
      const user = jwtDecode(token);
      setUser(user);
    }
  }, []);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    localStorage.setItem('authToken', data.token);
    setUser(data.user);
  };

  const register = async (userInfo) => {
    const data = await registerApi(userInfo);
    localStorage.setItem('authToken', data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await logoutApi();
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
