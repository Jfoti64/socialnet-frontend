import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import PostPage from '../pages/PostPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { getPost, getCommentsForPost, toggleLike, getFriendRequests } from '../api';
import { vi } from 'vitest';
import { AuthContext } from '../context/AuthContext';

// Mock the API functions
vi.mock('../api', () => ({
  getPost: vi.fn(),
  getCommentsForPost: vi.fn(),
  toggleLike: vi.fn(),
  getFriendRequests: vi.fn(), // Mock getFriendRequests
}));

const mockPost = {
  _id: '1',
  author: { _id: 'author1', firstName: 'John', lastName: 'Doe', profilePicture: '' },
  content: 'This is a mock post',
  createdAt: new Date().toISOString(),
  likes: ['author1'],
};

const mockComments = [
  {
    _id: 'comment1',
    author: { _id: 'commenter1', firstName: 'Jane', lastName: 'Smith', profilePicture: '' },
    content: 'This is a mock comment',
    createdAt: new Date().toISOString(),
  },
];

const mockAuthContext = {
  user: { id: 'author1', name: 'John Doe' },
  logout: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  isCheckingAuth: false,
  authError: null,
};

describe('PostPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders post and comments correctly', async () => {
    vi.mocked(getPost).mockResolvedValue(mockPost);
    vi.mocked(getCommentsForPost).mockResolvedValue(mockComments);
    vi.mocked(getFriendRequests).mockResolvedValue([]);

    await act(async () => {
      render(
        <AuthContext.Provider value={mockAuthContext}>
          <MemoryRouter initialEntries={['/post/1']}>
            <Routes>
              <Route path="/post/:postId" element={<PostPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );
    });

    expect(await screen.findByText(/This is a mock post/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/This is a mock comment/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  });

  it('toggles like on post', async () => {
    vi.mocked(getPost).mockResolvedValue(mockPost);
    vi.mocked(getCommentsForPost).mockResolvedValue(mockComments);
    vi.mocked(toggleLike).mockResolvedValue({});
    vi.mocked(getFriendRequests).mockResolvedValue([]);

    await act(async () => {
      render(
        <AuthContext.Provider value={mockAuthContext}>
          <MemoryRouter initialEntries={['/post/1']}>
            <Routes>
              <Route path="/post/:postId" element={<PostPage />} />
            </Routes>
          </MemoryRouter>
        </AuthContext.Provider>
      );
    });

    const likeButton = await screen.findByRole('button', { name: /1 Like/i });
    expect(likeButton).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(likeButton);
    });

    expect(toggleLike).toHaveBeenCalledWith('1');
    expect(await screen.findByRole('button', { name: /0 Likes/i })).toBeInTheDocument();
  });
});
