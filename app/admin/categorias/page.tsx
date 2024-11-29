'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import api from '../../services/api'

interface Category {
  _id: string
  name: string
  description: string
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/admin/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/admin/categories', newCategory)
      setCategories([...categories, response.data])
      setNewCategory({ name: '', description: '' })
      toast({
        title: "Categoria adicionada com sucesso!",
        description: "A nova categoria foi adicionada à lista.",
      })
    } catch (error) {
      console.error('Error adding category:', error)
      toast({
        title: "Erro ao adicionar categoria",
        description: "Não foi possível adicionar a categoria. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Gerenciar Categorias de Serviço</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Adicionar Nova Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <Input
              placeholder="Nome da categoria"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
            <Input
              placeholder="Descrição"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              required
            />
            <Button type="submit">Adicionar Categoria</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Categorias Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category._id} className="border-b pb-2">
                  <p className="font-semibold">{category.name}</p>
                  <p>{category.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma categoria cadastrada.</p>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

