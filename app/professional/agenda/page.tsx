'use client'

import { ProfessionalLayout } from '../../components/professional-layout'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import api from '../../services/api'

interface Booking {
  _id: string
  clientName: string
  service: string
  date: string
  startTime: string
  endTime: string
}

export default function ProfessionalAgenda() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    const fetchBookings = async () => {
      if (selectedDate) {
        try {
          const response = await api.get(`/professional/bookings`, {
            params: { date: selectedDate.toISOString().split('T')[0] }
          })
          setBookings(response.data)
        } catch (error) {
          console.error('Error fetching bookings:', error)
        }
      }
    }
    fetchBookings()
  }, [selectedDate])

  return (
    <ProfessionalLayout>
      <h1 className="text-2xl font-bold mb-4">Agenda</h1>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        <div className="w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos para {selectedDate?.toLocaleDateString()}</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length > 0 ? (
                <ul className="space-y-2">
                  {bookings.map((booking) => (
                    <li key={booking._id} className="border-b pb-2">
                      <p className="font-semibold">{booking.clientName}</p>
                      <p>{booking.service}</p>
                      <p>{booking.startTime} - {booking.endTime}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum agendamento para esta data.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProfessionalLayout>
  )
}

