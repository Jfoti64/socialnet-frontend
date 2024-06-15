// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import Post from '../components/post/Post';
import NewPostForm from '../components/post/NewPostForm';
import { getFeedPosts, createPost } from '../api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const postsData = await getFeedPosts();
      setPosts(postsData);
      setError('');
    } catch (error) {
      setError('Error fetching posts');
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (content) => {
    try {
      await createPost({ content });
      fetchPosts();
      setShowForm(false);
    } catch (error) {
      setError('Error creating post');
      console.error('Error creating post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col">
        <div className="p-10 overflow-auto flex justify-center">
          <div className="max-w-4xl w-full">
            {showForm && <NewPostForm onCreatePost={handleCreatePost} />}
            {error && (
              <div className="bg-red-500 text-white p-4 rounded-md shadow-md mb-4">{error}</div>
            )}
            {posts.length === 0 && !error && <div>Loading...</div>}
            {posts.map((post) => (
              <Post
                key={post._id}
                author={post.author}
                content={post.content}
                createdAt={post.createdAt}
                profilePicture={post.author.profilePicture}
                postId={post._id}
                likeCount={post.likes.length}
                initialIsLiked={post.isLiked}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
