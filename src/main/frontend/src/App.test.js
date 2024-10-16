import { render, screen } from '@testing-library/react';
import App from './App';
import VotingComponent from "./components/VotingComponent";

test('renders learn react link', () => {
  render(<VotingComponent />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
