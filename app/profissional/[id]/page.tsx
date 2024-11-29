'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Star, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import api from '../../services/api'

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
  availability: {
    day: string
    startTime: string
    endTime: string
  }[]
}

export default function ProfessionalProfile({ params }: { params: { id: string } }) {
  const [professional, setProfessional] = useState<Professional | null>(null)

  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        const response = await api.get(`/professionals/${params.id}`)
        setProfessional(response.data)
      } catch (error) {
        console.error('Error fetching professional:', error)
      }
    }
    fetchProfessional()
  }, [params.id])

  if (!professional) {
    return <div>Carregando...</div>
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-col items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/placeholder.svg" alt={professional.userId.name} />
            <AvatarFallback>{professional.userId.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold">{professional.userId.name}</h1>
          <p className="text-gray-500">{professional.profession}</p>
          <div className="flex items-center mt-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="ml-1 font-semibold">{professional.rating.toFixed(1)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" />
            <span>São Paulo, SP</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-gray-400 mr-2" />
            <span>R$ {professional.hourlyRate}/hora</span>
          </div>
          <p>{professional.description}</p>
          <div>
            <h3 className="font-semibold mb-2">Disponibilidade</h3>
            <div className="space-y-2">
              {professional.availability.map((slot, index) => (
                <div key={index} className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <span>{slot.day}: {slot.startTime} - {slot.endTime}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1">
              <Link href={`/agendar/${professional._id}`}>Agendar Serviço</Link>
            </Button>
            <Button variant="outline" className="flex-1">
              <Link href={`/chat/${professional.userId._id}`}>Enviar Mensagem</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

