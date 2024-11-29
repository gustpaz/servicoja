'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { ProfessionalCard } from '../components/professional-card'
import { SEO } from '../components/SEO'
import api from '../services/api'
import debounce from 'lodash/debounce'

interface Professional {
  _id: string
  userId: {
    _id: string
    name: string
  }
  profession: string
  description: string
  hourlyRate: number
  rating: number
  featuredUntil: string | null
}

export default function BuscaPage() {
  const [query, setQuery] = useState('')
  const [professionals, setProfessionals] = useState<Professional[]>([])

  const debouncedQuery = useCallback(debounce((q: string) => {
    setQuery(q)
  }, 300), [])

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await api.get('/professionals', { params: { query } })
        const sortedProfessionals = response.data.sort((a: Professional, b: Professional) => {
          if (a.featuredUntil && b.featuredUntil) {
            return new Date(b.featuredUntil).getTime() - new Date(a.featuredUntil).getTime()
          } else if (a.featuredUntil) {
            return -1
          } else if (b.featuredUntil) {
            return 1
          }
          return b.rating - a.rating
        })
        setProfessionals(sortedProfessionals)
      } catch (error) {
        console.error('Error fetching professionals:', error)
      }
    }
    fetchProfessionals()
  }, [query])

  return (
    <>
      <SEO 
        title="Buscar Serviços"
        description="Encontre os melhores profissionais para seus serviços no ServiçoJá. Busque por nome, profissão ou tipo de serviço."
        canonical="https://servicoja.com/busca"
      />
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Buscar Serviços</h1>
        <div className="flex items-center space-x-2">
          <Input 
            type="text" 
            placeholder="Digite um serviço ou profissional" 
            onChange={(e) => debouncedQuery(e.target.value)}
          />
          <Button size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {professionals.map((pro) => (
            <ProfessionalCard key={pro._id} professional={pro} />
          ))}
        </div>
      </div>
    </>
  )
}

