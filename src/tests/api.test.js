import { vi } from 'vitest';
import axios from 'axios';
import * as api from '../api';

// Mock axios and its create method
vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal();

  // Create mock instance methods
  const mockAxiosInstance = {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
    },
  };

  // Return the original axios object with the mocked create method
  return {
    ...actual,
    create: vi.fn(() => mockAxiosInstance),
    default: {
      ...actual.default,
      create: vi.fn(() => mockAxiosInstance),
    },
  };
});

describe('API functions', () => {
  let mockAxiosInstance;

  beforeAll(() => {
    mockAxiosInstance = axios.create();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const mockToken = 'mockToken';

  beforeEach(() => {
    localStorage.setItem('authToken', mockToken);
  });

  afterEach(() => {
    localStorage.removeItem('authToken');
  });

  it('should call login API', async () => {
    const mockData = { token: 'mockToken' };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const response = await api.login({ username: 'test', password: 'test' });

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
      username: 'test',
      password: 'test',
    });
  });

  it('should call register API', async () => {
    const mockData = { user: { id: '1', name: 'test' } };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const response = await api.register({ username: 'test', password: 'test' });

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', {
      username: 'test',
      password: 'test',
    });
  });

  it('should handle errors in API calls', async () => {
    const mockError = new Error('Network Error');
    mockAxiosInstance.post.mockRejectedValue(mockError);

    try {
      await api.login({ username: 'test', password: 'test' });
    } catch (error) {
      expect(error).toEqual(mockError);
    }

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
      username: 'test',
      password: 'test',
    });
  });

  it('should call getFeedPosts API', async () => {
    const mockData = [{ id: '1', content: 'Post 1' }];
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.getFeedPosts();

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/posts/feed');
  });

  it('should call createPost API', async () => {
    const mockData = { id: '1', content: 'New post' };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const response = await api.createPost({ content: 'New post' });

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/posts', { content: 'New post' });
  });

  it('should call getCommentsForPost API', async () => {
    const mockData = [{ id: '1', content: 'Comment 1' }];
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.getCommentsForPost('1');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/posts/1/comments');
  });

  it('should call toggleLike API', async () => {
    const mockData = { id: '1', liked: true };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const response = await api.toggleLike('1');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/posts/1/toggle-like');
  });

  it('should call createComment API', async () => {
    const mockData = { id: '1', content: 'New comment' };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const response = await api.createComment('1', 'New comment');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/posts/1/comments', {
      content: 'New comment',
    });
  });

  it('should call sendFriendRequest API', async () => {
    const mockData = { id: '1', status: 'pending' };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const response = await api.sendFriendRequest('1');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/friend-request', {
      recipientId: '1',
    });
  });

  it('should call getFriendRequests API', async () => {
    const mockData = [{ id: '1', status: 'pending' }];
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.getFriendRequests();

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/friend-requests');
  });

  it('should call acceptFriendRequest API', async () => {
    const mockData = { id: '1', status: 'accepted' };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const response = await api.acceptFriendRequest('1');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/accept-friend-request', {
      requesterId: '1',
    });
  });

  it('should call rejectFriendRequest API', async () => {
    const mockData = { id: '1', status: 'rejected' };
    mockAxiosInstance.post.mockResolvedValue({ data: mockData });

    const response = await api.rejectFriendRequest('1');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users/reject-friend-request', {
      requesterId: '1',
    });
  });

  it('should call searchUsers API', async () => {
    const mockData = [{ id: '1', name: 'User 1' }];
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.searchUsers('User');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/search?q=User');
  });

  it('should call getUserProfile API', async () => {
    const mockData = { id: '1', name: 'User 1' };
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.getUserProfile('1');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile/1');
  });

  it('should call updateUserProfile API', async () => {
    const mockData = { id: '1', name: 'Updated User' };
    mockAxiosInstance.put.mockResolvedValue({ data: mockData });

    const response = await api.updateUserProfile('1', { name: 'Updated User' });

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/me', { name: 'Updated User' });
  });

  it('should call getUserPosts API', async () => {
    const mockData = [{ id: '1', content: 'Post 1' }];
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.getUserPosts('1');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile/1/posts');
  });

  it('should call getUserFriends API', async () => {
    const mockData = [{ id: '1', name: 'Friend 1' }];
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.getUserFriends('1');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile/1/friends');
  });

  it('should call getUserComments API', async () => {
    const mockData = [{ id: '1', content: 'Comment 1' }];
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.getUserComments('1');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile/1/comments');
  });

  // Add additional tests for edge cases, such as empty responses or unexpected data formats
  it('should handle empty response from getFeedPosts API', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: [] });

    const response = await api.getFeedPosts();

    expect(response).toEqual([]);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/posts/feed');
  });

  it('should handle unexpected data format in getFeedPosts API', async () => {
    const mockData = { unexpectedKey: 'unexpectedValue' };
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.getFeedPosts();

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/posts/feed');
  });

  it('should handle invalid login credentials', async () => {
    const mockError = { response: { data: { message: 'Invalid credentials' } } };
    mockAxiosInstance.post.mockRejectedValue(mockError);

    try {
      await api.login({ username: 'wrong', password: 'wrong' });
    } catch (error) {
      expect(error.response.data.message).toBe('Invalid credentials');
    }

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
      username: 'wrong',
      password: 'wrong',
    });
  });

  it('should handle creating a post without content', async () => {
    const mockError = { response: { data: { message: 'Content is required' } } };
    mockAxiosInstance.post.mockRejectedValue(mockError);

    try {
      await api.createPost({});
    } catch (error) {
      expect(error.response.data.message).toBe('Content is required');
    }

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/posts', {});
  });

  it('should handle non-existent user profile', async () => {
    const mockError = { response: { data: { message: 'User not found' } } };
    mockAxiosInstance.get.mockRejectedValue(mockError);

    try {
      await api.getUserProfile('nonexistent');
    } catch (error) {
      expect(error.response.data.message).toBe('User not found');
    }

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile/nonexistent');
  });

  it('should handle empty search term', async () => {
    const mockData = []; // Expected response for an empty search term
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.searchUsers('');

    expect(response).toEqual(mockData);
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/search?q=');
  });

  it('should validate response structure for getFeedPosts API', async () => {
    const mockData = [{ id: '1', content: 'Post 1' }];
    mockAxiosInstance.get.mockResolvedValue({ data: mockData });

    const response = await api.getFeedPosts();

    expect(response).toEqual(mockData);
    expect(Array.isArray(response)).toBe(true);
    response.forEach((post) => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('content');
    });
  });

  it('should handle network errors gracefully', async () => {
    const mockError = new Error('Network Error');
    mockAxiosInstance.get.mockRejectedValue(mockError);

    try {
      await api.getFeedPosts();
    } catch (error) {
      expect(error).toEqual(mockError);
    }

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/posts/feed');
  });

  it('should enforce rate limiting', async () => {
    const mockError = { response: { status: 429, data: { message: 'Too many requests' } } };
    mockAxiosInstance.get.mockRejectedValue(mockError);

    try {
      await api.getFeedPosts();
    } catch (error) {
      expect(error.response.status).toBe(429);
      expect(error.response.data.message).toBe('Too many requests');
    }

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/posts/feed');
  });

  it('should handle invalid input data for createPost API', async () => {
    const mockError = { response: { data: { message: 'Invalid content' } } };
    mockAxiosInstance.post.mockRejectedValue(mockError);

    try {
      await api.createPost({ content: '' });
    } catch (error) {
      expect(error.response.data.message).toBe('Invalid content');
    }

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/posts', { content: '' });
  });

  it('should test unauthorized access for getUserProfile API', async () => {
    const mockError = { response: { status: 401, data: { message: 'Unauthorized' } } };
    mockAxiosInstance.get.mockRejectedValue(mockError);

    try {
      await api.getUserProfile('1');
    } catch (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe('Unauthorized');
    }

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/profile/1');
  });
});
