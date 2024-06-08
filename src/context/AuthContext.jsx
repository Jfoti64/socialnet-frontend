// src/context/AuthContext.jsx
import { createContext, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    setUser(response.data.user);
  };

  const register = async (userInfo) => {
    const response = await axios.post('/auth/register', userInfo);
    setUser(response.data.user);
  };

  const logout = () => {
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
