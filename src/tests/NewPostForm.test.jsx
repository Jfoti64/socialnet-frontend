import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewPostForm from '../components/post/NewPostForm';

describe('NewPostForm', () => {
  const mockCreatePost = vi.fn();

  beforeEach(() => {
    mockCreatePost.mockClear();
  });

  test('renders NewPostForm component', () => {
    render(<NewPostForm onCreatePost={mockCreatePost} />);

    expect(screen.getByPlaceholderText(/What's on your mind?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument();
  });

  test('displays error when trying to submit an empty post', async () => {
    render(<NewPostForm onCreatePost={mockCreatePost} />);

    fireEvent.click(screen.getByRole('button', { name: /post/i }));

    expect(await screen.findByText(/Post content cannot be empty/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText(/Post content cannot be empty/i)).not.toBeInTheDocument();
      },
      { timeout: 4000 }
    ); // Wait 4 seconds to ensure the error message disappears
  });

  test('calls onCreatePost with content when submitting a valid post', async () => {
    render(<NewPostForm onCreatePost={mockCreatePost} />);

    const textarea = screen.getByPlaceholderText(/What's on your mind?/i);
    await userEvent.type(textarea, 'This is a test post');

    console.log('Textarea value before submit:', textarea.value);

    fireEvent.click(screen.getByRole('button', { name: /post/i }));

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith('This is a test post');
    });

    console.log('mockCreatePost calls:', mockCreatePost.mock.calls);
    expect(textarea).toHaveValue(''); // Check if the textarea is cleared after submission
  });
});
