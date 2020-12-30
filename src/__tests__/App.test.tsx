import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders landing page', () => {
  render(<App />);
  const linkElement = screen.getByText(/You don't have any accounts yet/i);
  expect(linkElement).toBeInTheDocument();
});
