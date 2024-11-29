'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import Link from 'next/link'

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
  status: string
}

export default function ClientDashboard() {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchUpcomingBookings = async () => {
      try {
        const response = await api.get('/booking/client/upcoming')
        setUpcomingBookings(response.data)
      } catch (error) {
        console.error('Error fetching upcoming bookings:', error)
      }
    }
    fetchUpcomingBookings()
  }, [])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Bem-vindo, {user?.name}!</h1>
      <Card>
        <CardHeader>
          <CardTitle>Próximos Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingBookings.length > 0 ? (
            <ul className="space-y-2">
              {upcomingBookings.map((booking) => (
                <li key={booking._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{booking.professionalId.userId.name} - {booking.professionalId.profession}</p>
                    <p>{new Date(booking.date).toLocaleDateString()} às {booking.startTime}</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/cliente/agendamentos/${booking._id}`}>Detalhes</Link>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Você não tem agendamentos próximos.</p>
          )}
        </CardContent>
      </Card>
      <Button asChild>
        <Link href="/busca">Buscar Serviços</Link>
      </Button>
    </div>
  )
}

