'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, User, Settings } from 'lucide-react'
import ComplaintManagement from '../../components/ComplaintManagement'

interface MenuItem {
  id: string
  name: string
  icon: any
}

export default function CasesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeMenu, setActiveMenu] = useState('cases')

  useEffect(() => {
    // Check if user is logged in
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (!userStr) {
      router.push('/login')
      return
    }
    const userObj = JSON.parse(userStr)
    setUser(userObj)

    // Fetch menu items
    fetch('/api/menu', {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.menus) {
          let filtered: any[] = []
          if (userObj && (userObj.role === 'admin' || userObj.role === 'superadmin')) {
            filtered = data.menus
          } else if (userObj) {
            filtered = data.menus.filter((m: any) => (m.roles || '').split(',').includes(userObj.role))
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
  }, [router])

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'cases') return // Already on cases page
    
    if (itemId === 'dashboard' || itemId === '') {
      router.push('/')
    } else {
      router.push(`/${itemId}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
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
                  activeMenu === item.id 
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
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || 'Хэрэглэгч'}</p>
              <p className="text-xs text-blue-200">{user?.role || 'Онлайн'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-700 hover:bg-blue-600 text-white text-sm py-2 px-3 rounded transition-colors"
          >
            Гарах
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Гомдол мэдээллийн удирдлага</h1>
              <p className="mt-2 text-gray-600">
                Гомдол мэдээллийн бүртгэл, харуулалт, удирдлага
              </p>
            </div>
            
            <ComplaintManagement />
          </div>
        </div>
      </div>
    </div>
  )
}
