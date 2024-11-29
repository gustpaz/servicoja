'use client'

import { AdminLayout } from '../../components/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useToast } from '@/components/ui/use-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { addDays } from 'date-fns'

interface ReportData {
  totalBookings: number
  totalRevenue: number
  topProfessionals: { name: string; bookings: number }[]
  bookingsByCategory: { category: string; count: number }[]
  revenueByDate: { date: string; revenue: number }[]
}

export default function AdminReports() {
  const [reportType, setReportType] = useState<'bookings' | 'revenue' | 'professionals' | 'categories'>('bookings')
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await api.get('/admin/reports', {
          params: {
            type: reportType,
            startDate: dateRange.from.toISOString(),
            endDate: dateRange.to.toISOString(),
          }
        })
        setReportData(response.data)
      } catch (error) {
        console.error('Error fetching report data:', error)
        toast({
          title: "Erro ao carregar relatório",
          description: "Não foi possível carregar os dados do relatório. Tente novamente.",
          variant: "destructive",
        })
      }
    }
    fetchReportData()
  }, [reportType, dateRange, toast])

  const renderChart = () => {
    if (!reportData) return null

    switch (reportType) {
      case 'bookings':
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.revenueByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={reportType === 'bookings' ? 'count' : 'revenue'} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'professionals':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.topProfessionals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )
      case 'categories':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={reportData.bookingsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Relatórios</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Configurações do Relatório</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={reportType} onValueChange={(value: 'bookings' | 'revenue' | 'professionals' | 'categories') => setReportType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de relatório" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bookings">Agendamentos</SelectItem>
              <SelectItem value="revenue">Receita</SelectItem>
              <SelectItem value="professionals">Top Profissionais</SelectItem>
              <SelectItem value="categories">Categorias de Serviço</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </CardContent>
      </Card>
      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>
              {reportType === 'bookings' && 'Relatório de Agendamentos'}
              {reportType === 'revenue' && 'Relatório de Receita'}
              {reportType === 'professionals' && 'Top Profissionais'}
              {reportType === 'categories' && 'Categorias de Serviço'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total de Agendamentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{reportData.totalBookings}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Receita Total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">R$ {reportData.totalRevenue.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </div>
              {renderChart()}
            </div>
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  )
}

