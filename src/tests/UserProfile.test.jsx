import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserProfile from '../pages/UserProfile';
import {
  getUserProfile,
  getUserPosts,
  getUserFriends,
  getUserComments,
  getPost,
  getFriendRequests,
} from '../api';
import { AuthContext } from '../context/AuthContext';
import { describe, it, vi, expect } from 'vitest';

// Ensure mocks are correctly set up
vi.mock('../api', () => ({
  getUserProfile: vi.fn(),
  getUserPosts: vi.fn(),
  getUserFriends: vi.fn(),
  getUserComments: vi.fn(),
  getPost: vi.fn(),
  getFriendRequests: vi.fn(),
}));

// Mock data
const mockUserProfile = {
  _id: 'user2', // User being viewed
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  profilePicture: 'https://example.com/profile2.jpg',
  friends: ['user1'], // Ensure user1 is a friend
};

const mockAuthUserProfile = {
  _id: 'user1', // Authenticated user
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  profilePicture: 'https://example.com/profile.jpg',
  friends: ['user2'], // Ensure user2 is a friend
};

const mockUserPosts = [
  {
    _id: 'post1',
    content: 'Hello, world!',
    createdAt: '2023-06-15T00:00:00Z',
    likeCount: 5,
    author: mockUserProfile,
  },
  {
    _id: 'post2',
    content: 'Second post!',
    createdAt: '2023-06-14T00:00:00Z',
    likeCount: 10,
    author: mockUserProfile,
  },
  {
    _id: 'post3',
    content: 'Third post!',
    createdAt: '2023-06-13T00:00:00Z',
    likeCount: 2,
    author: mockUserProfile,
  },
];

const mockUserFriends = [
  {
    _id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: 'https://example.com/profile.jpg',
  },
];

const mockUserComments = [
  {
    _id: 'comment1',
    content: 'Nice post!',
    createdAt: '2023-06-15T00:00:00Z',
    author: mockUserProfile,
    post: 'post1',
  },
];

const mockPost = {
  _id: 'post1',
  content: 'Hello, world!',
  createdAt: '2023-06-15T00:00:00Z',
  likeCount: 5,
  author: mockUserProfile,
};

const mockFriendRequests = [
  {
    requester: {
      _id: 'user1',
      firstName: 'John',
      lastName: 'Doe',
    },
  },
];

const mockAuth = {
  user: { id: 'user1' },
  isCheckingAuth: false,
  logout: vi.fn(),
};

// Mock API responses
getUserProfile.mockImplementation((userId) => {
  if (userId === 'user1') {
    return Promise.resolve(mockAuthUserProfile);
  }
  return Promise.resolve(mockUserProfile);
});
getUserPosts.mockResolvedValue(mockUserPosts);
getUserFriends.mockResolvedValue(mockUserFriends);
getUserComments.mockResolvedValue(mockUserComments);
getPost.mockResolvedValue(mockPost);
getFriendRequests.mockResolvedValue(mockFriendRequests);

describe('UserProfile', () => {
  it('renders loading state while fetching data', async () => {
    getUserProfile.mockResolvedValueOnce(
      new Promise((resolve) => setTimeout(() => resolve(mockUserProfile), 50000))
    ); // Simulate loading with delay
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders user profile information', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      const profileHeader = screen.getByRole('heading', { name: /jane doe/i });
      expect(profileHeader).toBeInTheDocument();
      const emailElement = screen.getByText('jane.doe@example.com');
      expect(emailElement).toBeInTheDocument();
    });
  });

  it('renders user friends', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    // Ensure the friends tab button is rendered
    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: /friends/i,
        })
      ).toBeInTheDocument();
    });

    // Click the friends tab button
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /friends/i }));
    });

    // Check if the friends are rendered
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('renders user comments', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    // Ensure the comments tab button is rendered
    await waitFor(() => {
      expect(
        screen.getByRole('button', {
          name: /comments/i,
        })
      ).toBeInTheDocument();
    });

    // Click the comments tab button
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /comments/i }));
    });

    // Check if the comments are rendered
    await waitFor(() => {
      expect(screen.getByText('Nice post!')).toBeInTheDocument();
    });
  });

  it('sorts posts by date in ascending order', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    // Select the "Date" sort criteria and "Ascending" order
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Sort by'), {
        target: { value: 'date' },
      });
      fireEvent.change(screen.getByLabelText('Order'), {
        target: { value: 'asc' },
      });
    });

    // Check if the posts are sorted by date in ascending order
    await waitFor(() => {
      const postDates = screen.getAllByText(/2023/).map((node) => new Date(node.textContent));
      expect(postDates).toEqual(postDates.slice().sort((a, b) => a - b));
    });
  });

  it('displays an error message if fetching user profile fails', async () => {
    getUserProfile.mockRejectedValueOnce(new Error('Failed to fetch user profile'));
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error fetching user profile')).toBeInTheDocument();
    });
  });

  it('renders sorted posts by likes in descending order', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    // Select the "Likes" sort criteria and "Descending" order
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Sort by'), {
        target: { value: 'likes' },
      });
      fireEvent.change(screen.getByLabelText('Order'), {
        target: { value: 'desc' },
      });
    });

    // Check if the posts are sorted by likes in descending order
    await waitFor(() => {
      const postLikeElements = screen.getAllByText(/\d+ Likes?/);

      const postLikes = postLikeElements
        .map((node) => {
          const match = node.textContent.match(/(\d+) Likes?/);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((likeCount) => likeCount !== null);

      expect(postLikes).toEqual([10, 5, 2]);
    });
  });

  it.skip('sorts comments by likes in descending order', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    fireEvent.click(screen.getByRole('button', { name: /comments/i }));
    await act(async () => {
      fireEvent.change(screen.getByLabelText('Sort by'), {
        target: { value: 'likes' },
      });
      fireEvent.change(screen.getByLabelText('Order'), {
        target: { value: 'desc' },
      });
    });

    await waitFor(() => {
      const commentLikeElements = screen.getAllByText(/\d+ Likes?/);
      const commentLikes = commentLikeElements
        .map((node) => {
          const match = node.textContent.match(/(\d+) Likes?/);
          return match ? parseInt(match[1], 10) : null;
        })
        .filter((likeCount) => likeCount !== null);

      expect(commentLikes).toEqual([10, 5, 2]);
    });
  });

  it('displays an error message if fetching user profile fails', async () => {
    getUserProfile.mockRejectedValueOnce(new Error('Failed to fetch user profile'));

    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error fetching user profile')).toBeInTheDocument();
    });
  });

  it('renders profile picture, name, and email', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      const profilePictures = screen.getAllByAltText('Jane Doe');
      expect(profilePictures.length).toBeGreaterThan(0); // Ensure at least one profile picture is rendered

      const profileName = screen.getAllByText('Jane Doe');
      expect(profileName.length).toBeGreaterThan(0); // Ensure at least one name is rendered

      const profileEmail = screen.getByText('jane.doe@example.com');
      expect(profileEmail).toBeInTheDocument();
    });
  });

  it('renders the correct tab content when switching tabs', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /friends/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /friends/i }));
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /comments/i }));
    await waitFor(() => {
      expect(screen.getByText('Nice post!')).toBeInTheDocument();
    });
  });

  it('renders empty state messages for posts, friends, and comments', async () => {
    getUserPosts.mockResolvedValueOnce([]);
    getUserFriends.mockResolvedValueOnce([]);
    getUserComments.mockResolvedValueOnce([]);

    await act(async () => {
      render(
        <BrowserRouter>
          <AuthContext.Provider value={mockAuth}>
            <UserProfile />
          </AuthContext.Provider>
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /posts/i }));
      expect(screen.getByText('No posts available')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /friends/i }));
      expect(screen.getByText('No friends available')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /comments/i }));
      expect(screen.getByText('No comments available')).toBeInTheDocument();
    });
  });
});
