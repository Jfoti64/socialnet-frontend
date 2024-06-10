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
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userInfo) => {
  const response = await api.post('/auth/register', userInfo);
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

// Other APIs (posts, users, etc.) can be added here similarly
