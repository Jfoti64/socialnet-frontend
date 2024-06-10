// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Post from '../components/post/Post';
import NewPostForm from '../components/post/NewPostForm';
import { getFeedPosts, createPost } from '../api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to manage form visibility

  const fetchPosts = async () => {
    try {
      const postsData = await getFeedPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async (content) => {
    try {
      await createPost({ content });
      fetchPosts(); // Refresh posts after creating a new one
      setShowForm(false); // Hide form after post creation
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header
          showForm={showForm}
          onComposeClick={() => setShowForm(!showForm)}
          refreshPosts={fetchPosts}
        />
        <div className="p-10 text-white overflow-auto">
          {showForm && <NewPostForm onCreatePost={handleCreatePost} />}
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
