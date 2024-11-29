'use client'

import { ProfessionalLayout } from '../../components/professional-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { X } from 'lucide-react'
import { FileUpload } from '../../components/FileUpload'

interface ProfessionalProfile {
  name: string
  profession: string
  description: string
  hourlyRate: number
  portfolio: { url: string; name: string }[]
}

export default function ProfessionalProfilePage() {
  const [profile, setProfile] = useState<ProfessionalProfile>({
    name: '',
    profession: '',
    description: '',
    hourlyRate: 0,
    portfolio: []
  })
  const [newPortfolioItem, setNewPortfolioItem] = useState('')
  const { toast } = useToast()
  const [portfolio, setPortfolio] = useState<{ url: string; name: string }[]>([])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/professional/profile')
        setProfile(response.data)
      } catch (error) {
        console.error('Error fetching professional profile:', error)
      }
    }
    fetchProfile()

    const fetchPortfolio = async () => {
      try {
        const response = await api.get('/professional/portfolio')
        setPortfolio(response.data)
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      }
    }
    fetchPortfolio()
  }, [])

  const handleSave = async () => {
    try {
      await api.patch('/professional/profile', profile)
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleAddPortfolioItem = () => {
    if (newPortfolioItem) {
      setProfile({
        ...profile,
        portfolio: [...profile.portfolio, {url: newPortfolioItem, name: newPortfolioItem}]
      })
      setNewPortfolioItem('')
    }
  }

  const handleRemovePortfolioItem = (index: number) => {
    const updatedPortfolio = profile.portfolio.filter((_, i) => i !== index)
    setProfile({ ...profile, portfolio: updatedPortfolio })
  }

  const handleFileUpload = (fileUrl: string) => {
    setPortfolio([...portfolio, { url: fileUrl, name: 'Novo item do portfólio' }])
    toast({
      title: "Arquivo enviado",
      description: "Seu arquivo foi adicionado ao portfólio com sucesso.",
    })
  }

  return (
    <ProfessionalLayout>
      <h1 className="text-2xl font-bold mb-4">Perfil Profissional</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/placeholder.svg" alt={profile.name} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button>Alterar Foto</Button>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
              Profissão
            </label>
            <Input
              id="profession"
              value={profile.profession}
              onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700">
              Taxa Horária (R$)
            </label>
            <Input
              id="hourlyRate"
              type="number"
              value={profile.hourlyRate}
              onChange={(e) => setProfile({ ...profile, hourlyRate: parseFloat(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Portfólio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUpload onUploadSuccess={handleFileUpload} uploadUrl="/api/upload/professional" />
          <ul className="grid grid-cols-2 gap-4">
            {portfolio.map((item, index) => (
              <li key={index} className="relative">
                <img src={item.url} alt={item.name} className="w-full h-40 object-cover rounded" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {/* Implement delete functionality */}}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Button onClick={handleSave}>Salvar Alterações</Button>
    </ProfessionalLayout>
  )
}

