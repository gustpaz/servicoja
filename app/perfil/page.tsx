'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '@/components/ui/use-toast'
import api from '../services/api'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star } from 'lucide-react'
import { Rating } from '@/components/ui/rating'
import { FileUpload } from '../components/FileUpload'

interface Booking {
  _id: string
  professionalId: {
    userId: {
      name: string
    }
    profession: string
  }
  date: string
  startTime: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  rating?: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState('profile')
  const [files, setFiles] = useState<{ url: string; name: string }[]>([])

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/booking/client')
        setBookings(response.data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }
    fetchBookings()

    const fetchFiles = async () => {
      try {
        const response = await api.get('/users/files')
        setFiles(response.data)
      } catch (error) {
        console.error('Error fetching files:', error)
      }
    }
    fetchFiles()
  }, [])

  const handleSave = async () => {
    try {
      await api.patch('/users/profile', { name, email })
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

  const handleRateService = async (bookingId: string, rating: number) => {
    try {
      await api.post(`/booking/${bookingId}/rate`, { rating })
      toast({
        title: "Avaliação enviada",
        description: "Obrigado por avaliar o serviço!",
      })
      // Atualizar a lista de bookings após a avaliação
      const updatedBookings = bookings.map(booking => 
        booking._id === bookingId ? { ...booking, rating } : booking
      )
      setBookings(updatedBookings)
    } catch (error) {
      toast({
        title: "Erro ao avaliar",
        description: "Não foi possível enviar sua avaliação. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (fileUrl: string) => {
    setFiles([...files, { url: fileUrl, name: 'Novo arquivo' }])
    toast({
      title: "Arquivo enviado",
      description: "Seu arquivo foi enviado com sucesso.",
    })
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="p-4 space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="bookings">Agendamentos</TabsTrigger>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg" alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button className="w-full" onClick={handleSave}>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Meus Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <ul className="space-y-4">
                  {bookings.map((booking) => (
                    <li key={booking._id} className="border-b pb-2">
                      <p className="font-semibold">{booking.professionalId.userId.name} - {booking.professionalId.profession}</p>
                      <p>Data: {new Date(booking.date).toLocaleDateString()}</p>
                      <p>Horário: {booking.startTime}</p>
                      <p>Status: {booking.status}</p>
                      {booking.status === 'completed' && !booking.rating && (
                        <div className="mt-2">
                          <p>Avalie o serviço:</p>
                          <Rating onChange={(rating) => handleRateService(booking._id, rating)}/>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Você ainda não tem agendamentos.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>Meus Arquivos</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload onUploadSuccess={handleFileUpload} uploadUrl="/api/upload/client" />
              {files.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {file.name}
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => {/* Implement delete functionality */}}>
                        Excluir
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Você ainda não enviou nenhum arquivo.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

