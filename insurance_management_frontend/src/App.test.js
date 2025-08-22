import { render, screen } from '@testing-library/react'
import App from './App'

test('renders navigation links', () => {
  render(<App />)
  // Navbar links should be present
  expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()
  expect(screen.getByText(/Policies/i)).toBeInTheDocument()
  expect(screen.getByText(/Claims/i)).toBeInTheDocument()
})
