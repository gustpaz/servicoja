export interface Professional {
  id: string
  name: string
  profession: string
  rating: number
  price: string
  image: string
}

const professionals: Professional[] = [
  { id: '1', name: 'Ana Silva', profession: 'Diarista', rating: 4.8, price: 'R$ 100-150', image: '/placeholder.svg' },
  { id: '2', name: 'Carlos Santos', profession: 'Eletricista', rating: 4.9, price: 'R$ 80-120', image: '/placeholder.svg' },
  { id: '3', name: 'Mariana Costa', profession: 'Personal Trainer', rating: 4.7, price: 'R$ 70-100', image: '/placeholder.svg' },
  { id: '4', name: 'Pedro Oliveira', profession: 'Encanador', rating: 4.6, price: 'R$ 90-130', image: '/placeholder.svg' },
  { id: '5', name: 'Juliana Mendes', profession: 'Professora de Inglês', rating: 4.9, price: 'R$ 60-80', image: '/placeholder.svg' },
]

export async function searchProfessionals(query: string): Promise<Professional[]> {
  // Simular uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return professionals.filter(pro => 
    pro.name.toLowerCase().includes(query.toLowerCase()) ||
    pro.profession.toLowerCase().includes(query.toLowerCase())
  )
}

export async function getProfessionalById(id: string): Promise<Professional | undefined> {
  // Simular uma chamada de API
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return professionals.find(pro => pro.id === id)
}

