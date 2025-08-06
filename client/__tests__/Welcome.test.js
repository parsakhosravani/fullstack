import React from 'react';
import { render, screen } from '@testing-library/react';
import Welcome from '../src/Welcome';

describe('Welcome Component', () => {
  test('renders welcome message with default name', () => {
    render(<Welcome />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our MERN stack application.')).toBeInTheDocument();
  });

  test('renders welcome message with custom name', () => {
    render(<Welcome name="John" />);
    expect(screen.getByText('Hello, John!')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our MERN stack application.')).toBeInTheDocument();
  });

  test('renders heading with correct tag', () => {
    render(<Welcome name="Jane" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Hello, Jane!');
  });
});