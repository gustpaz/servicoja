'use client'

import { useState, useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Send, AlertTriangle } from 'lucide-react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

interface Message {
  _id: string
  sender: string
  content: string
  timestamp: string
  flagged: boolean
}

interface ChatPartner {
  _id: string
  name: string
  profession: string
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null)
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/${params.id}`)
        setMessages(response.data.messages)
        setChatPartner(response.data.chatPartner)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }
    fetchMessages()

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/chat/${params.id}`)
    
    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data)
      setMessages(prevMessages => [...prevMessages, newMessage])
    }

    return () => {
      socket.close()
    }
  }, [params.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const response = await api.post(`/chat/${params.id}`, { content: newMessage })
        setMessages([...messages, response.data])
        setNewMessage('')
      } catch (error) {
        console.error('Error sending message:', error)
      }
    }
  }

  if (!chatPartner || !user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <Card className="flex-grow flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt={chatPartner.name} />
              <AvatarFallback>{chatPartner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{chatPartner.name}</h2>
              <p className="text-sm text-gray-500">{chatPartner.profession}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.sender === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {message.content}
                {message.flagged && (
                  <AlertTriangle className="inline-block ml-2 h-4 w-4 text-yellow-500" />
                )}
                <div className="text-xs mt-1 opacity-75">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="flex-shrink-0">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

