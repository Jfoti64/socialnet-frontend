import { render, screen, fireEvent, act } from '@testing-library/react';
import Post from '../components/post/Post';
import { AuthContext } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { getCommentsForPost, toggleLike } from '../api'; // Add this import

vi.mock('../api', () => ({
  toggleLike: vi.fn(),
  getCommentsForPost: vi.fn(),
  createComment: vi.fn(),
}));

describe('Post', () => {
  const mockPost = {
    _id: '1',
    author: { firstName: 'John', lastName: 'Doe', profilePicture: '' },
    content: 'First post',
    createdAt: new Date().toISOString(),
    likes: 0,
    isLiked: false,
  };

  beforeEach(() => {
    vi.mocked(getCommentsForPost).mockResolvedValue([]);
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

    // Simulate liking a post
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /like/i }));
    });

    expect(vi.mocked(toggleLike)).toHaveBeenCalledWith('1');
  });
});
