// src/components/Post.jsx
import { useState, useEffect, useCallback } from 'react';
import {
  HeartIcon as HeartIconOutline,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import PropTypes from 'prop-types';
import { getCommentsForPost, toggleLike, createComment } from '../../api';
import Comment from './Comment';

const Post = ({
  author,
  content,
  createdAt,
  profilePicture,
  postId,
  likeCount,
  initialIsLiked,
}) => {
  const [likes, setLikes] = useState(likeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const fetchComments = useCallback(async () => {
    try {
      const commentData = await getCommentsForPost(postId);
      setComments(commentData);
      setCommentCount(commentData.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments(); // Fetch comments initially to get the comment count
  }, [fetchComments]);

  const handleLikeToggle = async () => {
    try {
      await toggleLike(postId);
      setIsLiked(!isLiked);
      setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      try {
        await createComment(postId, commentText);
        setCommentText('');
        fetchComments(); // Refresh comments after adding a new one
      } catch (error) {
        console.error('Error creating comment:', error);
      }
    }
  };

  return (
    <div className="bg-gray-800 text-white rounded-md shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {profilePicture && (
            <img src={profilePicture} alt="Profile" className="w-10 h-10 rounded-full mr-2" />
          )}
          <div className="text-lg font-semibold">{`${author.firstName} ${author.lastName}`}</div>
        </div>
        <div className="text-sm text-gray-400">{new Date(createdAt).toLocaleDateString()}</div>
      </div>
      <div className="mb-4">
        <p>{content}</p>
      </div>
      <div className="flex items-center space-x-4 mb-4">
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
        <button
          className="flex items-center text-sm text-gray-400 hover:text-blue-500"
          onClick={() => setShowComments(!showComments)}
        >
          <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 mr-1" />
          <span>
            {commentCount} Comment{commentCount !== 1 && 's'}
          </span>
        </button>
      </div>
      {showComments && (
        <>
          <form onSubmit={handleComment} className="mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </form>
          <ul className="space-y-2">
            {comments.map((comment, index) => (
              <Comment
                key={index}
                author={comment.author}
                content={comment.content}
                createdAt={comment.createdAt}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

Post.propTypes = {
  author: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  profilePicture: PropTypes.string,
  postId: PropTypes.string.isRequired,
  likeCount: PropTypes.number.isRequired,
  initialIsLiked: PropTypes.bool.isRequired,
};

export default Post;
