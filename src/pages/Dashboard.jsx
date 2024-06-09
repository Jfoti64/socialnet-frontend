// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Post from '../components/post/Post';
import { getFeedPosts } from '../api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getFeedPosts();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-10 text-white">
          {posts.map((post) => (
            <Post
              key={post._id}
              postAuthor={post.author.name}
              postContent={post.content}
              postDate={post.createdAt}
              profilePicture={post.author.profilePicture}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
