import { render, screen, fireEvent, waitFor, act, cleanup } from '@testing-library/react';
import Header from '../components/common/Header';
import * as api from '../api';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the API functions
vi.mock('../api', () => ({
  getFriendRequests: vi.fn(),
  searchUsers: vi.fn(),
  acceptFriendRequest: vi.fn(),
  rejectFriendRequest: vi.fn(),
}));

describe('Header Component', () => {
  const refreshPosts = vi.fn();

  beforeEach(() => {
    api.getFriendRequests.mockResolvedValue([]);
    api.searchUsers.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers(); // Restore real timers after each test
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

  it('shows notification when a friend request is accepted', async () => {
    const friendRequests = [{ requester: { _id: '1', firstName: 'John', lastName: 'Doe' } }];
    api.getFriendRequests.mockResolvedValue(friendRequests);
    api.acceptFriendRequest.mockResolvedValue({});

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

    await act(async () => {
      fireEvent.click(screen.getByText('Accept'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Friend request accepted/i)).toBeInTheDocument();
    });
  });

  it('shows notification when a friend request is rejected', async () => {
    const friendRequests = [{ requester: { _id: '1', firstName: 'John', lastName: 'Doe' } }];
    api.getFriendRequests.mockResolvedValue(friendRequests);
    api.rejectFriendRequest.mockResolvedValue({});

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

    await act(async () => {
      fireEvent.click(screen.getByText('Decline'));
    });

    await waitFor(() => {
      expect(screen.getByText(/Friend request rejected/i)).toBeInTheDocument();
    });
  });

  it('toggles compose form visibility', async () => {
    let showForm = false;
    const toggleForm = () => {
      showForm = !showForm;
    };

    await act(async () => {
      render(
        <Header
          showForm={showForm}
          onComposeClick={toggleForm}
          refreshPosts={refreshPosts}
          showComposeButton={true}
        />
      );
    });

    const composeButton = screen.getByText(/Compose/i);
    fireEvent.click(composeButton);
    await waitFor(() => {
      expect(showForm).toBe(true);
    });

    fireEvent.click(composeButton);
    await waitFor(() => {
      expect(showForm).toBe(false);
    });
  });

  it('closes notifications dropdown when clicking outside', async () => {
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

    const bellButton = screen.getByRole('button', { name: /Notifications/i });
    await act(async () => {
      fireEvent.click(bellButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText(/John Doe/i)).not.toBeInTheDocument();
    });
  });

  it('displays search results and navigates correctly', async () => {
    const searchResults = [
      {
        _id: '1',
        firstName: 'Jane',
        lastName: 'Doe',
        profilePicture: '',
        email: 'jane@example.com',
      },
    ];
    api.searchUsers.mockResolvedValue(searchResults);

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' },
    });

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
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    await waitFor(() => {
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/jane@example.com/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Jane Doe/i));
    expect(window.location.href).toBe('/profile/1');
  });

  it('handles API errors gracefully', async () => {
    api.getFriendRequests.mockRejectedValue(new Error('API Error'));
    api.searchUsers.mockRejectedValue(new Error('API Error'));

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

    // Verify error handling for friend requests
    await waitFor(() => {
      expect(screen.getByText(/Error fetching friend requests/i)).toBeInTheDocument();
    });

    // Verify error handling for search users
    const searchInput = screen.getByPlaceholderText(/Search Users.../i);
    fireEvent.change(searchInput, { target: { value: 'Error' } });

    await waitFor(() => {
      expect(screen.queryByText(/Error searching users/i)).toBeInTheDocument();
    });
  });

  it('clears search results when search input is cleared', async () => {
    const searchResults = [
      {
        _id: '1',
        firstName: 'Jane',
        lastName: 'Doe',
        profilePicture: '',
        email: 'jane@example.com',
      },
    ];
    api.searchUsers.mockResolvedValue(searchResults);

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
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    await waitFor(() => {
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.queryByText(/Jane Doe/i)).not.toBeInTheDocument();
    });
  });

  it('handles search input with special characters', async () => {
    const searchResults = [
      {
        _id: '1',
        firstName: 'Jane',
        lastName: 'Doe',
        profilePicture: '',
        email: 'jane@example.com',
      },
    ];
    api.searchUsers.mockResolvedValue(searchResults);

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
    fireEvent.change(searchInput, { target: { value: '@Jane!' } });

    await waitFor(() => {
      expect(api.searchUsers).toHaveBeenCalledWith('@Jane!');
      expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching friend requests', async () => {
    api.getFriendRequests.mockImplementation(() => new Promise(() => {})); // Never resolves

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

    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Notifications/i }));
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  it('displays loading state while searching users', async () => {
    api.searchUsers.mockImplementation(() => new Promise(() => {})); // Never resolves

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
    fireEvent.change(searchInput, { target: { value: 'Jane' } });

    await waitFor(() => {
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
  });

  it('handles no search results gracefully', async () => {
    api.searchUsers.mockResolvedValue([]);

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
    fireEvent.change(searchInput, { target: { value: 'NoMatch' } });

    await waitFor(() => {
      expect(screen.getByText(/No users found/i)).toBeInTheDocument();
    });
  });

  it('handles a large number of search results', async () => {
    const searchResults = Array.from({ length: 100 }, (_, index) => ({
      _id: index.toString(),
      firstName: `User${index}`,
      lastName: 'Test',
      profilePicture: '',
      email: `user${index}@example.com`,
    }));
    api.searchUsers.mockResolvedValue(searchResults);

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
    fireEvent.change(searchInput, { target: { value: 'User' } });

    await waitFor(() => {
      expect(screen.getByText(/User0 Test/i)).toBeInTheDocument();
      expect(screen.getByText(/User99 Test/i)).toBeInTheDocument();
    });
  });

  it('cleans up event listeners and timeouts after each test', async () => {
    const spyAddEventListener = vi.spyOn(document, 'addEventListener');
    const spyRemoveEventListener = vi.spyOn(document, 'removeEventListener');

    const { unmount } = render(
      <Header
        showForm={false}
        onComposeClick={() => {}}
        refreshPosts={refreshPosts}
        showComposeButton={true}
      />
    );

    // Ensure the event listener is added
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Notifications/i }));
    });

    expect(spyAddEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));

    // Unmount the component to trigger cleanup
    unmount();

    // Ensure the event listener is removed
    expect(spyRemoveEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
  });
});
