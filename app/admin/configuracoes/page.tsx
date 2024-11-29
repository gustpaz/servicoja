'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { FileUpload } from '../../components/FileUpload'
import api from '../../services/api'

interface SystemSettings {
  systemName: string
  logo: string
  primaryColor: string
  secondaryColor: string
  contactEmail: string
  contactPhone: string
}

export default function AdminSystemSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: '',
    logo: '',
    primaryColor: '',
    secondaryColor: '',
    contactEmail: '',
    contactPhone: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/system-settings')
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
      await api.put('/admin/system-settings', settings)
      toast({
        title: "Configurações atualizadas",
        description: "As configurações do sistema foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar configurações",
        description: "Não foi possível atualizar as configurações. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleLogoUpload = async (fileUrl: string) => {
    try {
      await api.post('/admin/system-settings/logo', { logo: fileUrl })
      setSettings(prev => ({ ...prev, logo: fileUrl }))
      toast({
        title: "Logotipo atualizado",
        description: "O logotipo do sistema foi atualizado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar logotipo",
        description: "Não foi possível atualizar o logotipo. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Configurações do Sistema</h1>
      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="systemName" className="block text-sm font-medium text-gray-700">
                Nome do Sistema
              </label>
              <Input
                id="systemName"
                name="systemName"
                value={settings.systemName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                Logotipo
              </label>
              <img src={settings.logo} alt="Logo atual" className="w-32 h-32 object-contain mb-2" />
              <FileUpload onUploadSuccess={handleLogoUpload} uploadUrl="/api/upload/admin" />
            </div>
            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
                Cor Primária
              </label>
              <Input
                id="primaryColor"
                name="primaryColor"
                type="color"
                value={settings.primaryColor}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
                Cor Secundária
              </label>
              <Input
                id="secondaryColor"
                name="secondaryColor"
                type="color"
                value={settings.secondaryColor}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                E-mail de Contato
              </label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                Telefone de Contato
              </label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={settings.contactPhone}
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

