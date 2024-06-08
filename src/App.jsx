// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

const App = () => {
  return (
    <Router>
      <Header />
      <Sidebar />
      <div className="main-content">
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/profile/:userId" component={ProfilePage} />
          <Route path="/friends" component={FriendsPage} />
          <Route path="/users" component={UsersPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
        </Switch>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
