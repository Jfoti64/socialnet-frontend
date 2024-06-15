import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { describe, it, expect } from 'vitest';

describe('LoadingSpinner', () => {
  it('renders the loading spinner', () => {
    render(<LoadingSpinner loading={true} />);

    const spinnerElement = screen.getByTestId('loading-spinner');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('does not render the spinner when loading is false', () => {
    render(<LoadingSpinner loading={false} />);

    const spinnerElement = screen.queryByTestId('loading-spinner');
    expect(spinnerElement).not.toBeInTheDocument();
  });
});
