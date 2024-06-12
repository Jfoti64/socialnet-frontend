import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost, getCommentsForPost } from '../api';
import ProfilePicture from '../components/common/ProfilePicture';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postData = await getPost(postId);
        const commentsData = await getCommentsForPost(postId);
        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching post or comments:', error);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
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
                className="w-10 h-10 rounded-full"
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
                      className="w-8 h-8 rounded-full"
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
