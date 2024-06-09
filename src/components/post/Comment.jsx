// src/components/post/Comment.jsx
import PropTypes from 'prop-types';

const Comment = ({ authorFirstName, authorLastName, content, profilePicture, createdAt }) => {
  return (
    <div className="bg-gray-700 rounded-md p-2 mb-2">
      <div className="flex items-center mb-2">
        {profilePicture && (
          <img src={profilePicture} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
        )}
        <div className="flex flex-col">
          <span className="font-semibold text-white">{`${authorFirstName} ${authorLastName}`}</span>
          <span className="text-sm text-gray-400">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <p className="text-white">{content}</p>
    </div>
  );
};

Comment.propTypes = {
  authorFirstName: PropTypes.string.isRequired,
  authorLastName: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  profilePicture: PropTypes.string,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
};

export default Comment;
