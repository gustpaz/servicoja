'use client'

import { AdminLayout } from '../../components/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useToast } from '@/components/ui/use-toast'
import { FileUpload } from '../../components/FileUpload'

interface ServiceCategory {
  _id: string
  name: string
  description: string
  image?: string
}

export default function AdminServices() {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/admin/service-categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Error fetching service categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.post('/admin/service-categories', newCategory)
      setCategories([...categories, response.data])
      setNewCategory({ name: '', description: '' })
      toast({
        title: "Categoria adicionada com sucesso!",
        description: "A nova categoria de serviço foi criada.",
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar categoria",
        description: "Não foi possível adicionar a categoria. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.delete(`/admin/service-categories/${id}`)
      setCategories(categories.filter(category => category._id !== id))
      toast({
        title: "Categoria excluída com sucesso!",
        description: "A categoria de serviço foi removida.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir categoria",
        description: "Não foi possível excluir a categoria. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = async (categoryId: string, fileUrl: string) => {
    try {
      await api.patch(`/admin/service-categories/${categoryId}`, { image: fileUrl })
      setCategories(categories.map(category => 
        category._id === categoryId ? { ...category, image: fileUrl } : category
      ))
      toast({
        title: "Imagem adicionada com sucesso!",
        description: "A imagem da categoria foi atualizada.",
      })
    } catch (error) {
      toast({
        title: "Erro ao adicionar imagem",
        description: "Não foi possível adicionar a imagem. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Gerenciar Categorias de Serviços</h1>
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
          <CardTitle>Categorias de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Imagem</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-16 h-16 object-cover" />
                    ) : (
                      <FileUpload 
                        onUploadSuccess={(fileUrl) => handleFileUpload(category._id, fileUrl)} 
                        uploadUrl="/api/upload/admin" 
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDeleteCategory(category._id)}>
                      Excluir
                    </Button>
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

