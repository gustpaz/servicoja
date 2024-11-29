'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import api from '../../services/api'

interface Professional {
  _id: string
  userId: {
    _id: string
    name: string
  }
  profession: string
  hourlyRate: number
  availability: {
    day: string
    startTime: string
    endTime: string
  }[]
}

export default function AgendarPage({ params }: { params: { id: string } }) {
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedStartTime, setSelectedStartTime] = useState<string>('')
  const [selectedEndTime, setSelectedEndTime] = useState<string>('')
  const router = useRouter()
  const { toast } = useToast()

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

  const handleSchedule = async () => {
    if (!professional || !selectedDate || !selectedStartTime || !selectedEndTime) return

    try {
      const response = await api.post('/booking', {
        professionalId: professional._id,
        date: selectedDate.toISOString().split('T')[0],
        startTime: selectedStartTime,
        endTime: selectedEndTime,
      })
      window.location.href = response.data.paymentUrl
    } catch (error) {
      toast({
        title: "Erro no agendamento",
        description: "Não foi possível iniciar o processo de agendamento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  if (!professional) {
    return <div>Carregando...</div>
  }

  const availableTimes = professional.availability
    .find(slot => slot.day === selectedDate?.toLocaleDateString('en-US', { weekday: 'long' }))
    ?.startTime.split('-') || []

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Agendar Serviço com {professional.userId.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
          <Select onValueChange={setSelectedStartTime}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o horário de início" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time}>{time}</SelectItem
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setSelectedEndTime}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o horário de término" />
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <Sel>
              ))}
            </SelectContent>
          </Select>
          <div className="flex justify-between items-center">
            <span>Preço por hora:</span>
            <span className="font-semibold">R$ {professional.hourlyRate}</span>
          </div>
          <Button onClick={handleSchedule} className="w-full">
            Confirmar Agendamento
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

