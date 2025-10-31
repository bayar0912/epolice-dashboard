'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Search, Filter, Download, FileText, Calendar } from 'lucide-react'
import ComplaintFormNew from './ComplaintFormNew'
import { useRouter } from 'next/navigation'

interface Complaint {
  id: number
  eventDate: string               // Утас авсан он, сар, өдөр, цаг
  complainantName: string         // Дуудлага авсан ажилтан
  eventType: string              // Төрөл (dropdown select)
  urgency: string                // Дуудлагын ангилал (Соттуу, Яаралтай, Маньсүргай)  
  region: string                 // Хаяг, хот (dropdown)
  district: string               // Сум, дүүрэг (dropdown)
  address: string                // Баг, хороо
  description: string            // Дуудлагын утга
  status: 'pending' | 'investigating' | 'resolved' | 'closed'
  createdAt: string
}

const ComplaintManagement = () => {
  const router = useRouter()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null)
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Гомдлын жагсаалт
  useEffect(() => {
    const mockComplaints: Complaint[] = [
      {
        id: 1,
        eventDate: '2024-10-06T10:30:00',
        complainantName: 'Б.Одончимэг',
        eventType: 'Хулгайн гэмт хэрэг',
        urgency: 'Яаралтай',
        region: 'Налайх дүүрэг',
        district: '1-р хороо',
        address: '15-р хороолол, 25-р байр',
        description: 'нд-н 1-р хороо баян налайх бааранд хүмүүс танхайраад байна гэх',
        status: 'pending',
        createdAt: '2024-10-06T10:30:00'
      },
      {
        id: 2,
        eventDate: '2024-10-06T11:15:00',
        complainantName: 'Д.Батжаргал',
        eventType: 'Зам тээврийн осол',
        urgency: 'Соттуу',
        region: 'Налайх дүүрэг',
        district: '3-р хороо',
        address: '8-р хороолол, 12-р байр',
        description: 'Зам тээврийн ослол болсон',
        status: 'investigating',
        createdAt: '2024-10-06T11:15:00'
      }
    ]
    setComplaints(mockComplaints)
    setFilteredComplaints(mockComplaints)
  }, [])

  // Хайлт болон шүүлт
  useEffect(() => {
    let filtered = complaints.filter(complaint => {
      const matchesSearch = complaint.complainantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           complaint.address.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
    
    setFilteredComplaints(filtered)
  }, [searchTerm, filterStatus, complaints])

  const handleSubmit = (complaintData: any) => {
    if (editingComplaint) {
      // Засварлах
      const updatedComplaints = complaints.map(complaint =>
        complaint.id === editingComplaint.id 
          ? { ...complaint, ...complaintData }
          : complaint
      )
      setComplaints(updatedComplaints)
    } else {
      // Шинэ нэмэх
      const newComplaint: Complaint = {
        id: Date.now(),
        ...complaintData,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      setComplaints([...complaints, newComplaint])
    }
    
    setShowForm(false)
    setEditingComplaint(null)
  }

  const handleEdit = (complaint: Complaint) => {
    setEditingComplaint(complaint)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Энэ гомдлыг устгахдаа итгэлтэй байна уу?')) {
      setComplaints(complaints.filter(complaint => complaint.id !== id))
    }
  }

  const handleCreateViolationCase = (complaint: Complaint) => {
    // Зөрчлийн хэрэг үүсгэх
    localStorage.setItem('violationCaseData', JSON.stringify({
      sourceComplaint: complaint,
      violationNumber: `V-${complaint.id}`,
      complainantName: complaint.complainantName,
      eventType: complaint.eventType,
      location: `${complaint.region}, ${complaint.district}`,
      address: complaint.address,
      description: complaint.description,
      reportDate: new Date().toISOString().split('T')[0]
    }))
    
    alert(`Дуудлага ${complaint.id}-с зөрчлийн хэрэг үүсгэгдлээ.`)
    router.push('/violations?openForm=true')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Хүлээгдэж буй' },
      investigating: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Шалгаж буй' },
      resolved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Шийдвэрлэсэн' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Хаагдсан' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Дуудлага авсан ажилтан', 'Дуудлагын төрөл', 'Ангилал', 'Бүс', 'Дүүрэг/Сум', 'Хаяг', 'Дуудлагын утга', 'Огноо', 'Статус']
    const csvData = [
      headers,
      ...filteredComplaints.map(complaint => [
        complaint.id.toString(),
        complaint.complainantName,
        complaint.eventType,
        complaint.urgency,
        complaint.region,
        complaint.district,
        complaint.address,
        complaint.description,
        complaint.eventDate,
        complaint.status
      ])
    ]
    
    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `complaints_${new Date().getTime()}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Гомдол мэдээллийн удирдлага</h1>
          <p className="text-gray-600 mt-1">Иргэдийн гомдол мэдээллийг бүртгэх, удирдах</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Шинэ гомдол нэмэх</span>
        </button>
      </div>

      {/* Хайлт болон шүүлт */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Дугаар, нэр, эсвэл товч утгаар хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="all" className="text-gray-900 bg-white">Бүх статус</option>
            <option value="pending" className="text-gray-900 bg-white">Хүлээгдэж буй</option>
            <option value="investigating" className="text-gray-900 bg-white">Шалгаж буй</option>
            <option value="resolved" className="text-gray-900 bg-white">Шийдвэрлэсэн</option>
            <option value="closed" className="text-gray-900 bg-white">Хаагдсан</option>
          </select>
          
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Экспорт</span>
          </button>
        </div>
      </div>

      {/* Хүснэгт */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ажилтан
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Төрөл / Ангилал
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Байршил
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дуудлагын утга
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Огноо
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {complaint.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{complaint.complainantName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{complaint.eventType}</div>
                    <div className="text-sm text-gray-500">{complaint.urgency}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{complaint.region}</div>
                    <div className="text-sm text-gray-500">{complaint.district} - {complaint.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={complaint.description}>
                      {complaint.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(complaint.eventDate).toLocaleDateString('mn-MN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(complaint.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(complaint)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Засах"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(complaint.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Устгах"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleCreateViolationCase(complaint)}
                        className="text-green-600 hover:text-green-900"
                        title="Зөрчлийн хэрэг үүсгэх"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredComplaints.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Гомдол олдсонгүй</p>
        </div>
      )}

      {/* Гомдол мэдээлэл бүртгэх форм */}
      {showForm && (
        <ComplaintFormNew
          isOpen={showForm}
          onClose={() => {
            setShowForm(false)
            setEditingComplaint(null)
          }}
          onSubmit={handleSubmit}
          complaint={editingComplaint}
        />
      )}
    </div>
  )
}

export default ComplaintManagement