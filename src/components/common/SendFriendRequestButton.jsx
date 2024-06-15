import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { sendFriendRequest } from '../../api';

const SendFriendRequestButton = ({ recipientId }) => {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState('');

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
  recipientId: PropTypes.string.isRequired,
};

export default SendFriendRequestButton;
