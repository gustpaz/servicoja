import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from './components/navbar'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ServiçoJá',
  description: 'Conectando você aos melhores profissionais locais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-100">
              <main className="flex-grow pb-16">{children}</main>
              <Navbar />
            </div>
            <Toaster />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

