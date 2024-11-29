import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { Rating } from '../../components/ui/rating'

describe('Rating', () => {
  it('renders correct number of stars', () => {
    const handleChange = jest.fn()
    render(<Rating value={3} onChange={handleChange} max={5} />)

    const stars = screen.getAllByRole('button')
    expect(stars).toHaveLength(5)
  })

  it('calls onChange with correct value when star is clicked', () => {
    const handleChange = jest.fn()
    render(<Rating value={3} onChange={handleChange} max={5} />)

    const stars = screen.getAllByRole('button')
    fireEvent.click(stars[2])

    expect(handleChange).toHaveBeenCalledWith(3)
  })

  it('renders correct number of filled stars', () => {
    const handleChange = jest.fn()
    render(<Rating value={3} onChange={handleChange} max={5} />)

    const filledStars = screen.getAllByTestId('filled-star')
    expect(filledStars).toHaveLength(3)
  })
})

