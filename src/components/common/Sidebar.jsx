// src/components/common/Sidebar.jsx
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const [active, setActive] = useState('home');
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    <Navigate to="/login" />;
  };

  return (
    <div className="flex flex-col h-screen p-3 bg-gray-900 shadow w-60">
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-white">SocialNet</span>
        </div>
        <div className="flex-1">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <li className={`rounded-lg ${active === 'home' ? 'bg-gray-800' : ''}`}>
              <a
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md text-white"
                onClick={() => setActive('home')}
              >
                <HomeIcon className="w-6 h-6" />
                <span>Home</span>
              </a>
            </li>
            <li className={`rounded-lg ${active === 'profile' ? 'bg-gray-800' : ''}`}>
              <a
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md text-white"
                onClick={() => setActive('profile')}
              >
                <UserIcon className="w-6 h-6" />
                <span>Profile</span>
              </a>
            </li>
            <li className={`rounded-lg ${active === 'settings' ? 'bg-gray-800' : ''}`}>
              <a
                href="#"
                className="flex items-center p-2 space-x-3 rounded-md text-white"
                onClick={() => setActive('settings')}
              >
                <Cog6ToothIcon className="w-6 h-6" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="pt-2 pb-4 space-y-1 text-sm">
          <li className="rounded-lg">
            <a href="#" className="flex items-center p-2 space-x-3 rounded-md text-white">
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              <span>
                <button onClick={handleLogout}>Logout</button>
              </span>
            </a>
          </li>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
