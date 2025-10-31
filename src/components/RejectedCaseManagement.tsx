'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Download, Edit, Trash2, Eye, Filter, AlertTriangle } from 'lucide-react'
import RejectedCaseForm from './RejectedCaseForm'
import { useRouter, useSearchParams } from 'next/navigation'

interface RejectedCase {
  id: number
  caseNumber: string
  summary: string
  complainantInfo: string
  rejectionDate: string
  rejectionReason: string
  responsibleUnit: string
}

const RejectedCaseManagement = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cases, setCases] = useState<RejectedCase[]>([
    {
      id: 1,
      caseNumber: '3-0008',
      summary: 'НД-ийн 2-р хороонд 74-өө улсын дугаартай тээврийн хэрэгсэлтэй үл танин зарлуст зөрчилүүлсэн гэх',
      complainantInfo: 'Гэрэлийн Азжүү',
      rejectionDate: '2025-10-06',
      rejectionReason: 'Хохирогчийн мэдээлэл хүрэлцээгүй',
      responsibleUnit: 'дн О.Маягарсүрэн'
    }
  ])

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCase, setEditingCase] = useState<RejectedCase | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Check if coming from violation page
  useEffect(() => {
    const fromViolation = searchParams.get('from')
    if (fromViolation === 'violation') {
      // Auto-open form if coming from violation
      setIsFormOpen(true)
    }
  }, [searchParams])

  const handleAddCase = (newCase: Omit<RejectedCase, 'id'>) => {
    const caseWithId: RejectedCase = {
      ...newCase,
      id: Date.now()
    }
    setCases(prev => [caseWithId, ...prev])
  }

  const handleEditCase = (updatedCase: Omit<RejectedCase, 'id'>) => {
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
    if (window.confirm('Энэ бүртгэлийг устгахдаа итгэлтэй байна уу?')) {
      setCases(prev => prev.filter(c => c.id !== id))
    }
  }

  const openEditForm = (rejectedCase: RejectedCase) => {
    setEditingCase(rejectedCase)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingCase(null)
  }

  const exportToCSV = () => {
    const headers = [
      'Гомдлын дугаар', 'Товч утга', 'Хохирогчийн өвөг нэр РД', 
      'Шийдвэрлэгсэн огноо', 'Шийдвэрлэгсэн үндэслэл', 'Шалгасан ЭЗАТ'
    ]
    
    const csvContent = [
      headers.join(','),
      ...filteredCases.map(c => [
        c.caseNumber, c.summary, c.complainantInfo, 
        c.rejectionDate, c.rejectionReason, c.responsibleUnit
      ].map(field => `"${field || ''}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'rejected_cases.csv'
    link.click()
  }

  const filteredCases = cases.filter(rejectedCase => {
    const searchLower = searchTerm.toLowerCase()
    return (
      rejectedCase.caseNumber.toLowerCase().includes(searchLower) ||
      rejectedCase.summary.toLowerCase().includes(searchLower) ||
      rejectedCase.complainantInfo.toLowerCase().includes(searchLower) ||
      rejectedCase.rejectionReason.toLowerCase().includes(searchLower) ||
      rejectedCase.responsibleUnit.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-6">
      {/* Толгой хэсэг */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <span>Зөрчлийн талаарх гомдол, мэдээллийг хүлээн авахаас татгалзаж шийдвэрлэгсэн бүртгэл</span>
          </h1>
          <p className="text-gray-600 mt-2">Татгалзсан гомдол мэдээллийн бүртгэл, харуулалт, удирдлага</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Шинэ татгалзал нэмэх</span>
        </button>
      </div>

      {/* Хайлт ба экспорт */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Гомдлын дугаар, товч утга, хохирогчийн нэр, үндэслэлээр хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full text-gray-900"
            />
          </div>
        </div>
        
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
        >
          <Download className="h-4 w-4" />
          <span>Экспорт</span>
        </button>
      </div>

      {/* Статистик */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-red-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{cases.length}</div>
              <div className="text-sm text-gray-600">Нийт татгалзсан</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-blue-600">{cases.filter(c => c.rejectionDate === new Date().toISOString().split('T')[0]).length}</div>
          <div className="text-sm text-gray-600">Өнөөдөр татгалзсан</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="text-2xl font-bold text-purple-600">{new Set(cases.map(c => c.responsibleUnit)).size}</div>
          <div className="text-sm text-gray-600">Хариуцсан ЭЗАТ</div>
        </div>
      </div>

      {/* Хүснэгт */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Гомдлын дугаар
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Товч утга
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Хохирогчийн өвөг, нэр, РД
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Шийдвэрлэгсэн огноо
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Шийдвэрлэгсэн үндэслэл
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Шалгасан ЭЗАТ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases.map((rejectedCase) => (
                <tr key={rejectedCase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rejectedCase.caseNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900" title={rejectedCase.summary}>
                      {rejectedCase.summary.length > 50 
                        ? `${rejectedCase.summary.substring(0, 50)}...` 
                        : rejectedCase.summary}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{rejectedCase.complainantInfo}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rejectedCase.rejectionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900" title={rejectedCase.rejectionReason}>
                      {rejectedCase.rejectionReason.length > 30 
                        ? `${rejectedCase.rejectionReason.substring(0, 30)}...` 
                        : rejectedCase.rejectionReason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rejectedCase.responsibleUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditForm(rejectedCase)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Засах"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCase(rejectedCase.id)}
                        className="text-red-600 hover:text-red-900"
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
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2 text-gray-500">Татгалзсан бүртгэл олдсонгүй</div>
          </div>
        )}
      </div>

      {/* Форм */}
      <RejectedCaseForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={editingCase ? handleEditCase : handleAddCase}
        rejectedCase={editingCase}
      />
    </div>
  )
}

export default RejectedCaseManagement
