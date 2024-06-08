// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { user } = useAuth();

  return user ? <Element {...rest} /> : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
