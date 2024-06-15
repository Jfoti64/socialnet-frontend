import { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Post from '../components/post/Post';
import NewPostForm from '../components/post/NewPostForm';
import { getFeedPosts, createPost } from '../api';
import { ClipLoader } from 'react-spinners';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsData = await getFeedPosts();
      setPosts(postsData);
      setError('');
    } catch (error) {
      setError('Error fetching posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched
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
          showForm={showForm}
          onComposeClick={() => setShowForm(!showForm)}
          refreshPosts={fetchPosts}
          showComposeButton={true}
        />
        <div className="p-10 overflow-auto">
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
  );
};

export default Dashboard;
