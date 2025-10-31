'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Shield, User, Settings, Clock, Bell } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

interface MenuItem {
  id: string
  name: string
  icon: any
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  // Check authentication
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      if (!userStr && pathname !== '/login') {
        router.replace('/login')
      } else if (userStr) {
        setUser(JSON.parse(userStr))
      }
    }
  }, [pathname, router])

  // Load menu items
  useEffect(() => {
    if (user && pathname !== '/login') {
      fetch('/api/menu', {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.menus) {
            let filtered: any[] = []
            if (user && (user.role === 'admin' || user.role === 'superadmin')) {
              // Админ хэрэглэгч - бүх цэс эсвэл өөрийн цэс
              filtered = data.menus.filter((m: any) => 
                !m.userId || m.userId === user.id
              )
            } else if (user) {
              // Энгийн хэрэглэгч - эрх + хэрэглэгчийн цэс шүүлт
              filtered = data.menus.filter((m: any) => {
                const roleMatch = (m.roles || '').split(',').includes(user.role)
                const userMatch = !m.userId || m.userId === user.id
                return roleMatch && userMatch
              })
            }
            setMenuItems(filtered.map((m: any) => ({ 
              id: m.path.replace(/^\//, ''), 
              name: m.name || 'Цэс',
              icon: Settings 
            })))
          }
        })
        .catch(error => {
          console.error('Menu fetch error:', error)
        })
    }
  }, [user, pathname])

  // Time update
  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleMenuClick = (itemId: string) => {
    if (['violations', 'rejected-cases', 'complaints'].includes(itemId)) {
      router.push(`/${itemId}`)
    } else if (itemId === 'dashboard' || itemId === '') {
      router.push('/')
    } else {
      router.push(`/?menu=${itemId}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.replace('/login')
  }

  // Don't show sidebar on login page
  if (pathname === '/login') {
    return (
      <html lang="mn">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Цагдаагын систем</title>
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    )
  }

  return (
    <html lang="mn">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Цагдаагын систем</title>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-blue-900 text-white shadow-lg flex flex-col">
            <div className="p-4 flex-1">
              <div className="flex items-center space-x-3 mb-8">
                <Shield className="h-8 w-8" />
                <h1 className="text-lg font-bold">Цагдаагын систем</h1>
              </div>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      pathname === `/${item.id}` || (pathname === '/' && item.id === 'dashboard')
                        ? 'bg-blue-800 text-white' 
                        : 'text-blue-100 hover:bg-blue-800'
                    }`}
                  >
                    {item.icon && (typeof item.icon === 'function') && (
                      <item.icon className="h-5 w-5" />
                    )}
                    <span className="text-sm">{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* User Info + Logout */}
            <div className="p-4 bg-blue-800 mt-auto">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || 'Хэрэглэгч'}</p>
                  <p className="text-xs text-blue-200">{user?.role || 'Онлайн'}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="ml-auto text-xs text-red-200 hover:text-red-400"
                >
                  Гарах
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {menuItems.find(item => pathname === `/${item.id}`)?.name || 'Цагдаагын систем'}
                    </h1>
                    <p className="text-sm text-gray-600">Цагдаагын хяналтын дашбоард</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        {mounted ? `${currentTime.toLocaleDateString('mn-MN')} ${currentTime.toLocaleTimeString('mn-MN')}` : ''}
                      </span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Bell className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Settings className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
