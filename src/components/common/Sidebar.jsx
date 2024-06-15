// src/components/common/Sidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const [active, setActive] = useState('home');
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

  return (
    <div className="bg-gray-800 shadow-lg w-full md:w-60 md:h-full md:flex md:flex-col">
      <div className="flex md:flex-col space-x-3 md:space-x-0 md:space-y-3 items-center md:items-start justify-center md:justify-start p-4 md:py-4 md:px-2">
        <div className="text-2xl font-bold text-white mb-4">SocialNet</div>
        <ul className="flex md:flex-col w-full space-x-3 md:space-x-0 md:space-y-1">
          <li
            className={`flex-1 md:flex-none rounded-lg ${active === 'home' ? 'bg-gray-700' : ''}`}
          >
            <Link
              to="/"
              className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-gray-700"
              onClick={() => setActive('home')}
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
              onClick={() => setActive('profile')}
            >
              <UserIcon className="w-6 h-6" />
              <span>Profile</span>
            </Link>
          </li>
          {/* Only show logout here on smaller screens */}
          <li className="flex-1 md:hidden rounded-lg">
            <button
              className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-gray-700 w-full"
              onClick={handleLogout}
            >
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
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
  );
};

export default Sidebar;
