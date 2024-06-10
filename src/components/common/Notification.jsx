// src/components/common/Notification.jsx
import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Notification = ({ message, type, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-5 right-5 p-4 rounded-md shadow-lg z-50 text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">
        x
      </button>
    </div>
  );
};

Notification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;
