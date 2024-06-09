// src/components/common/Header.jsx
import { useState } from 'react';
import { BellIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleComposeClick = () => {
    // Handle the compose new post action
  };

  return (
    <header className="bg-gray-900 p-4 shadow-md flex items-center justify-between space-x-4">
      <input
        type="text"
        placeholder="Search Users..."
        className="bg-gray-800 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 w-1/2"
      />
      <div className="relative flex items-center space-x-4">
        <button
          onClick={handleBellClick}
          className="bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 flex-shrink-0"
        >
          <BellIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleComposeClick}
          className="bg-indigo-600 text-white rounded-md px-4 py-2 flex items-center space-x-2 hover:bg-indigo-500 flex-shrink-2"
        >
          <PencilSquareIcon className="w-5 h-5" />
          <span>Compose</span>
        </button>
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-gray-800 text-white rounded-md shadow-lg z-50">
            <div className="p-4">
              <h4 className="text-lg font-semibold">Friend Requests</h4>
              <ul className="mt-2 space-y-2">
                {/* Map through friend requests */}
                <li className="flex items-center justify-between">
                  <span>John Doe</span>
                  <div className="space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-md">Accept</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md">Decline</button>
                  </div>
                </li>
                <li className="flex items-center justify-between">
                  <span>Jane Doe</span>
                  <div className="space-x-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded-md">Accept</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded-md">Decline</button>
                  </div>
                </li>
                {/* Add more friend requests here */}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
