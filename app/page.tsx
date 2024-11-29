'use client'

import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin } from 'lucide-react'
import { useAuth } from './contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const { t } = useTranslation('common')

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        {user ? `${t('welcome')}, ${user.name}!` : t('welcome')}
      </h1>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <MapPin className="text-gray-400" />
          <Input type="text" placeholder={t('location')} />
        </div>
        <div className="flex items-center space-x-2">
          <Search className="text-gray-400" />
          <Input type="text" placeholder={t('search')} />
        </div>
        <Link href="/busca">
          <Button className="w-full">{t('searchButton')}</Button>
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <CategoryCard title="Limpeza" icon="🧹" href="/busca?categoria=limpeza" />
        <CategoryCard title="Reparos" icon="🔧" href="/busca?categoria=reparos" />
        <CategoryCard title="Aulas" icon="📚" href="/busca?categoria=aulas" />
        <CategoryCard title="Beleza" icon="💇" href="/busca?categoria=beleza" />
      </div>
    </div>
  )
}

function CategoryCard({ title, icon, href }: { title: string; icon: string; href: string }) {
  return (
    <Link href={href} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </Link>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

