export interface Message {
  id: string
  sender: 'user' | 'professional'
  content: string
  timestamp: Date
}

const chats: { [key: string]: Message[] } = {}

export async function getMessages(professionalId: string): Promise<Message[]> {
  // Simular uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (!chats[professionalId]) {
    chats[professionalId] = [
      {
        id: '1',
        sender: 'professional',
        content: 'Olá! Como posso ajudar?',
        timestamp: new Date()
      }
    ]
  }
  
  return chats[professionalId]
}

export async function sendMessage(professionalId: string, content: string): Promise<Message> {
  // Simular uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const newMessage: Message = {
    id: Date.now().toString(),
    sender: 'user',
    content,
    timestamp: new Date()
  }
  
  if (!chats[professionalId]) {
    chats[professionalId] = []
  }
  
  chats[professionalId].push(newMessage)
  
  return newMessage
}

