import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserProfile, getUserPosts, getUserFriends, getUserComments, getPost } from '../api';
import ProfilePicture from '../components/common/ProfilePicture';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/common/Sidebar';
import Header from '../components/common/Header';
import SendFriendRequestButton from '../components/common/SendFriendRequestButton';

const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [userFriends, setUserFriends] = useState(null);
  const [userComments, setUserComments] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [sortCriteria, setSortCriteria] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [error, setError] = useState('');
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
          } else {
            setUserPosts([]);
            setUserFriends([]);
            setUserComments([]);
          }
        } catch (error) {
          setError('Error fetching user profile');
          setUserProfile(null); // Ensure userProfile is null when there's an error
          console.error('Error fetching user profile:', error);
        }
      };

      fetchUserProfile();
    }
  }, [userId, user, isCheckingAuth]);

  const sortItems = (items, criteria, order) => {
    return items.slice().sort((a, b) => {
      if (criteria === 'date') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (criteria === 'likes') {
        const likesA = a.likeCount || 0;
        const likesB = b.likeCount || 0;
        return order === 'asc' ? likesA - likesB : likesB - likesA;
      }
      return 0;
    });
  };

  const sortedPosts = userPosts ? sortItems(userPosts, sortCriteria, sortOrder) : [];
  const sortedComments = userComments ? sortItems(userComments, sortCriteria, sortOrder) : [];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header
          showForm={false}
          onComposeClick={null}
          refreshPosts={() => {}}
          showComposeButton={false}
        />
        <div className="p-4 overflow-auto">
          {error && (
            <div className="bg-red-500 text-white p-4 rounded-md shadow-md mb-4">{error}</div>
          )}
          {!isCheckingAuth && !userProfile && !error && <div>Loading...</div>}
          {userProfile && (
            <div>
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
              {user.id !== userId && !userProfile.friends.includes(user.id) ? (
                <div className="mt-4 bg-gray-700 text-white p-4 rounded-md shadow-md">
                  <p>You must be friends with this user to view their profile details.</p>
                  <SendFriendRequestButton requesterId={user.id} recipientId={userId} />
                </div>
              ) : (
                <div className="mt-4">
                  <div className="flex space-x-4">
                    <button
                      className={`px-4 py-2 ${
                        activeTab === 'posts' ? 'bg-indigo-600' : 'bg-gray-800'
                      } text-white rounded-md`}
                      onClick={() => setActiveTab('posts')}
                    >
                      Posts
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        activeTab === 'friends' ? 'bg-indigo-600' : 'bg-gray-800'
                      } text-white rounded-md`}
                      onClick={() => setActiveTab('friends')}
                    >
                      Friends
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        activeTab === 'comments' ? 'bg-indigo-600' : 'bg-gray-800'
                      } text-white rounded-md`}
                      onClick={() => setActiveTab('comments')}
                    >
                      Comments
                    </button>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <label htmlFor="sortCriteria" className="sr-only">
                      Sort by
                    </label>
                    <select
                      id="sortCriteria"
                      className="bg-gray-800 text-white rounded-md px-4 py-2"
                      value={sortCriteria}
                      onChange={(e) => setSortCriteria(e.target.value)}
                    >
                      <option value="date">Date</option>
                      <option value="likes">Likes</option>
                    </select>
                    <label htmlFor="sortOrder" className="sr-only">
                      Order
                    </label>
                    <select
                      id="sortOrder"
                      className="bg-gray-800 text-white rounded-md px-4 py-2"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    {activeTab === 'posts' && (
                      <div>
                        <h2 className="text-xl font-semibold text-white">Posts</h2>
                        <ul className="mt-2 space-y-2">
                          {userPosts === null ? (
                            <p className="text-gray-400">Loading...</p>
                          ) : userPosts.length > 0 ? (
                            sortedPosts.map((post) => (
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
                                    <p className="text-gray-400 text-sm">
                                      {post.likeCount} {post.likeCount === 1 ? 'Like' : 'Likes'}
                                    </p>
                                  </div>
                                </div>
                                <Link to={`/post/${post._id}`}>
                                  <p className="mt-2 text-white hover:underline">{post.content}</p>
                                </Link>
                              </li>
                            ))
                          ) : (
                            <p className="text-gray-400">No posts available</p>
                          )}
                        </ul>
                      </div>
                    )}
                    {activeTab === 'friends' && (
                      <div>
                        <h2 className="text-xl font-semibold text-white">Friends</h2>
                        <ul className="mt-2 space-y-2">
                          {userFriends === null ? (
                            <p className="text-gray-400">Loading...</p>
                          ) : userFriends.length > 0 ? (
                            userFriends.map((friend) => (
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
                            ))
                          ) : (
                            <p className="text-gray-400">No friends available</p>
                          )}
                        </ul>
                      </div>
                    )}
                    {activeTab === 'comments' && (
                      <div>
                        <h2 className="text-xl font-semibold text-white">Comments</h2>
                        <ul className="mt-2 space-y-2">
                          {userComments === null ? (
                            <p className="text-gray-400">Loading...</p>
                          ) : userComments.length > 0 ? (
                            sortedComments.map((comment) => (
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
                            ))
                          ) : (
                            <p className="text-gray-400">No comments available</p>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
