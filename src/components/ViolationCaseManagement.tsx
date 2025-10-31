'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Download, Edit, Trash2, Eye, Filter, Ban } from 'lucide-react'
import ViolationCaseForm from './ViolationCaseForm'
import { useRouter, useSearchParams } from 'next/navigation'

interface ViolationCase {
  id: number
  caseNumber: string
  violationCode: string
  violationCategory: string
  violationDate: string
  violationTime: string
  location: string
  district: string
  violatorName: string
  violatorId: string
  violatorDetails: string
  summary: string
  decision: string
  status: 'active' | 'resolved' | 'pending'
  officer: string
}

const ViolationCaseManagement = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cases, setCases] = useState<ViolationCase[]>([
    {
      id: 1,
      caseNumber: '2507000754',
      violationCode: '5.3-1',
      violationCategory: '9.15',
      violationDate: '2025-10-06',
      violationTime: '09:28',
      location: 'Налайх 4-р хороо, 48-р үдамжины хэрэг маргаан үүсгээд байна',
      district: 'Налайх дүүрэг',
      violatorName: 'Ж.Намуунцэцэг',
      violatorId: 'УД1321106',
      violatorDetails: 'Б.Урангоо УД01262203',
      summary: 'Хэргийн товч тайлбар дэлгэрэнгүй мэдээлэл',
      decision: 'ЭЗАТ торгосон шүүхэд шилжүүлсэн',
      status: 'resolved',
      officer: 'Хэргэсхүй болгосон г.Менхтэрэл'
    }
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<ViolationCase | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Check if coming from complaint page
  useEffect(() => {
    const fromComplaint = searchParams.get('from')
    if (fromComplaint === 'complaint') {
      // Auto-open form if coming from complaint
      setIsFormOpen(true)
    }
  }, [searchParams])

  const handleAddCase = (newCase: Omit<ViolationCase, 'id'>) => {
    const caseWithId: ViolationCase = {
      ...newCase,
      id: Date.now()
    }
    setCases(prev => [caseWithId, ...prev])
  }

  const handleEditCase = (updatedCase: Omit<ViolationCase, 'id'>) => {
    if (editingCase) {
      setCases(prev => prev.map(c => 
        c.id === editingCase.id 
          ? { ...updatedCase, id: editingCase.id }
          : c
      ))
      setEditingCase(null)
    }
  }

  const handleDeleteCase = (id: number) => {
    if (window.confirm('Энэ хэргийг устгахдаа итгэлтэй байна уу?')) {
      setCases(prev => prev.filter(c => c.id !== id))
    }
  }

  const handleRejectCase = (violationCase: ViolationCase) => {
    // Navigate to rejected cases page with violation data
    const rejectedData = {
      sourceViolation: violationCase.caseNumber,
      location: violationCase.location,
      rejectedBy: violationCase.officer,
      violatorName: violationCase.violatorName,
      violatorId: violationCase.violatorId,
      summary: violationCase.summary,
      district: violationCase.district,
      originalDate: violationCase.violationDate
    }
    
    // Store data in localStorage temporarily
    localStorage.setItem('rejectedFromViolation', JSON.stringify(rejectedData))
    
    // Navigate to rejected cases page
    router.push('/rejected-cases?from=violation')
  }

  const openEditForm = (violationCase: ViolationCase) => {
    setEditingCase(violationCase)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingCase(null)
  }

  const exportToCSV = () => {
    const headers = [
      'Хэргийн дугаар', 'Зөрчлийн заалт', 'Хэрэг нэгээн', 'Огноо', 'Цаг',
      'Газар нэгээн', 'Дүүрэг', 'Зөрчил гаргагч', 'РД дугаар', 'Дэлгэрэнгүй',
      'Товч утга', 'Шийдвэрлэлт', 'Төлөв', 'Албан хаагч'
    ]
    
    const csvContent = [
      headers.join(','),
      ...filteredCases.map(c => [
        c.caseNumber, c.violationCode, c.violationCategory, c.violationDate, c.violationTime,
        c.location, c.district, c.violatorName, c.violatorId, c.violatorDetails,
        c.summary, c.decision, getStatusText(c.status), c.officer
      ].map(field => `"${field || ''}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'violation_cases.csv'
    link.click()
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Идэвхтэй'
      case 'resolved': return 'Шийдвэрлэгдсэн'
      case 'pending': return 'Хүлээгдэж байна'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCases = cases.filter(violationCase => {
    const matchesSearch = 
      violationCase.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violationCase.violatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violationCase.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violationCase.violationCode.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || violationCase.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Толгой хэсэг */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Зөрчлийн хэргийн бүртгэл</h1>
          <p className="text-gray-600">Зөрчлийн хэргийн бүртгэл, харуулалт, удирдлага</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Шинэ хэрэг нэмэх</span>
        </button>
      </div>

      {/* Хайлт ба шүүлтүүр */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Хэргийн дугаар, нэр, байршил, заалтаар хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-gray-900"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="all" className="text-gray-900 bg-white">Бүх төлөв</option>
            <option value="pending" className="text-gray-900 bg-white">Хүлээгдэж байна</option>
            <option value="active" className="text-gray-900 bg-white">Идэвхтэй</option>
            <option value="resolved" className="text-gray-900 bg-white">Шийдвэрлэгдсэн</option>
          </select>
          
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
          >
            <Download className="h-4 w-4" />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      {/* Статистик */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{cases.length}</div>
          <div className="text-sm text-gray-600">Нийт хэрэг</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-yellow-600">{cases.filter(c => c.status === 'pending').length}</div>
          <div className="text-sm text-gray-600">Хүлээгдэж байна</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-orange-600">{cases.filter(c => c.status === 'active').length}</div>
          <div className="text-sm text-gray-600">Идэвхтэй</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-green-600">{cases.filter(c => c.status === 'resolved').length}</div>
          <div className="text-sm text-gray-600">Шийдвэрлэгдсэн</div>
        </div>
      </div>

      {/* Хүснэгт */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Хэргийн дугаар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Заалт
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Огноо/Цаг
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Зөрчил гаргагч
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Газар нэгээн
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төлөв
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map((violationCase) => (
                <tr key={violationCase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{violationCase.caseNumber}</div>
                    <div className="text-sm text-gray-500">{violationCase.violationCategory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {violationCase.violationCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{violationCase.violationDate}</div>
                    <div className="text-sm text-gray-500">{violationCase.violationTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{violationCase.violatorName}</div>
                    <div className="text-sm text-gray-500">{violationCase.violatorId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900" title={violationCase.location}>
                      {violationCase.location.length > 30 
                        ? `${violationCase.location.substring(0, 30)}...` 
                        : violationCase.location}
                    </div>
                    <div className="text-sm text-gray-500">{violationCase.district}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(violationCase.status)}`}>
                      {getStatusText(violationCase.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditForm(violationCase)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Засах"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleRejectCase(violationCase)}
                        className="text-red-600 hover:text-red-900"
                        title="Татгалзах"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCase(violationCase.id)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Устгах"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">Хэрэг олдсонгүй</div>
          </div>
        )}
      </div>

      {/* Форм */}
      <ViolationCaseForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingCase ? handleEditCase : handleAddCase}
        violationCase={editingCase}
      />
    </div>
  )
}

export default ViolationCaseManagement
