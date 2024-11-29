'use client'

import { useState, useEffect } from 'react'
import { ProfessionalLayout } from '../../components/professional-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import api from '../../services/api'

interface FeaturedListingSettings {
  featuredListingPrice: number
  featuredListingDuration: number
}

export default function FeaturedListingPage() {
  const [settings, setSettings] = useState<FeaturedListingSettings | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings')
        setSettings({
          featuredListingPrice: response.data.featuredListingPrice,
          featuredListingDuration: response.data.featuredListingDuration,
        })
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handlePurchase = async () => {
    try {
      const response = await api.post('/professional/featured-listing')
      window.location.href = response.data.init_point
    } catch (error) {
      toast({
        title: "Erro ao processar pagamento",
        description: "Não foi possível iniciar o processo de pagamento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  if (!settings) {
    return <ProfessionalLayout>Carregando...</ProfessionalLayout>
  }

  return (
    <ProfessionalLayout>
      <h1 className="text-2xl font-bold mb-4">Destaque seu Perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Comprar Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Destaque seu perfil por {settings.featuredListingDuration} dias por apenas R$ {settings.featuredListingPrice.toFixed(2)}!
          </p>
          <p className="mb-4">
            Perfis em destaque aparecem no topo dos resultados de busca e têm maior visibilidade na plataforma.
          </p>
          <Button onClick={handlePurchase}>Comprar Destaque</Button>
        </CardContent>
      </Card>
    </ProfessionalLayout>
  )
}

