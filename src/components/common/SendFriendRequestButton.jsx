import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sendFriendRequest, checkFriendRequestStatus } from '../../api';

const SendFriendRequestButton = ({ requesterId, recipientId }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFriendRequestStatus = async () => {
      try {
        const { status } = await checkFriendRequestStatus(requesterId, recipientId);
        setStatus(status);
      } catch (error) {
        setError('Error checking friend request status');
        console.error('Error checking friend request status:', error);
      }
    };

    fetchFriendRequestStatus();
  }, [requesterId, recipientId]);

  const handleSendFriendRequest = async () => {
    try {
      await sendFriendRequest(recipientId);
      setStatus('pending');
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Error sending friend request';
      setError(errorMessage);
      console.error('Error sending friend request:', error);
    }
  };

  if (status === 'friends') return null;

  return (
    <div>
      {status === 'pending' ? (
        <p className="mt-2 text-yellow-500">Pending</p>
      ) : (
        <button
          onClick={handleSendFriendRequest}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
        >
          Send Friend Request
        </button>
      )}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

SendFriendRequestButton.propTypes = {
  requesterId: PropTypes.string.isRequired,
  recipientId: PropTypes.string.isRequired,
};

export default SendFriendRequestButton;
