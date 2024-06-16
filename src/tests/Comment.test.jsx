import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Comment from '../components/post/Comment';
import { format } from 'date-fns';

describe('Comment Component', () => {
  const author = {
    _id: '123',
    firstName: 'John',
    lastName: 'Doe',
    profilePicture: 'http://example.com/profile.jpg',
  };
  const content = 'This is a comment';
  const createdAt = '2023-05-15T00:00:00Z';

  const renderComponent = (props) =>
    render(
      <MemoryRouter>
        <Comment {...props} />
      </MemoryRouter>
    );

  it('renders the author name correctly', () => {
    renderComponent({ author, content, createdAt });
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  it('renders the comment content correctly', () => {
    renderComponent({ author, content, createdAt });
    expect(screen.getByText(/This is a comment/i)).toBeInTheDocument();
  });

  it('renders the created date correctly', () => {
    renderComponent({ author, content, createdAt });
    const expectedDate = format(new Date(createdAt), 'PP');
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });

  it('renders the profile picture when available', () => {
    renderComponent({ author, content, createdAt });
    const profilePicture = screen.getByAltText('Profile');
    expect(profilePicture).toBeInTheDocument();
    expect(profilePicture).toHaveAttribute('src', author.profilePicture);
  });

  it('does not render the profile picture when not available', () => {
    const authorWithoutProfilePicture = {
      ...author,
      profilePicture: null,
    };
    renderComponent({ author: authorWithoutProfilePicture, content, createdAt });
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
  });
});
