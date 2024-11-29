import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

interface Professional {
  _id: string
  userId: {
    _id: string
    name: string
  }
  profession: string
  description: string
  hourlyRate: number
  rating: number
  avatar?: string
}

export function ProfessionalCard({ professional }: { professional: Professional }) {
  return (
    <Link href={`/profissional/${professional._id}`}>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            <Image
              src={professional.avatar || "/placeholder.svg"}
              alt={`Foto de perfil de ${professional.userId.name}`}
              width={40}
              height={40}
              className="rounded-full"
            />
            <AvatarFallback>{professional.userId.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{professional.userId.name}</h3>
            <p className="text-sm text-gray-500">{professional.profession}</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center" aria-label={`Avaliação: ${professional.rating.toFixed(1)} estrelas`}>
              <Star className="w-4 h-4 text-yellow-400 fill-current" aria-hidden="true" />
              <span className="ml-1 text-sm font-semibold">{professional.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-600">R$ {professional.hourlyRate}/hora</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{professional.description.slice(0, 100)}...</p>
        </CardContent>
      </Card>
    </Link>
  )
}

