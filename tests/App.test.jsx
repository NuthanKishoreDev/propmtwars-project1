import { getStatusColor } from '../src/lib/utils';
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../src/App'

// Mock the gemini library
vi.mock('../src/lib/gemini', () => ({
  analyzeFridgeImage: vi.fn(),
}))

describe('App', () => {
  it('renders the header and title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/FridgeHero/i)
    expect(screen.getByText(/universal bridge/i)).toBeInTheDocument()
  })

  it('renders the upload zone', () => {
    render(<App />)
    expect(screen.getByText(/Upload Fridge Photo/i)).toBeInTheDocument()
  })
})
