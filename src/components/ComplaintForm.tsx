'use client'

import { useState, useEffect } from 'react'
import { X, Save, FileText, Calendar, MapPin, User, Phone, AlertTriangle } from 'lucide-react'

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

const ComplaintFormComponent = ({ isOpen, onClose, onSubmit, complaint }: Props) => {
  const [callTypes, setCallTypes] = useState<Array<{id: number, name: string}>>([])
  const [callCategories, setCallCategories] = useState<Array<{id: number, name: string}>>([])
  const [regions, setRegions] = useState<Array<{id: number, name: string}>>([])
  const [districts, setDistricts] = useState<Array<{id: number, name: string}>>([])

  const [formData, setFormData] = useState<ComplaintForm>({
    callNumber: complaint?.callNumber || `CALL-${Date.now()}`,
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
        {id: 6, name: 'Захиргааны зөрчил'}
      ]))

    // Load call categories  
    fetch('/api/call-categories')
      .then(res => res.json())
      .then(data => setCallCategories(data.categories || []))
      .catch(() => setCallCategories([
        {id: 1, name: 'Соттуу'},
        {id: 2, name: 'Яаралтай'},
        {id: 3, name: 'Маньсүргай'}
      ]))

    // Load regions
    setRegions([
      {id: 1, name: 'Улаанбаатар'},
      {id: 2, name: 'Дархан-Уул'},
      {id: 3, name: 'Орхон'},
      {id: 4, name: 'Сэлэнгэ'}
    ])

    // Load districts  
    setDistricts([
      {id: 1, name: 'Баянзүрх'},
      {id: 2, name: 'Хан-Уул'},
      {id: 3, name: 'Сүхбаатар'},
      {id: 4, name: 'Баянгол'},
      {id: 5, name: 'Чингэлтэй'},
      {id: 6, name: 'Налайх'}
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
      newErrors.eventDate = 'Утас авсан он, сар, өдөр, цагийг оруулна уу'
    }

    if (!formData.complainantName.trim()) {
      newErrors.complainantName = 'Дуудлага авсан ажилтнаа оруулна уу'
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
        callNumber: `CALL-${Date.now()}`,
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {complaint ? 'Дуудлага засварлах' : 'Дуудлага бүртгэл'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Дуудлагын мэдээлэл хэсэг */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-4">Дуудлагын мэдээлэл</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Утас авсан огноо, цаг */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Утас:
                </label>
                <input
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange('eventDate', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.eventDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.eventDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.eventDate}</p>
                )}
              </div>

              {/* Дуудлага авсан ажилтан */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="inline h-4 w-4 mr-1" />
                  Дуудлага авсан ажилтан:
                </label>
                <input
                  type="text"
                  value={formData.complainantName}
                  onChange={(e) => handleInputChange('complainantName', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.complainantName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ажилтны нэр"
                  required
                />
                {errors.complainantName && (
                  <p className="text-red-500 text-xs mt-1">{errors.complainantName}</p>
                )}
              </div>
            </div>
          </div>

          {/* Иргэний мэдээлэл хэсэг */}
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-red-800 mb-4">Иргэний мэдээлэл</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Төрөл */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Төрөл:
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => handleInputChange('eventType', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.eventType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="" className="text-gray-500 bg-white">Төрлийг сонгоно уу</option>
                  {callTypes.map(type => (
                    <option key={type.id} value={type.name} className="text-gray-900 bg-white">{type.name}</option>
                  ))}
                </select>
                {errors.eventType && (
                  <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>
                )}
              </div>

              {/* Дуудлагын өгөгдөл */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дуудлагын өгөгдөл:
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      value="Соттуу"
                      checked={formData.urgency === 'Соттуу'}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="mr-2"
                    />
                    Соттуу
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      value="Яаралтай"
                      checked={formData.urgency === 'Яаралтай'}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="mr-2"
                    />
                    Яаралтай
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      value="Маньсүргай"
                      checked={formData.urgency === 'Маньсүргай'}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="mr-2"
                    />
                    Маньсүргай
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Хаяг, хот */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Хаяг, хот:
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" className="text-gray-500 bg-white">Хот сонгох</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="" className="text-gray-500 bg-white">Дүүрэг сонгох</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Баг, хороо"
                />
              </div>
            </div>
          </div>

          {/* Дуудлагын утга */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дуудлагын утга:
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full border rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Дуудлагын дэлгэрэнгүй мэдээлэл..."
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Болих
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Бүртгэх</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ComplaintFormComponent
