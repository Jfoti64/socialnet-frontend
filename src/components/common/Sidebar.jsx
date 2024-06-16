// src/components/common/Sidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const [active, setActive] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const currentPath = location.pathname;
    if (currentPath === '/') {
      setActive('home');
    } else if (currentPath.startsWith('/profile')) {
      setActive('profile');
    }
  }, [location]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="bg-gray-800 shadow-lg w-full md:w-60 md:h-full md:flex md:flex-col">
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 items-center md:items-start justify-between md:justify-start p-4 md:py-4 md:px-2">
        <Link to="/" className="text-2xl font-bold text-white" onClick={() => setActive('home')}>
          SocialNet
        </Link>
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>
      <div
        className={`flex flex-col h-full md:flex md:flex-col ${isMenuOpen ? 'block' : 'hidden'} md:block`}
      >
        <ul className="flex flex-col w-full space-y-3 md:space-y-1">
          <li
            className={`flex-1 md:flex-none rounded-lg ${active === 'home' ? 'bg-gray-700' : ''}`}
          >
            <Link
              to="/"
              className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-gray-700"
              onClick={() => {
                setActive('home');
                setIsMenuOpen(false);
              }}
            >
              <HomeIcon className="w-6 h-6" />
              <span>Home</span>
            </Link>
          </li>
          <li
            className={`flex-1 md:flex-none rounded-lg ${active === 'profile' ? 'bg-gray-700' : ''}`}
          >
            <Link
              to={`/profile/${user?.id}`}
              className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-gray-700"
              onClick={() => {
                setActive('profile');
                setIsMenuOpen(false);
              }}
            >
              <UserIcon className="w-6 h-6" />
              <span>Profile</span>
            </Link>
          </li>
          {/* Show logout here on smaller screens */}
          {isMenuOpen && (
            <li className="flex-1 md:flex-none rounded-lg">
              <button
                className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-gray-700 w-full"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </li>
          )}
        </ul>
        {/* Show logout here on larger screens */}
        <div className="hidden md:flex md:flex-col md:mt-auto p-2 md:py-4">
          <button
            className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-gray-700 w-full"
            onClick={handleLogout}
          >
            <ArrowLeftOnRectangleIcon className="w-6 h-6" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
