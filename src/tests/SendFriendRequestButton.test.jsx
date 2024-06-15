import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import SendFriendRequestButton from '../components/common/SendFriendRequestButton';
import { sendFriendRequest, checkFriendRequestStatus } from '../api';

// Mock the API calls
vi.mock('../api', () => ({
  sendFriendRequest: vi.fn(),
  checkFriendRequestStatus: vi.fn(),
}));

describe('SendFriendRequestButton', () => {
  const recipientId = 'user2';

  it('renders the send friend request button', () => {
    checkFriendRequestStatus.mockResolvedValueOnce({ status: 'none' });
    render(<SendFriendRequestButton recipientId={recipientId} />);
    expect(screen.getByText('Send Friend Request')).toBeInTheDocument();
  });

  it('shows "Pending" when the friend request is successfully sent', async () => {
    checkFriendRequestStatus.mockResolvedValueOnce({ status: 'none' });
    sendFriendRequest.mockResolvedValueOnce({});
    render(<SendFriendRequestButton recipientId={recipientId} />);

    fireEvent.click(screen.getByText('Send Friend Request'));

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    expect(screen.queryByText('Send Friend Request')).not.toBeInTheDocument();
  });

  it('shows an error message when the friend request fails', async () => {
    const errorMessage = 'Friend request already sent';
    checkFriendRequestStatus.mockResolvedValueOnce({ status: 'none' });
    sendFriendRequest.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });
    render(<SendFriendRequestButton recipientId={recipientId} />);

    fireEvent.click(screen.getByText('Send Friend Request'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.queryByText('Send Friend Request')).toBeInTheDocument();
  });

  it('shows a default error message when the error response is not structured', async () => {
    checkFriendRequestStatus.mockResolvedValueOnce({ status: 'none' });
    sendFriendRequest.mockRejectedValueOnce(new Error('Network Error'));
    render(<SendFriendRequestButton recipientId={recipientId} />);

    fireEvent.click(screen.getByText('Send Friend Request'));

    await waitFor(() => {
      expect(screen.getByText('Error sending friend request')).toBeInTheDocument();
    });

    expect(screen.queryByText('Send Friend Request')).toBeInTheDocument();
  });

  it('shows "Pending" if the friend request status is already pending', async () => {
    checkFriendRequestStatus.mockResolvedValueOnce({ status: 'pending' });
    render(<SendFriendRequestButton recipientId={recipientId} />);

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    expect(screen.queryByText('Send Friend Request')).not.toBeInTheDocument();
  });

  it('does not show the send button if the users are already friends', async () => {
    checkFriendRequestStatus.mockResolvedValueOnce({ status: 'friends' });
    render(<SendFriendRequestButton recipientId={recipientId} />);

    await waitFor(() => {
      expect(screen.queryByText('Send Friend Request')).not.toBeInTheDocument();
      expect(screen.queryByText('Pending')).not.toBeInTheDocument();
    });
  });

  it('displays an error message if checking friend request status fails', async () => {
    const errorMessage = 'Error checking friend request status';
    checkFriendRequestStatus.mockRejectedValueOnce(new Error(errorMessage));
    render(<SendFriendRequestButton recipientId={recipientId} />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.queryByText('Error checking friend request status')).toBeInTheDocument();
  });
});
