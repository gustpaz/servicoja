'use client'

import { ProfessionalLayout } from '../../components/professional-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface FinancialData {
  totalEarnings: number
  monthlyEarnings: {
    month: string
    earnings: number
  }[]
  pendingPayments: number
}

export default function ProfessionalFinancial() {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await api.get('/professional/financial')
        setFinancialData(response.data)
      } catch (error) {
        console.error('Error fetching financial data:', error)
      }
    }
    fetchFinancialData()
  }, [])

  if (!financialData) {
    return <ProfessionalLayout>Carregando...</ProfessionalLayout>
  }

  return (
    <ProfessionalLayout>
      <h1 className="text-2xl font-bold mb-4">Relatório Financeiro</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Ganhos Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {financialData.totalEarnings.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pagamentos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R$ {financialData.pendingPayments.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ganhos Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData.monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="earnings" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </ProfessionalLayout>
  )
}

