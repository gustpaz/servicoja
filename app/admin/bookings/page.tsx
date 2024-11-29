'use client'

import { AdminLayout } from '../../components/admin-layout'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import api from '../../services/api'

interface Booking {
  _id: string
  clientId: {
    name: string
  }
  professionalId: {
    userId: {
      name: string
    }
  }
  date: string
  startTime: string
  endTime: string
  status: string
  totalPrice: number
  adminApproved: boolean
  clientConfirmed: boolean
  professionalConfirmed: boolean
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/admin/bookings')
        setBookings(response.data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }
    fetchBookings()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/booking/${id}/approve`)
      setBookings(bookings.map(booking => 
        booking._id === id ? { ...booking, adminApproved: true } : booking
      ))
      toast({
        title: "Booking approved",
        description: "The booking has been approved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error approving booking",
        description: "An error occurred while approving the booking.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Bookings</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Professional</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.clientId.name}</TableCell>
                  <TableCell>{booking.professionalId.userId.name}</TableCell>
                  <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                  <TableCell>{`${booking.startTime} - ${booking.endTime}`}</TableCell>
                  <TableCell>{booking.status}</TableCell>
                  <TableCell>R$ {booking.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    {!booking.adminApproved && (
                      <Button onClick={() => handleApprove(booking._id)}>Approve</Button>
                    )}
                    {booking.adminApproved && (
                      <span className="text-green-500">Approved</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
