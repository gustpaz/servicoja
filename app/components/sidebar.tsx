import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, DollarSign, FileText, Home, Settings, Users } from 'lucide-react'

const menuItems = [
  { href: '/professional', icon: Home, label: 'Dashboard' },
  { href: '/professional/agenda', icon: Calendar, label: 'Agenda' },
  { href: '/professional/servicos', icon: FileText, label: 'Serviços' },
  { href: '/professional/financeiro', icon: DollarSign, label: 'Financeiro' },
  { href: '/professional/clientes', icon: Users, label: 'Clientes' },
  { href: '/professional/configuracoes', icon: Settings, label: 'Configurações' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
              pathname === item.href ? 'bg-gray-700' : ''
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

