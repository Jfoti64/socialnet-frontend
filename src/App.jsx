// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import AuthSuccess from './pages/AuthSuccess';
import UserProfile from './pages/UserProfile';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
