import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../api';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const data = await loginApi(credentials);
    setUser(data.user);
  };

  const register = async (userInfo) => {
    const data = await registerApi(userInfo);
    setUser(data.user);
  };

  const logout = async () => {
    await logoutApi();
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
