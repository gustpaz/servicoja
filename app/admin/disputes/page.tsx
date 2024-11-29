'use client'

import { AdminLayout } from '../../components/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Dispute {
  _id: string
  bookingId: string
  clientName: string
  professionalName: string
  reason: string
  status: 'pending' | 'in_progress' | 'resolved'
  createdAt: string
  resolution?: string
}

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [resolution, setResolution] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'resolved'>('all')
  const { toast } = useToast()

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const response = await api.get('/admin/disputes')
        setDisputes(response.data)
      } catch (error) {
        console.error('Error fetching disputes:', error)
        toast({
          title: "Erro ao carregar disputas",
          description: "Não foi possível carregar as disputas. Tente novamente.",
          variant: "destructive",
        })
      }
    }
    fetchDisputes()
  }, [toast])

  const handleResolveDispute = async () => {
    if (!selectedDispute) return

    try {
      const response = await api.patch(`/admin/disputes/${selectedDispute._id}/resolve`, { resolution })
      setDisputes(disputes.map(dispute => 
        dispute._id === selectedDispute._id ? { ...dispute, status: 'resolved', resolution } : dispute
      ))
      setSelectedDispute(null)
      setResolution('')
      toast({
        title: "Disputa resolvida",
        description: "A disputa foi marcada como resolvida.",
      })
    } catch (error) {
      console.error('Error resolving dispute:', error)
      toast({
        title: "Erro ao resolver disputa",
        description: "Não foi possível resolver a disputa. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateStatus = async (disputeId: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    try {
      await api.patch(`/admin/disputes/${disputeId}/status`, { status: newStatus })
      setDisputes(disputes.map(dispute => 
        dispute._id === disputeId ? { ...dispute, status: newStatus } : dispute
      ))
      toast({
        title: "Status atualizado",
        description: `A disputa foi marcada como ${newStatus}.`,
      })
    } catch (error) {
      console.error('Error updating dispute status:', error)
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da disputa. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const filteredDisputes = disputes.filter(dispute => 
    filter === 'all' || dispute.status === filter
  )

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Gerenciar Disputas</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Filtrar Disputas</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filter} onValueChange={(value: 'all' | 'pending' | 'in_progress' | 'resolved') => setFilter(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="resolved">Resolvidas</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Disputas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisputes.map((dispute) => (
                <TableRow key={dispute._id}>
                  <TableCell>{dispute.clientName}</TableCell>
                  <TableCell>{dispute.professionalName}</TableCell>
                  <TableCell>{dispute.reason}</TableCell>
                  <TableCell>{dispute.status}</TableCell>
                  <TableCell>{new Date(dispute.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button onClick={() => setSelectedDispute(dispute)}>Detalhes</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Detalhes da Disputa</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p><strong>Cliente:</strong> {dispute.clientName}</p>
                          <p><strong>Profissional:</strong> {dispute.professionalName}</p>
                          <p><strong>Motivo:</strong> {dispute.reason}</p>
                          <p><strong>Status:</strong> {dispute.status}</p>
                          {dispute.resolution && (
                            <p><strong>Resolução:</strong> {dispute.resolution}</p>
                          )}
                          {dispute.status !== 'resolved' && (
                            <>
                              <Textarea
                                placeholder="Digite a resolução da disputa"
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                              />
                              <Button onClick={handleResolveDispute}>Resolver Disputa</Button>
                            </>
                          )}
                          <Select 
                            value={dispute.status} 
                            onValueChange={(value: 'pending' | 'in_progress' | 'resolved') => handleUpdateStatus(dispute._id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Atualizar status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="in_progress">Em Progresso</SelectItem>
                              <SelectItem value="resolved">Resolvida</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </DialogContent>
                    </Dialog>
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

