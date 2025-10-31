'use client'

import { useState, useEffect, Suspense } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Activity,
  TrendingUp,
  TrendingDown,
  Plus,
  FileText,
  Search,
  Filter,
  Download,
  Settings,
  Bell,
  User,
  BarChart3,
  Map,
  Calendar,
  Database,
  MessageSquare
} from 'lucide-react'
import MapComponent from '../components/MapComponent'
import GoogleMapsComponent from '../components/GoogleMapsComponent'
import DataTable from '../components/DataTable'
import DarkDashboard from '../components/DarkDashboardNew'
import CalendarDashboard from '../components/CalendarDashboard'
import ChatComponent from '../components/ChatComponent'
import ComplaintManagement from '../components/ComplaintManagement'
import AdminMenuManagement from '../components/AdminMenuManagement'
import AdminUsersManagement from '../components/AdminUsersManagement'
import CallSettingsManagement from '../components/CallSettingsManagement'
import PoliceOfficerManagement from '../components/PoliceOfficerManagement'
import TaskForceManagement from '../components/TaskForceManagement'
import { AccessLevel, ACCESS_LEVELS } from '../auth/accessLevels'
import { useRouter, useSearchParams } from 'next/navigation'

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

// Sample data matching the dashboard in the image
const crimeData = [
  { name: 'Хулгай', current: 220, previous: 180, comparison: 170 },
  { name: 'Дээрэм', current: 604, previous: 520, comparison: 450 },
  { name: 'Согтуу жолооч', current: 240, previous: 200, comparison: 210 },
  { name: 'Хүчирхийлэл', current: 95, previous: 85, comparison: 90 },
  { name: 'Хууль бус наймаа', current: 150, previous: 130, comparison: 140 }
]

const regionData = [
  { name: 'Хан-Уул', value: 45, color: '#3b82f6' },
  { name: 'Баянзүрх', value: 32, color: '#ef4444' },
  { name: 'Сүхбаатар', value: 28, color: '#10b981' },
  { name: 'Чингэлтэй', value: 35, color: '#f59e0b' },
  { name: 'Сонгинохайрхан', value: 41, color: '#8b5cf6' }
]

// Extended data for detailed dashboard
const hourlyCallData = [
  { hour: '00', calls: 12, resolved: 10 },
  { hour: '01', calls: 8, resolved: 7 },
  { hour: '02', calls: 5, resolved: 5 },
  { hour: '03', calls: 3, resolved: 3 },
  { hour: '04', calls: 6, resolved: 5 },
  { hour: '05', calls: 15, resolved: 12 },
  { hour: '06', calls: 25, resolved: 20 },
  { hour: '07', calls: 45, resolved: 38 },
  { hour: '08', calls: 52, resolved: 45 },
  { hour: '09', calls: 48, resolved: 42 },
  { hour: '10', calls: 38, resolved: 35 },
  { hour: '11', calls: 35, resolved: 32 },
  { hour: '12', calls: 42, resolved: 38 },
  { hour: '13', calls: 38, resolved: 35 },
  { hour: '14', calls: 45, resolved: 40 },
  { hour: '15', calls: 48, resolved: 43 },
  { hour: '16', calls: 52, resolved: 47 },
  { hour: '17', calls: 58, resolved: 52 },
  { hour: '18', calls: 55, resolved: 48 },
  { hour: '19', calls: 45, resolved: 38 },
  { hour: '20', calls: 35, resolved: 30 },
  { hour: '21', calls: 28, resolved: 25 },
  { hour: '22', calls: 22, resolved: 20 },
  { hour: '23', calls: 18, resolved: 16 }
]

const departmentData = [
  { dept: 'Санхүүгийн түүшин', cases: 12, status: 'active' },
  { dept: 'Мансууруулах бодисын түүшин', cases: 15, status: 'active' },
  { dept: 'Хуулийн хяналт', cases: 8, status: 'completed' },
  { dept: 'ЭЗХ хороо Сонгинын гудамжны', cases: 12, status: 'active' },
  { dept: 'Гэмт засаглал тоол', cases: 12, status: 'pending' }
]

const emergencyCalls = [
  { id: 1, type: 'Дээрэм', location: 'Баянзүрх дүүрэг', priority: 'high', time: '5 минутын өмнө', officer: 'Ц.Болд' },
  { id: 2, type: 'Зам тээврийн ослол', location: 'Хан-Уул дүүрэг', priority: 'medium', time: '12 минутын өмнө', officer: 'Б.Төмөр' },
  { id: 3, type: 'Гэр бүлийн зөрчил', location: 'Сүхбаатар дүүрэг', priority: 'low', time: '18 минутын өмнө', officer: 'Д.Оюун' },
  { id: 4, type: 'Хулгай', location: 'Чингэлтэй дүүрэг', priority: 'medium', time: '25 минутын өмнө', officer: 'Г.Баяр' },
  { id: 5, type: 'Согтуу жолооч', location: 'Сонгинохайрхан дүүрэг', priority: 'high', time: '32 минутын өмнө', officer: 'М.Эрдэнэ' }
]

const officerData = [
  { name: 'Ц.Болд', badge: '001', status: 'active', location: 'Баянзүрх дүүрэг', cases: 3 },
  { name: 'Б.Төмөр', badge: '002', status: 'active', location: 'Хан-Уул дүүрэг', cases: 2 },
  { name: 'Д.Оюун', badge: '003', status: 'break', location: 'Сүхбаатар дүүрэг', cases: 1 },
  { name: 'Г.Баяр', badge: '004', status: 'active', location: 'Чингэлтэй дүүрэг', cases: 4 },
  { name: 'М.Эрдэнэ', badge: '005', status: 'active', location: 'Сонгинохайрхан дүүрэг', cases: 2 }
]

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ComponentType<any>
  color: string
}

interface MenuItem {
  id: string
  name: string
  icon: React.ComponentType<any>
  active?: boolean
}

interface EmergencyCall {
  id: number
  type: string
  location: string
  priority: 'high' | 'medium' | 'low'
  time: string
  officer: string
}

interface NewIncidentForm {
  type: string
  location: string
  description: string
  priority: string
  reportedBy: string
  phone: string
  dateTime: string
}

const StatCard = ({ title, value, change, trend, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        <div className="flex items-center mt-2">
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
            {change}
          </span>
        </div>
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: color + '20' }}>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  </div>
)

  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [showAddForm, setShowAddForm] = useState(false)
  const [incidents, setIncidents] = useState(emergencyCalls)
  const [newIncident, setNewIncident] = useState<NewIncidentForm>({
    type: '',
    location: '',
    description: '',
    priority: 'medium',
    reportedBy: '',
    phone: '',
    dateTime: ''
  })
  const [mounted, setMounted] = useState(false)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [user, setUser] = useState<{ id: number; name: string; role: string } | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  const monthlyTrends = [
    { month: '01', crimes: 230, resolved: 180 },
    { month: '02', crimes: 210, resolved: 165 },
    { month: '03', crimes: 280, resolved: 220 },
    { month: '04', crimes: 250, resolved: 195 },
    { month: '05', crimes: 290, resolved: 235 },
    { month: '06', crimes: 320, resolved: 260 },
    { month: '07', crimes: 310, resolved: 255 },
    { month: '08', crimes: 285, resolved: 230 },
    { month: '09', crimes: 275, resolved: 225 },
    { month: '10', crimes: 260, resolved: 210 },
    { month: '11', crimes: 240, resolved: 200 },
    { month: '12', crimes: 220, resolved: 185 }
  ];

  // URL параметрээс цэс тохируулах
  useEffect(() => {
    const menu = searchParams.get('menu')
    if (menu) {
      setActiveMenu(menu)
    }
  }, [searchParams])

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    const userObj = userStr ? JSON.parse(userStr) : null
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
            // Админ бүх цэсийг харна
            filtered = data.menus
          } else if (userObj) {
            filtered = data.menus.filter((m: any) => (m.roles || '').split(',').includes(userObj.role))
          }
          setMenuItems(filtered.map((m: any) => ({ 
            id: m.path.replace(/^\//, ''), 
            name: m.name || 'Цэс', // Fallback утга нэмэх
            icon: Settings 
          })))
        }
      })
      .catch(error => {
        console.error('Menu fetch error:', error)
      })
  }, [])

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.replace('/login')
  }

  // Role-based redirect (жишээ: зөвхөн admin-д админ цэс)
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
  const isReadWrite = user?.role === 'readwrite'
  const isReadOnly = user?.role === 'readonly'

  // Session expiry (30 мин)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const expire = setTimeout(() => {
        localStorage.removeItem('user')
        setUser(null)
        router.replace('/login')
      }, 30 * 60 * 1000) // 30 минут
      return () => clearTimeout(expire)
    }
  }, [user, router])

  const handleSubmitIncident = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newIncident.type,
          location: newIncident.location,
          priority: newIncident.priority,
          time: new Date().toLocaleString('mn-MN'),
          officer: 'Хувиарлагдаагүй'
        })
      })
      const data = await res.json()
      if (data.success) {
        setIncidents([{ ...data.call }, ...incidents])
        setAlert({ type: 'success', message: 'Дуудлага амжилттай хадгалагдлаа!' })
        setShowAddForm(false)
        setNewIncident({
          type: '',
          location: '',
          description: '',
          priority: 'medium',
          reportedBy: '',
          phone: '',
          dateTime: ''
        })
      } else {
        setAlert({ type: 'error', message: 'Хадгалах үед алдаа гарлаа.' })
      }
    } catch (err) {
      setAlert({ type: 'error', message: 'Сүлжээний алдаа.' })
    }
    setTimeout(() => setAlert(null), 3000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const handleMenuClick = (itemId: string) => {
    // Check if it's a separate page route
    if (['violations', 'rejected-cases', 'complaints'].includes(itemId)) {
      router.push(`/${itemId}`)
    } else if (itemId === 'dashboard' || itemId === '') {
      setActiveMenu('dashboard')
    } else {
      setActiveMenu(itemId)
    }
  }

  const renderDashboardContent = () => {
    switch (activeMenu) {
      case 'dark-dashboard':
        return <DarkDashboard />

      case 'calls':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Дуудлага хариуцах</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Шинэ дуудлага нэмэх</span>
              </button>
            </div>
            
            {/* Hourly calls chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Цагаар дуудлагын статистик</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hourlyCallData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" name="Нийт дуудлага" />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Шийдвэрлэсэн" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Calls list */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Идэвхтэй дуудлагууд</h3>
              <div className="space-y-3">
                {incidents.map((incident) => (
                  <div key={incident.id} className={`p-4 rounded-lg border ${getPriorityColor(incident.priority)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{incident.type}</h4>
                        <p className="text-sm text-gray-600">{incident.location}</p>
                        <p className="text-xs text-gray-500">{incident.time}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(incident.priority)}`}>
                          {incident.priority === 'high' ? 'Яаралтай' : 
                           incident.priority === 'medium' ? 'Дундаж' : 'Бага'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Хариуцсан: {incident.officer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'cases':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Гомдол мэдээлэл</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ангиллаар</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="current" fill="#3b82f6" name="Одоогийн" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Хэлтсээр</h3>
                <div className="space-y-3">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{dept.dept}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        dept.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        dept.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {dept.cases} хэрэг
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'map':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Газрын зураг - Гомдол мэдээлэл</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Maps - Дүүргийн гэмт хэргийн байршил</h3>
              <GoogleMapsComponent incidents={incidents} />
            </div>
            
            {/* Traditional map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Уламжлалт зураг</h3>
              <MapComponent incidents={incidents} />
            </div>
            
            {/* Statistics by location */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regionData.map((region, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{region.name}</h4>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{region.value}</p>
                      <p className="text-sm text-gray-600">Идэвхтэй хэрэг</p>
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: region.color + '20' }}>
                      <MapPin className="h-6 w-6" style={{ color: region.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'database':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Өгөгдлийн сан</h2>
            <DataTable
              title="Гэмт хэргийн бүртгэл"
              data={emergencyCalls.map(call => ({
                id: call.id,
                type: call.type,
                location: call.location,
                priority: call.priority,
                time: call.time,
                officer: call.officer,
                status: call.priority === 'high' ? 'active' : 'completed'
              }))}
              columns={['ID', 'Type', 'Location', 'Priority', 'Time', 'Officer', 'Status']}
              onAdd={() => setShowAddForm(true)}
              onEdit={(item) => {/* Handle edit */}}
              onDelete={(id) => {/* Handle delete */}}
              onView={(item) => {/* Handle view */}}
            />
          </div>
        )

      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Гэмт хэргийн мэдээлэл</h2>
            
            {/* Detailed charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Гэмт хэргийн төрлөөр</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={crimeData.map(crime => ({ name: crime.name, value: crime.current }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {crimeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Шийдвэрлэлтийн хувь</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="current" fill="#ef4444" name="Нийт" />
                    <Bar dataKey="comparison" fill="#10b981" name="Шийдвэрлэсэн" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly comparison */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Сарын харьцуулалт</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="crimes" stroke="#ef4444" name="Гэмт хэрэг" strokeWidth={3} />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Шийдвэрлэсэн" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )

      case 'officers':
        return <PoliceOfficerManagement />

      case 'messages':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Зурвас</h2>
            <ChatComponent />
          </div>
        )

      case 'complaints':
        return <ComplaintManagement />

      case 'call-settings':
        return <CallSettingsManagement />

      case 'admin/users':
        return <AdminUsersManagement />
      case 'admin/roles':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Эрхийн түвшин, эрхийн бүтэц</h2>
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  <th className="p-2 border text-gray-900">Түвшин</th>
                  <th className="p-2 border text-gray-900">Нэр</th>
                  <th className="p-2 border text-gray-900">Тайлбар</th>
                  <th className="p-2 border text-gray-900">Эрхүүд</th>
                  <th className="p-2 border text-gray-900">Жишээ үүрэг</th>
                </tr>
              </thead>
              <tbody>
                {ACCESS_LEVELS.map(lvl => (
                  <tr key={lvl.level}>
                    <td className="p-2 border text-center text-gray-900">{lvl.level}</td>
                    <td className="p-2 border text-gray-900">{lvl.name}</td>
                    <td className="p-2 border text-gray-900">{lvl.description}</td>
                    <td className="p-2 border text-gray-900">
                      <ul className="list-disc ml-4">
                        {lvl.permissions.map(p => <li key={p} className="text-gray-900">{p}</li>)}
                      </ul>
                    </td>
                    <td className="p-2 border text-gray-900">
                      <ul className="list-disc ml-4">
                        {lvl.exampleRoles.map(r => <li key={r} className="text-gray-900">{r}</li>)}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      case 'admin/menu':
        return <AdminMenuManagement />
      
      case 'admin/police-officers':
        return <PoliceOfficerManagement />
      
      case 'task-forces':
        return <TaskForceManagement />

      case 'calendar':
        return <CalendarDashboard />

      default:
        return (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Нийт дуудлага хариулсан"
                value="4018"
                change="+12%"
                trend="up"
                icon={Phone}
                color="#3b82f6"
              />
              <StatCard
                title="Гэмт хэрэг шийдвэрлэсэн"
                value="238"
                change="-5%"
                trend="down"
                icon={CheckCircle}
                color="#10b981"
              />
              <StatCard
                title="Зөрчил бүртгэсэн"
                value="1542"
                change="+8%"
                trend="up"
                icon={AlertTriangle}
                color="#f59e0b"
              />
              <StatCard
                title="Идэвхтэй хэрэг"
                value="90"
                change="+3%"
                trend="up"
                icon={Activity}
                color="#ef4444"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Crime Types Bar Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Гэмт хэргийн дүн дүүргээр</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="current" fill="#3b82f6" name="Одоогийн" />
                    <Bar dataKey="previous" fill="#f59e0b" name="Өмнөх" />
                    <Bar dataKey="comparison" fill="#10b981" name="Харьцуулалт" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Regional Distribution Pie Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Дүүргээр хуваарилалт</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Нийт дуудлага хариулах цаг</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="crimes" stackId="1" stroke="#ef4444" fill="#ef4444" />
                  <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10b981" fill="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-8">
      {alert && (
        <div className={`mb-4 p-3 rounded text-sm font-medium ${alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{alert.message}</div>
      )}
      {renderDashboardContent()}
      
      {/* Add Incident Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Шинэ дуудлага нэмэх</h2>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitIncident} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Төрөл
                </label>
                <select
                  value={newIncident.type}
                  onChange={(e) => setNewIncident({...newIncident, type: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Сонгоно уу</option>
                  <option value="Хулгай">Хулгай</option>
                  <option value="Дээрэм">Дээрэм</option>
                  <option value="Согтуу жолооч">Согтуу жолооч</option>
                  <option value="Хүчирхийлэл">Хүчирхийлэл</option>
                  <option value="Зам тээврийн ослол">Зам тээврийн ослол</option>
                  <option value="Гэр бүлийн зөрчил">Гэр бүлийн зөрчил</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Байршил
                </label>
                <select
                  value={newIncident.location}
                  onChange={(e) => setNewIncident({...newIncident, location: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                >
                  <option value="">Дүүрэг сонгоно уу</option>
                  <option value="Баянзүрх дүүрэг">Баянзүрх дүүрэг</option>
                  <option value="Хан-Уул дүүрэг">Хан-Уул дүүрэг</option>
                  <option value="Сүхбаатар дүүрэг">Сүхбаатар дүүрэг</option>
                  <option value="Чингэлтэй дүүрэг">Чингэлтэй дүүрэг</option>
                  <option value="Сонгинохайрхан дүүрэг">Сонгинохайрхан дүүрэг</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тайлбар
                </label>
                <textarea
                  value={newIncident.description}
                  onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Дэлгэрэнгүй тайлбар..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Яаралтай байдал
                </label>
                <select
                  value={newIncident.priority}
                  onChange={(e) => setNewIncident({...newIncident, priority: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="low">Бага</option>
                  <option value="medium">Дундаж</option>
                  <option value="high">Яаралтай</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Мэдээлэгч
                </label>
                <input
                  type="text"
                  value={newIncident.reportedBy}
                  onChange={(e) => setNewIncident({...newIncident, reportedBy: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Мэдээлэгчийн нэр"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Утасны дугаар
                </label>
                <input
                  type="tel"
                  value={newIncident.phone}
                  onChange={(e) => setNewIncident({...newIncident, phone: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="99999999"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Бүртгэх
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
