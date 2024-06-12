import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Header from '../components/common/Header';
import * as api from '../api';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the API functions
vi.mock('../api', () => ({
  getFriendRequests: vi.fn(),
  searchUsers: vi.fn(),
}));

describe('Header Component', () => {
  const refreshPosts = vi.fn();

  beforeEach(() => {
    api.getFriendRequests.mockResolvedValue([]);
    api.searchUsers.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Header component', async () => {
    await act(async () => {
      render(
        <Header
          showForm={false}
          onComposeClick={() => {}}
          refreshPosts={refreshPosts}
          showComposeButton={true}
        />
      );
    });
    expect(screen.getByPlaceholderText(/Search Users.../i)).toBeInTheDocument();
  });

  it('handles search input', async () => {
    await act(async () => {
      render(
        <Header
          showForm={false}
          onComposeClick={() => {}}
          refreshPosts={refreshPosts}
          showComposeButton={true}
        />
      );
    });

    const searchInput = screen.getByPlaceholderText(/Search Users.../i);
    fireEvent.change(searchInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(api.searchUsers).toHaveBeenCalledWith('John');
    });
  });

  it('displays friend requests', async () => {
    const friendRequests = [{ requester: { _id: '1', firstName: 'John', lastName: 'Doe' } }];
    api.getFriendRequests.mockResolvedValue(friendRequests);

    await act(async () => {
      render(
        <Header
          showForm={false}
          onComposeClick={() => {}}
          refreshPosts={refreshPosts}
          showComposeButton={true}
        />
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Notifications/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });
  });
});
