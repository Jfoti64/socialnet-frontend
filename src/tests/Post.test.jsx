import { render, screen, fireEvent, act } from '@testing-library/react';
import Post from '../components/post/Post';
import { AuthContext } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { getCommentsForPost, toggleLike, createComment } from '../api'; // Import the API functions

// Mock the API functions
vi.mock('../api', () => ({
  toggleLike: vi.fn(),
  getCommentsForPost: vi.fn(),
  createComment: vi.fn(),
}));

describe('Post Component', () => {
  const mockPost = {
    _id: '1',
    author: { _id: '2', firstName: 'John', lastName: 'Doe', profilePicture: '' },
    content: 'First post',
    createdAt: '2023-05-15T00:00:00Z',
    likes: 0,
    isLiked: false,
  };

  beforeEach(() => {
    vi.mocked(getCommentsForPost).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders and interacts correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider
            value={{ user: { id: '1', name: 'Test User' }, isCheckingAuth: false }}
          >
            <Post
              author={mockPost.author}
              content={mockPost.content}
              createdAt={mockPost.createdAt}
              profilePicture={mockPost.author.profilePicture}
              postId={mockPost._id}
              likeCount={mockPost.likes}
              initialIsLiked={mockPost.isLiked}
            />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    // Verify the post content is rendered
    expect(screen.getByText('First post')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    // Adjust the date format to match what is rendered
    expect(screen.getByText(/5\/14\/2023|5\/15\/2023/i)).toBeInTheDocument();

    // Verify the initial like count
    expect(screen.getByText('0 Likes')).toBeInTheDocument();

    // Simulate liking the post
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /like/i }));
    });

    // Verify the like toggle API is called
    expect(toggleLike).toHaveBeenCalledWith('1');
    // Verify the like count is updated
    expect(screen.getByText('1 Like')).toBeInTheDocument();
  });

  it('shows and hides comments', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider
            value={{ user: { id: '1', name: 'Test User' }, isCheckingAuth: false }}
          >
            <Post
              author={mockPost.author}
              content={mockPost.content}
              createdAt={mockPost.createdAt}
              profilePicture={mockPost.author.profilePicture}
              postId={mockPost._id}
              likeCount={mockPost.likes}
              initialIsLiked={mockPost.isLiked}
            />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    // Verify comments are not shown initially
    expect(screen.queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();

    // Simulate showing comments
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /comment/i }));
    });

    // Verify the comment input is displayed
    expect(screen.getByPlaceholderText('Add a comment...')).toBeInTheDocument();

    // Simulate hiding comments
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /comment/i }));
    });

    // Verify comments are hidden
    expect(screen.queryByPlaceholderText('Add a comment...')).not.toBeInTheDocument();
  });

  it('handles adding a comment', async () => {
    vi.mocked(createComment).mockResolvedValue({});

    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider
            value={{ user: { id: '1', name: 'Test User' }, isCheckingAuth: false }}
          >
            <Post
              author={mockPost.author}
              content={mockPost.content}
              createdAt={mockPost.createdAt}
              profilePicture={mockPost.author.profilePicture}
              postId={mockPost._id}
              likeCount={mockPost.likes}
              initialIsLiked={mockPost.isLiked}
            />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    // Simulate showing comments
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /comment/i }));
    });

    // Simulate adding a comment
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Add a comment...'), {
        target: { value: 'New comment' },
      });
      fireEvent.submit(screen.getByPlaceholderText('Add a comment...').closest('form'));
    });

    // Verify the create comment API is called
    expect(createComment).toHaveBeenCalledWith('1', 'New comment');
    // Verify the comment input is cleared
    expect(screen.getByPlaceholderText('Add a comment...').value).toBe('');
  });
});
