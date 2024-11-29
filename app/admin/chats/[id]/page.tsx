'use client'

import { AdminLayout } from '../../../components/admin-layout'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import api from '../../../services/api'

interface Message {
  _id: string
  sender: {
    _id: string
    name: string
  }
  content: string
  timestamp: string
  flagged: boolean
}

interface Chat {
  _id: string
  participants: {
    _id: string
    name: string
  }[]
  messages: Message[]
  reviewedByAdmin: boolean
}

export default function AdminChatDetail({ params }: { params: { id: string } }) {
  const [chat, setChat] = useState<Chat | null>(null)

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await api.get(`/admin/chats/${params.id}`)
        setChat(response.data)
      } catch (error) {
        console.error('Error fetching chat:', error)
      }
    }
    fetchChat()
  }, [params.id])

  if (!chat) {
    return <AdminLayout>Carregando...</AdminLayout>
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Detalhes do Chat</h1>
      <Card>
        <CardHeader>
          <CardTitle>Participantes: {chat.participants.map(p => p.name).join(', ')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chat.messages.map((message) => (
              <div key={message._id} className="border-b pb-2">
                <p className="font-semibold">{message.sender.name}</p>
                <p>{message.content}</p>
                {message.flagged && (
                  <p className="text-yellow-500 flex items-center">
                    <AlertTriangle className="mr-2" />
                    Esta mensagem foi filtrada
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  {new Date(message.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

