import axios from 'axios';

// Set the base URL for the API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials with requests
});

// Request interceptor to include the token in the headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication APIs
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Login failed in API:', error.response); // Log the error response
      throw error; // Propagate the full error response
    }
    throw error; // Propagate the full error
  }
};

export const register = async (userInfo) => {
  const response = await api.post('/auth/register', userInfo);
  return response.data;
};

export const getPost = async (postId) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const getFeedPosts = async () => {
  const response = await api.get('/posts/feed');
  return response.data;
};

export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

export const getCommentsForPost = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

export const toggleLike = async (postId) => {
  const response = await api.post(`/posts/${postId}/toggle-like`);
  return response.data;
};

export const createComment = async (postId, content) => {
  const response = await api.post(`/posts/${postId}/comments`, { content });
  return response.data;
};

export const sendFriendRequest = async (recipientId) => {
  const response = await api.post('/users/friend-request', { recipientId });
  return response.data;
};

export const getFriendRequests = async () => {
  const response = await api.get('/users/friend-requests');
  return response.data;
};

export const acceptFriendRequest = async (requesterId) => {
  const response = await api.post('/users/accept-friend-request', { requesterId });
  return response.data;
};

export const rejectFriendRequest = async (requesterId) => {
  const response = await api.post('/users/reject-friend-request', { requesterId });
  return response.data;
};

export const searchUsers = async (searchTerm) => {
  const response = await api.get(`/users/search?q=${searchTerm}`);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await api.get(`/users/profile/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId, data) => {
  const response = await api.put(`/me`, data);
  return response.data;
};

export const getUserPosts = async (userId) => {
  const response = await api.get(`/users/profile/${userId}/posts`);
  return response.data;
};

export const getUserFriends = async (userId) => {
  const response = await api.get(`/users/profile/${userId}/friends`);
  return response.data;
};

export const getUserComments = async (userId) => {
  const response = await api.get(`/users/profile/${userId}/comments`);
  return response.data;
};
