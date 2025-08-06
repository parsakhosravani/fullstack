const React = require('react');
const { render, screen } = require('@testing-library/react');
const Welcome = require('../src/Welcome');

describe('Welcome Component', () => {
  test('renders welcome message with default name', () => {
    render(React.createElement(Welcome));
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our MERN stack application.')).toBeInTheDocument();
  });

  test('renders welcome message with custom name', () => {
    render(React.createElement(Welcome, { name: 'John' }));
    expect(screen.getByText('Hello, John!')).toBeInTheDocument();
    expect(screen.getByText('Welcome to our MERN stack application.')).toBeInTheDocument();
  });

  test('renders heading with correct tag', () => {
    render(React.createElement(Welcome, { name: 'Jane' }));
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Hello, Jane!');
  });
});