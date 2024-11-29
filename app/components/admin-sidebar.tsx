import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Briefcase, FileText, Settings, BarChart, AlertTriangle, PieChart, Layout } from 'lucide-react'

const menuItems = [
  { href: '/admin', icon: BarChart, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Usuários' },
  { href: '/admin/professionals', icon: Briefcase, label: 'Profissionais' },
  { href: '/admin/services', icon: FileText, label: 'Serviços' },
  { href: '/admin/disputes', icon: AlertTriangle, label: 'Disputas' },
  { href: '/admin/reports', icon: PieChart, label: 'Relatórios' },
  { href: '/admin/paginas', icon: Layout, label: 'Páginas' },
  { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-white text-gray-800 w-64 min-h-screen p-4 border-r">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 ${
              pathname === item.href ? 'bg-gray-100 text-blue-600' : ''
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

