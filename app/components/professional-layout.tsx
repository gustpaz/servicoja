'use client'

import { useAuth } from '../contexts/AuthContext'
import { Sidebar } from './sidebar'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'professional') {
      router.push('/')
    }
  }, [user, router])

  if (!user || user.role !== 'professional') {
    return null
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  )
}

