'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, User, Phone, Mail, Calendar, Badge, MapPin } from 'lucide-react'

interface PoliceOfficer {
  id: number
  badge: string
  firstName: string
  lastName: string
  rank: string
  department: string
  position: string
  phone: string
  email?: string
  address?: string
  birthDate?: string
  hireDate: string
  status: string
  photo?: string
  createdAt: string
  updatedAt: string
}

const PoliceOfficerManagement = () => {
  const [officers, setOfficers] = useState<PoliceOfficer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingOfficer, setEditingOfficer] = useState<PoliceOfficer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    badge: '',
    firstName: '',
    lastName: '',
    rank: 'Цагдаа',
    department: '',
    position: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    hireDate: new Date().toISOString().slice(0, 10),
    status: 'active'
  })

  const ranks = [
    'Цагдаа',
    'Ахлах цагдаа',
    'Дэд байцаагч',
    'Байцаагч',
    'Ахлах байцаагч',
    'Дэслэгч',
    'Ахлах дэслэгч',
    'Хурандаа',
    'Подполковник',
    'Полковник',
    'Генерал-майор',
    'Генерал-лейтенант',
    'Генерал-полковник'
  ]

  const departments = [
    'Гэмт хэргийн цагдаа',
    'Замын цагдаа',
    'Цагдаагийн байгууллага',
    'Гал түймрийн аюулгүй байдал',
    'Онцгой байдлын цагдаа',
    'Дотоод аюулгүй байдал',
    'Мэдээллийн технологи',
    'Удирдлага'
  ]

  const statuses = [
    { value: 'active', label: 'Идэвхтэй', color: 'text-green-600' },
    { value: 'suspended', label: 'Түр түдгэлзүүлсэн', color: 'text-yellow-600' },
    { value: 'retired', label: 'Тэтгэвэрт гарсан', color: 'text-gray-600' }
  ]

  useEffect(() => {
    fetchOfficers()
  }, [])

  const fetchOfficers = async () => {
    try {
      const response = await fetch('/api/officers')
      const data = await response.json()
      if (data.success) {
        setOfficers(data.officers)
      }
    } catch (error) {
      console.error('Алдаа:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingOfficer ? '/api/officers' : '/api/officers'
      const method = editingOfficer ? 'PATCH' : 'POST'
      const body = editingOfficer 
        ? { id: editingOfficer.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      
      if (data.success) {
        fetchOfficers()
        setShowForm(false)
        setEditingOfficer(null)
        resetForm()
        alert(editingOfficer ? 'Мэдээлэл амжилттай шинэчлэгдлээ' : 'Ажилтан амжилттай бүртгэгдлээ')
      } else {
        alert(data.message || 'Алдаа гарлаа')
      }
    } catch (error) {
      console.error('Алдаа:', error)
      alert('Серверийн алдаа гарлаа')
    }
  }

  const handleEdit = (officer: PoliceOfficer) => {
    setEditingOfficer(officer)
    setFormData({
      badge: officer.badge,
      firstName: officer.firstName,
      lastName: officer.lastName,
      rank: officer.rank,
      department: officer.department,
      position: officer.position,
      phone: officer.phone,
      email: officer.email || '',
      address: officer.address || '',
      birthDate: officer.birthDate || '',
      hireDate: officer.hireDate,
      status: officer.status
    })
    setShowForm(true)
  }

  const handleDelete = async (officer: PoliceOfficer) => {
    if (!confirm(`${officer.firstName} ${officer.lastName} ажилтныг устгахдаа итгэлтэй байна уу?`)) {
      return
    }

    try {
      const response = await fetch('/api/officers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: officer.id })
      })

      const data = await response.json()
      
      if (data.success) {
        fetchOfficers()
        alert('Ажилтны бүртгэл амжилттай устгагдлаа')
      } else {
        alert('Алдаа гарлаа')
      }
    } catch (error) {
      console.error('Алдаа:', error)
      alert('Серверийн алдаа гарлаа')
    }
  }

  const resetForm = () => {
    setFormData({
      badge: '',
      firstName: '',
      lastName: '',
      rank: 'Цагдаа',
      department: '',
      position: '',
      phone: '',
      email: '',
      address: '',
      birthDate: '',
      hireDate: new Date().toISOString().slice(0, 10),
      status: 'active'
    })
  }

  const filteredOfficers = officers.filter(officer =>
    officer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    officer.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Ачааллаж байна...</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Цагдаагын ажилтануудын бүртгэл</h1>
          <p className="text-gray-600 mt-1">Цагдаагын ажилтануудын мэдээллийн удирдлага</p>
        </div>
        <button
          onClick={() => {
            setEditingOfficer(null)
            resetForm()
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Шинэ ажилтан нэмэх</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Ажилтны нэр, товчны дугаар, хэлтэс хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      {/* Officers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товчны дугаар</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цол</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хэлтэс</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Албан тушаал</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Төлөв</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOfficers.map((officer) => (
              <tr key={officer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Badge className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{officer.badge}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{officer.firstName} {officer.lastName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{officer.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${statuses.find(s => s.value === officer.status)?.color || 'text-gray-600'}`}>
                    {statuses.find(s => s.value === officer.status)?.label || officer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(officer)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
                    >
                      <Edit className="h-3 w-3" />
                      <span>Засах</span>
                    </button>
                    <button
                      onClick={() => handleDelete(officer)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center space-x-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Устгах</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOfficers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Ажилтан олдсонгүй</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingOfficer ? 'Ажилтны мэдээлэл засах' : 'Шинэ ажилтан бүртгэх'}
              </h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Товчны дугаар *
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Цол *
                  </label>
                  <select
                    value={formData.rank}
                    onChange={(e) => setFormData({...formData, rank: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  >
                    {ranks.map(rank => (
                      <option key={rank} value={rank} className="text-gray-900 bg-white">{rank}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Нэр *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Овог *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Хэлтэс *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  >
                    <option value="" className="text-gray-500 bg-white">Хэлтэс сонгох</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept} className="text-gray-900 bg-white">{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Албан тушаал *
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Утасны дугаар *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    И-мэйл
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Төрсөн огноо
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ажилд орсон огноо *
                  </label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Төлөв
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value} className="text-gray-900 bg-white">{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Хаяг
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingOfficer ? 'Шинэчлэх' : 'Бүртгэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PoliceOfficerManagement
