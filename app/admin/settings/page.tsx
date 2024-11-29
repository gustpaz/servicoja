'use client'

import { AdminLayout } from '../../components/admin-layout'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import api from '../../services/api'

interface PlatformSettings {
  platformFeePercentage: number
  featuredListingPrice: number
  featuredListingDuration: number
  mercadoPagoAccessToken: string
  mercadoPagoPublicKey: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings>({
    platformFeePercentage: 0,
    featuredListingPrice: 0,
    featuredListingDuration: 0,
    mercadoPagoAccessToken: '',
    mercadoPagoPublicKey: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings')
        setSettings(response.data)
      } catch (error) {
        console.error('Error fetching settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSettings(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.put('/admin/settings', settings)
      toast({
        title: "Configurações atualizadas",
        description: "As configurações da plataforma foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar configurações",
        description: "Não foi possível atualizar as configurações. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Configurações da Plataforma</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="platformFeePercentage" className="block text-sm font-medium text-gray-700">
                Taxa da Plataforma (%)
              </label>
              <Input
                id="platformFeePercentage"
                name="platformFeePercentage"
                type="number"
                min="0"
                max="100"
                value={settings.platformFeePercentage}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="featuredListingPrice" className="block text-sm font-medium text-gray-700">
                Preço do Destaque (R$)
              </label>
              <Input
                id="featuredListingPrice"
                name="featuredListingPrice"
                type="number"
                min="0"
                value={settings.featuredListingPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="featuredListingDuration" className="block text-sm font-medium text-gray-700">
                Duração do Destaque (dias)
              </label>
              <Input
                id="featuredListingDuration"
                name="featuredListingDuration"
                type="number"
                min="1"
                value={settings.featuredListingDuration}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="mercadoPagoAccessToken" className="block text-sm font-medium text-gray-700">
                MercadoPago Access Token
              </label>
              <Input
                id="mercadoPagoAccessToken"
                name="mercadoPagoAccessToken"
                type="password"
                value={settings.mercadoPagoAccessToken}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="mercadoPagoPublicKey" className="block text-sm font-medium text-gray-700">
                MercadoPago Public Key
              </label>
              <Input
                id="mercadoPagoPublicKey"
                name="mercadoPagoPublicKey"
                type="text"
                value={settings.mercadoPagoPublicKey}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit">Salvar Configurações</Button>
          </form>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

