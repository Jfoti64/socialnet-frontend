// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthProvider from './context/AuthContext';
import AuthSuccess from './pages/AuthSuccess';
import UserProfile from './pages/UserProfile';
import PostPage from './pages/PostPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/success" element={<AuthSuccess />} />
          <Route path="/profile/:userId" element={<ProtectedRoute element={UserProfile} />} />
          <Route path="/" element={<ProtectedRoute element={Dashboard} />} />
          <Route path="/post/:postId" element={<ProtectedRoute element={PostPage} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
