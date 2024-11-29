'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, MessageSquare, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { NotificationBell } from './notification-bell'

export function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    { href: '/', icon: Home, label: 'Início' },
    { href: '/busca', icon: Search, label: 'Buscar' },
    { href: '/chat', icon: MessageSquare, label: 'Chat' },
    { href: '/perfil', icon: User, label: 'Perfil' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto px-4 py-2 flex justify-between items-center">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center p-2 ${
              pathname === item.href ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        <NotificationBell />
        {user && (
          <button onClick={logout} className="flex flex-col items-center p-2 text-gray-600">
            <LogOut className="w-6 h-6" />
            <span className="text-xs mt-1">Sair</span>
          </button>
        )}
      </div>
    </nav>
  )
}

