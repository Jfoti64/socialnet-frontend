import { useState, useEffect, useRef } from 'react';
import { BellIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import PropTypes from 'prop-types';
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../../api';

const Header = ({ showForm, onComposeClick }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const requests = await getFriendRequests();
        setFriendRequests(requests);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleAccept = async (requesterId) => {
    try {
      await acceptFriendRequest(requesterId);
      setFriendRequests(friendRequests.filter((request) => request.requester._id !== requesterId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async (requesterId) => {
    try {
      await rejectFriendRequest(requesterId);
      setFriendRequests(friendRequests.filter((request) => request.requester._id !== requesterId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

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
          className="relative bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
        >
          <BellIcon className="w-6 h-6" />
          {friendRequests.length > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {friendRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={onComposeClick}
          className="bg-indigo-600 text-white rounded-md px-4 py-2 flex items-center space-x-2 hover:bg-indigo-500 flex-shrink-2"
        >
          <PencilSquareIcon className="w-5 h-5" />
          <span>{showForm ? 'Cancel' : 'Compose'}</span>
        </button>
        {showNotifications && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-12 mt-2 w-80 bg-gray-800 text-white rounded-md shadow-lg z-50"
          >
            <div className="p-4">
              <h4 className="text-lg font-semibold">Friend Requests</h4>
              <ul className="mt-2 space-y-2">
                {friendRequests.map((request) => (
                  <li key={request.requester._id} className="flex items-center justify-between">
                    <span>{`${request.requester.firstName} ${request.requester.lastName}`}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleAccept(request.requester._id)}
                        className="bg-indigo-600 text-white hover:bg-indigo-500 px-3 py-1 rounded-md"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(request.requester._id)}
                        className="bg-white text-black hover:bg-red-500 hover:text-white px-3 py-1 rounded-md"
                      >
                        Decline
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  showForm: PropTypes.bool.isRequired,
  onComposeClick: PropTypes.func.isRequired,
};

export default Header;
