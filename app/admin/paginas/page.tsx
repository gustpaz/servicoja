'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import api from '../../services/api'

interface Page {
  _id: string
  title: string
  slug: string
  content: string
  isPublished: boolean
}

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([])
  const [newPage, setNewPage] = useState({ title: '', slug: '', content: '', isPublished: true })
  const { toast } = useToast()

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await api.get('/admin/pages')
      setPages(response.data)
    } catch (error) {
      console.error('Error fetching pages:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPage(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/admin/pages', newPage)
      setNewPage({ title: '', slug: '', content: '', isPublished: true })
      fetchPages()
      toast({
        title: "Página criada com sucesso",
        description: "A nova página foi adicionada ao sistema.",
      })
    } catch (error) {
      toast({
        title: "Erro ao criar página",
        description: "Não foi possível criar a página. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/pages/${id}`)
      fetchPages()
      toast({
        title: "Página excluída",
        description: "A página foi removida com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir página",
        description: "Não foi possível excluir a página. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Gerenciar Páginas</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Adicionar Nova Página</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Título"
              name="title"
              value={newPage.title}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Slug"
              name="slug"
              value={newPage.slug}
              onChange={handleChange}
              required
            />
            <Textarea
              placeholder="Conteúdo"
              name="content"
              value={newPage.content}
              onChange={handleChange}
              required
            />
            <Button type="submit">Adicionar Página</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Páginas Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Publicada</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page._id}>
                  <TableCell>{page.title}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>{page.isPublished ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleDelete(page._id)}>
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

