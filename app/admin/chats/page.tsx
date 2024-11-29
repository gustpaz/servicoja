'use client'

import { AdminLayout } from '../../components/admin-layout'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import api from '../../services/api'
import Link from 'next/link'

interface Chat {
  _id: string
  participants: {
    _id: string
    name: string
  }[]
  messages: {
    _id: string
    sender: string
    content: string
    timestamp: string
    flagged: boolean
  }[]
  reviewedByAdmin: boolean
}

export default function AdminChats() {
  const [chats, setChats] = useState<Chat[]>([])

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await api.get('/admin/chats')
        setChats(response.data)
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }
    fetchChats()
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Histórico de Chats</h1>
      <Card>
        <CardHeader>
          <CardTitle>Todos os Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participantes</TableHead>
                <TableHead>Última Mensagem</TableHead>
                <TableHead>Revisado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chats.map((chat) => (
                <TableRow key={chat._id}>
                  <TableCell>{chat.participants.map(p => p.name).join(', ')}</TableCell>
                  <TableCell>
                    {chat.messages[chat.messages.length - 1]?.content.substring(0, 50)}...
                  </TableCell>
                  <TableCell>{chat.reviewedByAdmin ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>
                    <Link href={`/admin/chats/${chat._id}`}>
                      <Button>Ver Detalhes</Button>
                    </Link>
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

