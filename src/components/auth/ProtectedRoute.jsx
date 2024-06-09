// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { user, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return user ? <Element {...rest} /> : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  element: PropTypes.elementType.isRequired,
};

export default ProtectedRoute;
