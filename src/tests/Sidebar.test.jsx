// src/tests/Sidebar.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import Sidebar from '../components/common/Sidebar';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Mock the useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock the useNavigate hook and partially mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Sidebar', () => {
  const mockLogout = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { id: 'user1' },
      logout: mockLogout,
    });
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the sidebar with correct links', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('navigates to the correct path and sets active state on link click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar />
      </MemoryRouter>
    );

    // Click on Profile link
    fireEvent.click(screen.getByText('Profile'));

    expect(screen.getByText('Profile').closest('li')).toHaveClass('bg-gray-700');
    expect(screen.getByText('Home').closest('li')).not.toHaveClass('bg-gray-700');

    // Click on Home link
    fireEvent.click(screen.getByText('Home'));

    expect(screen.getByText('Home').closest('li')).toHaveClass('bg-gray-700');
    expect(screen.getByText('Profile').closest('li')).not.toHaveClass('bg-gray-700');
  });

  it('calls logout and navigates to login on logout button click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Sidebar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
