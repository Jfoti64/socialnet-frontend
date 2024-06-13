// src/tests/Dashboard.test.jsx
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { AuthContext } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { getFeedPosts, createPost, getFriendRequests, getCommentsForPost } from '../api';

// Mock the API functions
vi.mock('../api', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getFeedPosts: vi.fn(),
    createPost: vi.fn(),
    getFriendRequests: vi.fn(),
    getCommentsForPost: vi.fn(),
    acceptFriendRequest: vi.fn(),
    rejectFriendRequest: vi.fn(),
    searchUsers: vi.fn(),
    toggleLike: vi.fn(),
    createComment: vi.fn(),
  };
});

const renderWithAuth = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AuthContext.Provider {...providerProps}>{ui}</AuthContext.Provider>,
    renderOptions
  );
};

describe('Dashboard', () => {
  const mockPosts = [
    {
      _id: '1',
      author: { firstName: 'John', lastName: 'Doe', profilePicture: '' },
      content: 'First post',
      createdAt: new Date().toISOString(),
      likes: [],
      isLiked: false,
    },
    {
      _id: '2',
      author: { firstName: 'Jane', lastName: 'Doe', profilePicture: '' },
      content: 'Second post',
      createdAt: new Date().toISOString(),
      likes: [],
      isLiked: false,
    },
  ];

  beforeEach(() => {
    vi.mocked(getFeedPosts).mockResolvedValue(mockPosts);
    vi.mocked(getFriendRequests).mockResolvedValue([]);
    vi.mocked(getCommentsForPost).mockResolvedValue([]);
  });

  it('renders Dashboard components', async () => {
    await act(async () => {
      renderWithAuth(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>,
        {
          providerProps: { value: { user: { id: '1', name: 'Test User' }, isCheckingAuth: false } },
        }
      );
    });

    // Check if Sidebar is rendered
    expect(screen.getByText(/SocialNet/i)).toBeInTheDocument();

    // Check if Header is rendered
    expect(screen.getByPlaceholderText(/Search Users.../i)).toBeInTheDocument();

    // Wait for posts to be fetched and rendered
    await waitFor(() => expect(screen.getByText(/First post/i)).toBeInTheDocument());
    expect(screen.getByText(/Second post/i)).toBeInTheDocument();
  });

  it('fetches and displays posts', async () => {
    await act(async () => {
      renderWithAuth(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>,
        {
          providerProps: { value: { user: { id: '1', name: 'Test User' }, isCheckingAuth: false } },
        }
      );
    });

    // Wait for posts to be fetched and rendered
    await waitFor(() => expect(screen.getByText(/First post/i)).toBeInTheDocument());
    expect(screen.getByText(/Second post/i)).toBeInTheDocument();
  });

  it('creates a new post', async () => {
    await act(async () => {
      renderWithAuth(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>,
        {
          providerProps: { value: { user: { id: '1', name: 'Test User' }, isCheckingAuth: false } },
        }
      );
    });

    // Show the new post form
    fireEvent.click(screen.getByText(/Compose/i));
    expect(screen.getByPlaceholderText(/What's on your mind?/i)).toBeInTheDocument();

    // Fill out the form and submit
    fireEvent.change(screen.getByPlaceholderText(/What's on your mind?/i), {
      target: { value: 'New post content' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Post/i }));

    await waitFor(() => expect(createPost).toHaveBeenCalledWith({ content: 'New post content' }));
  });

  it('toggles NewPostForm visibility', async () => {
    await act(async () => {
      renderWithAuth(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>,
        {
          providerProps: { value: { user: { id: '1', name: 'Test User' }, isCheckingAuth: false } },
        }
      );
    });

    // Initially the form should not be visible
    expect(screen.queryByPlaceholderText(/What's on your mind?/i)).not.toBeInTheDocument();

    // Click the compose button to show the form
    await act(async () => {
      fireEvent.click(screen.getByText(/Compose/i));
    });
    expect(screen.getByPlaceholderText(/What's on your mind?/i)).toBeInTheDocument();

    // Click the compose button again to hide the form
    await act(async () => {
      fireEvent.click(screen.getByText(/Cancel/i));
    });
    expect(screen.queryByPlaceholderText(/What's on your mind?/i)).not.toBeInTheDocument();
  });

  it('displays an error message if fetching posts fails', async () => {
    getFeedPosts.mockRejectedValueOnce(new Error('Failed to fetch posts'));

    await act(async () => {
      renderWithAuth(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>,
        {
          providerProps: { value: { user: { id: '1', name: 'Test User' }, isCheckingAuth: false } },
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error fetching posts')).toBeInTheDocument();
    });
  });
});
