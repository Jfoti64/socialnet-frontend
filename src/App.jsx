// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import GoogleCallback from './pages/GoogleCallback';
import AuthSuccess from './pages/AuthSuccess';
import HomePage from './pages/HomePage';
// import Header from './components/common/Header';
// import Sidebar from './components/common/Sidebar';
// import Footer from './components/common/Footer';
import AuthProvider from './context/AuthContext';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        {/* <Header />
        <Sidebar /> */}
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/users" element={<UsersPage />} /> */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/google/callback" element={<GoogleCallback />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
          </Routes>
        </div>
        {/* <Footer /> */}
      </AuthProvider>
    </Router>
  );
};

export default App;
