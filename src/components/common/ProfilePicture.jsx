import PropTypes from 'prop-types';

const ProfilePicture = ({
  profilePicture = 'default-profile-pic-url',
  alt = 'Profile Picture',
  size = 'medium',
}) => {
  const sizeClass = size === 'small' ? 'w-8 h-8' : 'w-10 h-10'; // Adjust size based on the size prop
  return <img src={profilePicture} alt={alt} className={`${sizeClass} rounded-full`} />;
};

ProfilePicture.propTypes = {
  profilePicture: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
};

export default ProfilePicture;
