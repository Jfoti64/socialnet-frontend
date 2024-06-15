// src/components/common/Sidebar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
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
    } else if (currentPath === '/settings') {
      setActive('settings');
    }
  }, [location]);

  return (
    <div className="flex flex-col h-screen p-3 bg-gray-800 shadow-lg w-60">
      <div className="space-y-3">
        <div className="flex items-center justify-center py-4">
          <span className="text-2xl font-bold text-white">SocialNet</span>
        </div>
        <div className="flex-1">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <li className={`rounded-lg ${active === 'home' ? 'bg-gray-700' : ''}`}>
              <Link
                to="/"
                className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-gray-700"
                onClick={() => setActive('home')}
              >
                <HomeIcon className="w-6 h-6" />
                <span>Home</span>
              </Link>
            </li>
            <li className={`rounded-lg ${active === 'profile' ? 'bg-gray-700' : ''}`}>
              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-gray-700"
                onClick={() => setActive('profile')}
              >
                <UserIcon className="w-6 h-6" />
                <span>Profile</span>
              </Link>
            </li>
            <li className={`rounded-lg ${active === 'settings' ? 'bg-gray-700' : ''}`}>
              <Link
                to="/settings"
                className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-gray-700"
                onClick={() => setActive('settings')}
              >
                <Cog6ToothIcon className="w-6 h-6" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="pt-2 pb-4 space-y-1 text-sm">
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
