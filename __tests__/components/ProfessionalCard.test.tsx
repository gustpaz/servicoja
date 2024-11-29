import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProfessionalCard } from '../../app/components/professional-card'

describe('ProfessionalCard', () => {
  const mockProfessional = {
    _id: '1',
    userId: {
      _id: 'user1',
      name: 'John Doe'
    },
    profession: 'Plumber',
    description: 'Experienced plumber with 10 years of experience',
    hourlyRate: 50,
    rating: 4.5
  }

  it('renders professional information correctly', () => {
    render(<ProfessionalCard professional={mockProfessional} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Plumber')).toBeInTheDocument()
    expect(screen.getByText('R$ 50/hora')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText(/Experienced plumber with 10 years of experience/)).toBeInTheDocument()
  })
})

