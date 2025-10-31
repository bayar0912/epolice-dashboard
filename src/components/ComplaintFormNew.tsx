'use client'

import { useState, useEffect } from 'react'
import { X, Save, FileText, Calendar, MapPin, User, Phone, AlertTriangle, Clock, UserCheck } from 'lucide-react'

interface ComplaintForm {
  // Дуудлагын үндсэн мэдээлэл
  callNumber: string              // Дуудлагын дугаар
  eventDate: string               // Утас авсан он, сар, өдөр, цаг
  complainantName: string         // Дуудлага авсан ажилтан
  eventType: string              // Төрөл (dropdown select)
  urgency: string                // Дуудлагын ангилал (Соттуу, Яаралтай, Маньсүргай)  
  
  // Байршлын мэдээлэл
  region: string                 // Хаяг, хот (dropdown)
  district: string               // Сум, дүүрэг (dropdown)
  address: string                // Баг, хороо
  detailedAddress: string        // Нарийвчилсан хаяг
  
  // Дуудлагын утга
  description: string            // Дуудлагын утга
  
  // Үргэлжлүүлэх мэдээлэл
  actionTaken: string            // Авсан арга хэмжээ
  assignedOfficer: string        // Томилогдсон ажилтан
  followUpDate: string           // Дараачийн хяналтын огноо
  
  // Нэмэлт мэдээлэл
  witnessInfo: string            // Гэрчийн мэдээлэл
  evidenceDescription: string    // Нотлох баримтын тайлбар
  relatedCases: string          // Холбогдох хэргүүд
  
  // Төлөв
  status: 'pending' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (complaint: ComplaintForm) => void
  complaint?: ComplaintForm | null
}

const ComplaintFormNew = ({ isOpen, onClose, onSubmit, complaint }: Props) => {
  const [callTypes, setCallTypes] = useState<Array<{id: number, name: string}>>([])
  const [callCategories, setCallCategories] = useState<Array<{id: number, name: string}>>([])
  const [regions, setRegions] = useState<Array<{id: number, name: string}>>([])
  const [districts, setDistricts] = useState<Array<{id: number, name: string}>>([])

  const [formData, setFormData] = useState<ComplaintForm>({
    callNumber: complaint?.callNumber || `DL-${Date.now().toString().slice(-8)}`,
    eventDate: complaint?.eventDate || new Date().toISOString().slice(0, 16),
    complainantName: complaint?.complainantName || '',
    eventType: complaint?.eventType || '',
    urgency: complaint?.urgency || 'Маньсүргай',
    region: complaint?.region || '',
    district: complaint?.district || '',
    address: complaint?.address || '',
    detailedAddress: complaint?.detailedAddress || '',
    description: complaint?.description || '',
    actionTaken: complaint?.actionTaken || '',
    assignedOfficer: complaint?.assignedOfficer || '',
    followUpDate: complaint?.followUpDate || '',
    witnessInfo: complaint?.witnessInfo || '',
    evidenceDescription: complaint?.evidenceDescription || '',
    relatedCases: complaint?.relatedCases || '',
    status: complaint?.status || 'pending',
    priority: complaint?.priority || 'medium'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load configuration data
  useEffect(() => {
    // Load call types
    fetch('/api/call-types')
      .then(res => res.json())
      .then(data => setCallTypes(data.callTypes || []))
      .catch(() => setCallTypes([
        {id: 1, name: 'Согтуулгатай холбоотой зөрчил'},
        {id: 2, name: 'Гэр бүлийн хүчирхийлэл'},
        {id: 3, name: 'Эзэмшил эрхийг зөрчих'},
        {id: 4, name: 'Замын хөдөлгөөний зөрчил'},
        {id: 5, name: 'Эрүүгийн хэрэг'},
        {id: 6, name: 'Захиргааны зөрчил'},
        {id: 7, name: 'Хүчирхийлэл'},
        {id: 8, name: 'Хулгай дээрэм'},
        {id: 9, name: 'Мансууруулах бодисын хэрэг'},
        {id: 10, name: 'Бусад'}
      ]))

    // Load regions
    setRegions([
      {id: 1, name: 'Улаанбаатар'},
      {id: 2, name: 'Дархан-Уул'},
      {id: 3, name: 'Орхон'},
      {id: 4, name: 'Сэлэнгэ'},
      {id: 5, name: 'Төв'},
      {id: 6, name: 'Хэнтий'}
    ])

    // Load districts  
    setDistricts([
      {id: 1, name: 'Баянзүрх'},
      {id: 2, name: 'Хан-Уул'},
      {id: 3, name: 'Сүхбаатар'},
      {id: 4, name: 'Баянгол'},
      {id: 5, name: 'Чингэлтэй'},
      {id: 6, name: 'Налайх'},
      {id: 7, name: 'Сонгинохайрхан'}
    ])
  }, [])

  const handleInputChange = (field: keyof ComplaintForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.eventDate.trim()) {
      newErrors.eventDate = 'Утас авсан огноо, цагийг оруулна уу'
    }

    if (!formData.complainantName.trim()) {
      newErrors.complainantName = 'Дуудлага авсан ажилтныг оруулна уу'
    }

    if (!formData.eventType.trim()) {
      newErrors.eventType = 'Төрлийг сонгоно уу'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Дуудлагын утгыг оруулна уу'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
      
      // Show success message
      alert(`Дуудлага амжилттай бүртгэгдэж, мэдээлэл удирдлагад шилжүүлэгдлээ.`)
      
      // Reset form
      setFormData({
        callNumber: `DL-${Date.now().toString().slice(-8)}`,
        eventDate: new Date().toISOString().slice(0, 16),
        complainantName: '',
        eventType: '',
        urgency: 'Маньсүргай',
        region: '',
        district: '',
        address: '',
        detailedAddress: '',
        description: '',
        actionTaken: '',
        assignedOfficer: '',
        followUpDate: '',
        witnessInfo: '',
        evidenceDescription: '',
        relatedCases: '',
        status: 'pending',
        priority: 'medium'
      })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-100">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-green-700" />
            <h2 className="text-xl font-bold text-green-800">
              Дуудлага мэдээлэл
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Үндсэн мэдээлэл */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
              Үндсэн мэдээлэл
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Утас */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Утас *:
                </label>
                <input
                  type="text"
                  value={formData.callNumber}
                  onChange={(e) => handleInputChange('callNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-gray-100"
                  readOnly
                />
              </div>

              {/* Дуудлагын ангилал */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дуудлагын ангилал *:
                </label>
                <input
                  type="text"
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.eventType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Дуудлагын ангилал"
                  required
                />
                {errors.eventType && (
                  <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>
                )}
              </div>

              {/* Төрөл */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Төрөл:
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => handleInputChange('urgency', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Маньсүргай" className="text-gray-900 bg-white">Маньсүргай</option>
                  <option value="Яаралтай" className="text-gray-900 bg-white">Яаралтай</option>
                  <option value="Соттуу" className="text-gray-900 bg-white">Соттуу</option>
                </select>
              </div>

              {/* Жагсаалт сонгогч checkbox-ууд */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Жагсаалт сонгогч:
                </label>
                <div className="flex flex-col space-y-1">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2 text-blue-600" />
                    Жагсаалт 1
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2 text-blue-600" />
                    ЭТ осол
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2 text-blue-600" />
                    Гал засаг
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-2 text-blue-600" />
                    Согтуу
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Аймаг, хот */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Аймаг, хот:
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" className="text-gray-500 bg-white">Сонгох</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.name} className="text-gray-900 bg-white">{region.name}</option>
                  ))}
                </select>
              </div>

              {/* Сум, дүүрэг */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сум, дүүрэг:
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" className="text-gray-500 bg-white">Сонгох</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.name} className="text-gray-900 bg-white">{district.name}</option>
                  ))}
                </select>
              </div>

              {/* Баг, хороо */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Баг, хороо:
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Баг, хороо"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Хаяг:
              </label>
              <input
                type="text"
                value={formData.detailedAddress}
                onChange={(e) => handleInputChange('detailedAddress', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Дэлгэрэнгүй хаяг"
              />
            </div>
          </div>

          {/* Иргэний мэдээлэл */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4 border-b border-yellow-300 pb-2">
              Иргэний мэдээлэл
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Нэр */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Нэр:
                </label>
                <input
                  type="text"
                  value={formData.complainantName}
                  onChange={(e) => handleInputChange('complainantName', e.target.value)}
                  className={`w-full border rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.complainantName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Иргэний нэр"
                  required
                />
                {errors.complainantName && (
                  <p className="text-red-500 text-xs mt-1">{errors.complainantName}</p>
                )}
              </div>

              {/* Дуудлагын өгөгдөл */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дуудлагын өгөгдөл:
                </label>
                <div className="flex space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="Соттуу"
                      checked={formData.priority === 'Соттуу'}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Соттуу</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="Энгийн"
                      checked={formData.priority === 'Энгийн'}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Энгийн</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      value="Маньсүргай"
                      checked={formData.priority === 'Маньсүргай'}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="mr-2 text-blue-600"
                    />
                    <span className="text-sm">Маньсүргай</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Дуудлагын утга */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 border-b border-blue-300 pb-2">
              Дуудлагын утга
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дуудлагын утга *:
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={6}
                className={`w-full border rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Дуудлагын дэлгэрэнгүй мэдээлэл оруулна уу..."
                required
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Дуудлагын хувааралт */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-800 mb-4 border-b border-green-300 pb-2">
              Дуудлагын хувааралт
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Эргэний төрөл</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Нэр /Дуудлага/</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Алба хаагч</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Утас</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Эхлэх огноо</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Дуусах огноо</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                      <input 
                        type="text" 
                        className="w-full border-0 focus:ring-0 text-sm text-gray-900" 
                        placeholder="Төрөл"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                      <input 
                        type="text" 
                        className="w-full border-0 focus:ring-0 text-sm text-gray-900" 
                        placeholder="Нэр"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                      <input 
                        type="text" 
                        value={formData.assignedOfficer}
                        onChange={(e) => handleInputChange('assignedOfficer', e.target.value)}
                        className="w-full border-0 focus:ring-0 text-sm text-gray-900" 
                        placeholder="Алба хаагч"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                      <input 
                        type="text" 
                        className="w-full border-0 focus:ring-0 text-sm text-gray-900" 
                        placeholder="Утас"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                      <input 
                        type="datetime-local"
                        value={formData.eventDate}
                        onChange={(e) => handleInputChange('eventDate', e.target.value)}
                        className="w-full border-0 focus:ring-0 text-sm text-gray-900" 
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900">
                      <input 
                        type="datetime-local"
                        value={formData.followUpDate}
                        onChange={(e) => handleInputChange('followUpDate', e.target.value)}
                        className="w-full border-0 focus:ring-0 text-sm text-gray-900" 
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              <span className="text-red-500">*</span> заавал бөглөх талбарууд
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Буцах
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Хадгалах</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ComplaintFormNew
