'use client'

import { useState, useEffect } from 'react'
import { ProfessionalLayout } from '../../components/professional-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import api from '../../services/api'

interface Service {
  _id: string
  name: string
  description: string
  price: number
}

export default function ProfessionalServices() {
  const [services, setServices] = useState<Service[]>([])
  const [newService, setNewService] = useState({ name: '', description: '', price: '' })
  const { toast } = useToast()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/professional/services')
        setServices(response.data)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchServices()
  }, [])

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/professional/services', {
        ...newService,
        price: parseFloat(newService.price)
      })
      setServices([...services, response.data])
      setNewService({ name: '', description: '', price: '' })
      toast({
        title: "Serviço adicionado com sucesso!",
        description: "O novo serviço foi adicionado à sua lista.",
      })
    } catch (error) {
      console.error('Error adding service:', error)
      toast({
        title: "Erro ao adicionar serviço",
        description: "Não foi possível adicionar o serviço. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <ProfessionalLayout>
      <h1 className="text-2xl font-bold mb-4">Gerenciar Serviços</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Adicionar Novo Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddService} className="space-y-4">
            <Input
              placeholder="Nome do serviço"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
              required
            />
            <Input
              placeholder="Descrição"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Preço"
              value={newService.price}
              onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              required
            />
            <Button type="submit">Adicionar Serviço</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Seus Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          {services.length > 0 ? (
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service._id} className="border-b pb-2">
                  <p className="font-semibold">{service.name}</p>
                  <p>{service.description}</p>
                  <p>R$ {service.price.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não tem serviços cadastrados.</p>
          )}
        </CardContent>
      </Card>
    </ProfessionalLayout>
  )
}

