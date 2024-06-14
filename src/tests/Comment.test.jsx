import { render, screen } from '@testing-library/react';
import Comment from '../components/post/Comment';

describe('Comment Component', () => {
  const author = {
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: 'http://example.com/profile.jpg',
  };
  const content = 'This is a comment';
  const createdAt = '2023-05-15T00:00:00Z';

  it('renders the author name correctly', () => {
    render(<Comment author={author} content={content} createdAt={createdAt} />);
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('renders the comment content correctly', () => {
    render(<Comment author={author} content={content} createdAt={createdAt} />);
    expect(screen.getByText(/This is a comment/i)).toBeInTheDocument();
  });

  it('renders the created date correctly', () => {
    render(<Comment author={author} content={content} createdAt={createdAt} />);
    const expectedDate = new Date(createdAt).toLocaleDateString();
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it('renders the profile picture when available', () => {
    render(<Comment author={author} content={content} createdAt={createdAt} />);
    const profilePicture = screen.getByAltText('Profile');
    expect(profilePicture).toBeInTheDocument();
    expect(profilePicture).toHaveAttribute('src', author.profilePicture);
  });

  it('does not render the profile picture when not available', () => {
    const authorWithoutProfilePicture = {
      ...author,
      profilePicture: null,
    };
    render(
      <Comment author={authorWithoutProfilePicture} content={content} createdAt={createdAt} />
    );
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
  });
});
