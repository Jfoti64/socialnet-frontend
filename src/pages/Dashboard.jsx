// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import Post from '../components/post/Post';
import { getFeedPosts /*createPost*/ } from '../api';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const postsData = await getFeedPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // const handleCreatePost = async () => {
  //   try {
  //     const newPost = {
  //       content: 'This is a test post',
  //     };
  //     await createPost(newPost);
  //     fetchPosts(); // Refresh posts after creating a new one
  //   } catch (error) {
  //     console.error('Error creating post:', error);
  //   }
  // };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-auto p-10 text-white">
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
