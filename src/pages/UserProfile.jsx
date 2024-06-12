import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile, getUserPosts, getUserFriends, getUserComments, getPost } from '../api';
import ProfilePicture from '../components/common/ProfilePicture';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const { user, isCheckingAuth } = useAuth();

  useEffect(() => {
    if (!isCheckingAuth && user) {
      const fetchUserProfile = async () => {
        try {
          const profile = await getUserProfile(userId);
          setUserProfile(profile);

          if (profile.friends.includes(user.id) || user.id === userId) {
            const [posts, friends, comments] = await Promise.all([
              getUserPosts(userId),
              getUserFriends(userId),
              getUserComments(userId),
            ]);

            // Fetch post details for each comment
            const commentsWithPostDetails = await Promise.all(
              comments.map(async (comment) => {
                const post = await getPost(comment.post);
                return { ...comment, post };
              })
            );

            setUserPosts(posts);
            setUserFriends(friends);
            setUserComments(commentsWithPostDetails);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [userId, user, isCheckingAuth]);

  if (isCheckingAuth || !userProfile) {
    return <div>Loading...</div>;
  }

  const isUser = user.id === userId;
  const isFriend = userProfile.friends.includes(user.id);

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
        <div className="p-4">
          <div className="bg-gray-800 text-white p-4 rounded-md shadow-md">
            <div className="flex items-center space-x-4">
              <ProfilePicture
                profilePicture={userProfile.profilePicture}
                alt={`${userProfile.firstName} ${userProfile.lastName}`}
              />
              <div>
                <h1 className="text-2xl font-semibold">{`${userProfile.firstName} ${userProfile.lastName}`}</h1>
                <p className="text-gray-400">{userProfile.email}</p>
              </div>
            </div>
          </div>
          {(isUser || isFriend) && (
            <div className="mt-4">
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 ${activeTab === 'posts' ? 'bg-indigo-600' : 'bg-gray-800'} text-white rounded-md`}
                  onClick={() => setActiveTab('posts')}
                >
                  Posts
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'friends' ? 'bg-indigo-600' : 'bg-gray-800'} text-white rounded-md`}
                  onClick={() => setActiveTab('friends')}
                >
                  Friends
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === 'comments' ? 'bg-indigo-600' : 'bg-gray-800'} text-white rounded-md`}
                  onClick={() => setActiveTab('comments')}
                >
                  Comments
                </button>
              </div>
              <div className="mt-4">
                {activeTab === 'posts' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white">Posts</h2>
                    <ul className="mt-2 space-y-2">
                      {userPosts.map((post) => (
                        <li key={post._id} className="bg-gray-700 p-4 rounded-md">
                          <div className="flex items-center space-x-4">
                            <ProfilePicture
                              profilePicture={userProfile.profilePicture}
                              alt={`${userProfile.firstName} ${userProfile.lastName}`}
                            />
                            <div>
                              <Link
                                to={`/profile/${userProfile._id}`}
                                className="text-white hover:underline"
                              >
                                {`${userProfile.firstName} ${userProfile.lastName}`}
                              </Link>
                              <p className="text-gray-400 text-sm">
                                {new Date(post.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Link to={`/post/${post._id}`}>
                            <p className="mt-2 text-white hover:underline">{post.content}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'friends' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white">Friends</h2>
                    <ul className="mt-2 space-y-2">
                      {userFriends.map((friend) => (
                        <li
                          key={friend._id}
                          className="bg-gray-700 p-4 rounded-md flex items-center space-x-4"
                        >
                          <ProfilePicture
                            profilePicture={friend.profilePicture}
                            alt={`${friend.firstName} ${friend.lastName}`}
                          />
                          <Link
                            to={`/profile/${friend._id}`}
                            className="text-white hover:underline"
                          >
                            {`${friend.firstName} ${friend.lastName}`}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'comments' && (
                  <div>
                    <h2 className="text-xl font-semibold text-white">Comments</h2>
                    <ul className="mt-2 space-y-2">
                      {userComments.map((comment) => (
                        <li key={comment._id} className="bg-gray-700 p-4 rounded-md">
                          <div className="flex items-center space-x-4">
                            <ProfilePicture
                              profilePicture={comment.author?.profilePicture}
                              alt={`${comment.author?.firstName || 'N/A'} ${comment.author?.lastName || 'N/A'}`}
                            />
                            <div>
                              <Link
                                to={`/profile/${comment.author?._id || ''}`}
                                className="text-white hover:underline"
                              >
                                {`${comment.author?.firstName || 'N/A'} ${comment.author?.lastName || 'N/A'}`}
                              </Link>
                              <p className="text-gray-400 text-sm">
                                {new Date(comment.createdAt).toLocaleString()}
                              </p>
                              <Link
                                to={`/post/${comment.post._id}`}
                                className="text-gray-400 text-sm hover:underline"
                              >
                                View Post
                              </Link>
                            </div>
                          </div>
                          <p className="mt-2 text-white">{comment.content}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
