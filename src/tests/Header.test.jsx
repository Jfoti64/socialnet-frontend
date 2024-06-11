import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../components/common/Header';
import { AuthContext } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('Header', () => {
  it('renders and interacts correctly', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{ user: { id: '1', name: 'Test User' }, isCheckingAuth: false }}
        >
          <Header />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Simulate a user interaction
    fireEvent.change(screen.getByPlaceholderText(/Search Users.../i), {
      target: { value: 'search text' },
    });
    expect(screen.getByPlaceholderText(/Search Users.../i).value).toBe('search text');
  });
});
