import PropTypes from 'prop-types';
import ProfilePicture from '../common/ProfilePicture';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Comment = ({ author, content, createdAt }) => {
  return (
    <div className="bg-gray-700 rounded-md p-2 mb-2">
      <div className="flex items-center mb-2">
        {author.profilePicture && (
          <ProfilePicture profilePicture={author.profilePicture} alt="Profile" size="small" />
        )}
        <div className="flex flex-col ml-2">
          <Link to={`/profile/${author._id}`} className="font-semibold text-white hover:underline">
            {`${author.firstName} ${author.lastName}`}
          </Link>
          <span className="text-sm text-gray-400">{format(new Date(createdAt), 'PP')}</span>
        </div>
      </div>
      <p className="text-white">{content}</p>
    </div>
  );
};

Comment.propTypes = {
  author: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    profilePicture: PropTypes.string,
  }).isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
};

export default Comment;
