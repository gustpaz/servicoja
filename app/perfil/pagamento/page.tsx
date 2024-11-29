'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import api from '../../services/api'
import { CreditCard, Trash2 } from 'lucide-react'

interface PaymentMethod {
  _id: string
  type: 'credit_card' | 'debit_card'
  last4: string
  expMonth: number
  expYear: number
}

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [newCard, setNewCard] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await api.get('/user/payment-methods')
        setPaymentMethods(response.data)
      } catch (error) {
        console.error('Error fetching payment methods:', error)
      }
    }
    fetchPaymentMethods()
  }, [])

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/user/payment-methods', newCard)
      setPaymentMethods([...paymentMethods, response.data])
      setNewCard({ number: '', expMonth: '', expYear: '', cvc: '' })
      toast({
        title: "Cartão adicionado com sucesso!",
        description: "Seu novo método de pagamento foi salvo.",
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar cartão",
        description: "Não foi possível adicionar o cartão. Verifique os dados e tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveCard = async (id: string) => {
    try {
      await api.delete(`/user/payment-methods/${id}`)
      setPaymentMethods(paymentMethods.filter(method => method._id !== id))
      toast({
        title: "Cartão removido",
        description: "O método de pagamento foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao remover cartão",
        description: "Não foi possível remover o cartão. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Métodos de Pagamento</h1>
      <Card>
        <CardHeader>
          <CardTitle>Seus Cartões</CardTitle>
        </CardHeader>
        <CardContent>
          {paymentMethods.length > 0 ? (
            <ul className="space-y-2">
              {paymentMethods.map((method) => (
                <li key={method._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="mr-2" />
                    <span>•••• •••• •••• {method.last4}</span>
                    <span className="ml-2">
                      {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                    </span>
                  </div>
                  <Button variant="ghost" onClick={() => handleRemoveCard(method._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Você ainda não tem métodos de pagamento cadastrados.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Cartão</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCard} className="space-y-4">
            <Input
              placeholder="Número do Cartão"
              value={newCard.number}
              onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
              required
            />
            <div className="flex space-x-2">
              <Input
                placeholder="MM"
                value={newCard.expMonth}
                onChange={(e) => setNewCard({ ...newCard, expMonth: e.target.value })}
                required
              />
              <Input
                placeholder="AA"
                value={newCard.expYear}
                onChange={(e) => setNewCard({ ...newCard, expYear: e.target.value })}
                required
              />
            </div>
            <Input
              placeholder="CVC"
              value={newCard.cvc}
              onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value })}
              required
            />
            <Button type="submit">Adicionar Cartão</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

