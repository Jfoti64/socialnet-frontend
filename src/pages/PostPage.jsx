import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, getCommentsForPost, toggleLike } from '../api';
import ProfilePicture from '../components/common/ProfilePicture';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { ClipLoader } from 'react-spinners';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postData = await getPost(postId);
        const commentsData = await getCommentsForPost(postId);
        setPost(postData);
        setComments(commentsData);
        setIsLiked(postData.likes.includes(postData.author._id)); // Assuming current user id is in the likes array
        setLikes(postData.likes.length);
      } catch (error) {
        console.error('Error fetching post or comments:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleLikeToggle = async () => {
    try {
      await toggleLike(postId);
      setIsLiked(!isLiked);
      setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-900">
        <ClipLoader color={'#3949AB'} loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header
          showForm={false}
          onComposeClick={null}
          refreshPosts={() => {}}
          showComposeButton={false}
        />
        <div className="p-4 overflow-auto">
          <div className="bg-gray-800 text-white p-4 rounded-md shadow-md mb-4">
            <div className="flex items-center space-x-4 mb-4">
              <ProfilePicture
                profilePicture={post.author?.profilePicture}
                alt={`${post.author?.firstName} ${post.author?.lastName}`}
              />
              <div>
                <Link
                  to={`/profile/${post.author?._id}`}
                  className="text-2xl font-semibold hover:underline"
                >
                  {`${post.author?.firstName} ${post.author?.lastName}`}
                </Link>
                <p className="text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <p className="text-lg">{post.content}</p>
            <div className="flex items-center space-x-4 mt-4">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center text-sm text-gray-400 hover:text-red-500 ${
                  isLiked ? 'text-red-500' : ''
                }`}
              >
                {isLiked ? (
                  <HeartIconSolid className="w-5 h-5 mr-1" />
                ) : (
                  <HeartIconOutline className="w-5 h-5 mr-1" />
                )}
                <span>
                  {likes} Like{likes !== 1 && 's'}
                </span>
              </button>
            </div>
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment._id} className="bg-gray-700 p-4 rounded-md">
                  <div className="flex items-center space-x-4">
                    <ProfilePicture
                      profilePicture={comment.author?.profilePicture}
                      alt={`${comment.author?.firstName} ${comment.author?.lastName}`}
                    />
                    <div>
                      <Link
                        to={`/profile/${comment.author?._id}`}
                        className="font-semibold hover:underline"
                      >
                        {`${comment.author?.firstName} ${comment.author?.lastName}`}
                      </Link>
                      <p className="text-white">{comment.content}</p>
                      <p className="text-gray-400 text-sm">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
