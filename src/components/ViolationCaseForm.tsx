'use client'

import { useState, useEffect } from 'react'
import { X, Save, FileText, Calendar, MapPin, User, Phone, AlertTriangle } from 'lucide-react'

interface ViolationCase {
  // Үндсэн мэдээлэл
  caseNumber: string          // Хэргийн дугаар
  violationCode: string       // Зөрчлийн хэргийн заалт
  violationCategory: string   // Хэрэг нэгээн/хэргийн өвөг
  violationDate: string       // Огноо
  violationTime: string       // Цаг
  
  // Байршил
  location: string            // Газар нэгээн
  district: string           // Дүүсэх хугацаа (харьяалагдах дүүрэг)
  
  // Зөрчил гаргагчийн мэдээлэл  
  violatorName: string        // Хохирогчийн өвөг нэр, РД
  violatorId: string          // РД дугаар
  violatorDetails: string     // Хохирогчийн өвөг нэр, РД дэлгэрэнгүй
  
  // Товч утга
  summary: string             // Товч утга
  
  // Шийдвэрлэлт
  decision: string            // Шийдвэрлэлт
  
  // Хяналт
  status: 'active' | 'resolved' | 'pending'  // Огноо
  
  // Шалгасан албан хаагч
  officer: string             // Шалгасан алба хаагч
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (violationCase: ViolationCase) => void
  violationCase?: ViolationCase | null
}

const ViolationCaseForm = ({ isOpen, onClose, onSubmit, violationCase }: Props) => {
  // Автоматаар хэргийн дугаар үүсгэх функц
  const generateCaseNumber = (): string => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
    return `${year}00${random}`
  }

  // Check if this is from a complaint
  const getComplaintData = () => {
    if (typeof window !== 'undefined') {
      const complaintData = localStorage.getItem('violationFromComplaint')
      if (complaintData) {
        const data = JSON.parse(complaintData)
        localStorage.removeItem('violationFromComplaint') // Clean up
        return data
      }
    }
    return null
  }

  const complaintData = getComplaintData()

  const [formData, setFormData] = useState<ViolationCase>({
    caseNumber: violationCase?.caseNumber || generateCaseNumber(),
    violationCode: violationCase?.violationCode || '',
    violationCategory: violationCase?.violationCategory || '',
    violationDate: violationCase?.violationDate || new Date().toISOString().split('T')[0],
    violationTime: violationCase?.violationTime || new Date().toTimeString().split(' ')[0].slice(0, 5),
    location: violationCase?.location || complaintData?.location || '',
    district: violationCase?.district || complaintData?.district || '',
    violatorName: violationCase?.violatorName || complaintData?.violatorName || '',
    violatorId: violationCase?.violatorId || complaintData?.violatorId || '',
    violatorDetails: violationCase?.violatorDetails || (complaintData?.violatorName && complaintData?.violatorId ? `${complaintData.violatorName} ${complaintData.violatorId}` : ''),
    summary: violationCase?.summary || complaintData?.summary || '',
    decision: violationCase?.decision || '',
    status: violationCase?.status || 'pending',
    officer: violationCase?.officer || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof ViolationCase, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.caseNumber.trim()) {
      newErrors.caseNumber = 'Хэргийн дугаар шаардлагатай'
    }
    
    if (!formData.violationCode.trim()) {
      newErrors.violationCode = 'Зөрчлийн заалт шаардлагатай'
    }
    
    if (!formData.violatorName.trim()) {
      newErrors.violatorName = 'Зөрчил гаргагчийн нэр шаардлагатай'
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'Товч утга шаардлагатай'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {violationCase ? 'Зөрчлийн хэрэг засах' : 'Шинэ зөрчлийн хэрэг бүртгэх'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Үндсэн мэдээлэл */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Хэргийн дугаар */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Хэргийн дугаар *
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.caseNumber}
                  onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                    errors.caseNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2025000000754"
                />
                <button
                  type="button"
                  onClick={() => handleInputChange('caseNumber', generateCaseNumber())}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  title="Шинэ дугаар үүсгэх"
                >
                  Авто
                </button>
              </div>
              {errors.caseNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.caseNumber}</p>
              )}
            </div>

            {/* Зөрчлийн заалт */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Зөрчлийн заалт *
              </label>
              <input
                type="text"
                value={formData.violationCode}
                onChange={(e) => handleInputChange('violationCode', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                  errors.violationCode ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="5.3-1"
              />
              {errors.violationCode && (
                <p className="text-red-500 text-sm mt-1">{errors.violationCode}</p>
              )}
            </div>

            {/* Хэрэг нэгээн */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Хэрэг нэгээн/хэргийн өвөг
              </label>
              <input
                type="text"
                value={formData.violationCategory}
                onChange={(e) => handleInputChange('violationCategory', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="9.15"
              />
            </div>
          </div>

          {/* Огноо, цаг */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Зөрчил гарсан огноо *
              </label>
              <input
                type="date"
                value={formData.violationDate}
                onChange={(e) => handleInputChange('violationDate', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зөрчил гарсан цаг
              </label>
              <input
                type="time"
                value={formData.violationTime}
                onChange={(e) => handleInputChange('violationTime', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              />
            </div>
          </div>

          {/* Байршил */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Газар нэгээн
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Налайх 4-р хороо, 48-р үдамжины хэрэг маргаан үүсгээд байна"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дүүсэх хугацаа (Харьяалагдах дүүрэг)
              </label>
              <select
                value={formData.district}
                onChange={(e) => handleInputChange('district', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="" className="text-gray-500 bg-white">Дүүрэг сонгоно уу</option>
                <option value="Баянзүрх дүүрэг" className="text-gray-900 bg-white">Баянзүрх дүүрэг</option>
                <option value="Хан-Уул дүүрэг" className="text-gray-900 bg-white">Хан-Уул дүүрэг</option>
                <option value="Сүхбаатар дүүрэг" className="text-gray-900 bg-white">Сүхбаатар дүүрэг</option>
                <option value="Чингэлтэй дүүрэг" className="text-gray-900 bg-white">Чингэлтэй дүүрэг</option>
                <option value="Сонгинохайрхан дүүрэг" className="text-gray-900 bg-white">Сонгинохайрхан дүүрэг</option>
                <option value="Баянгол дүүрэг" className="text-gray-900 bg-white">Баянгол дүүрэг</option>
                <option value="Налайх дүүрэг" className="text-gray-900 bg-white">Налайх дүүрэг</option>
              </select>
            </div>
          </div>

          {/* Зөрчил гаргагчийн мэдээлэл */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-1" />
                Хохирогчийн/зөрчил гаргагчийн өвөг нэр *
              </label>
              <input
                type="text"
                value={formData.violatorName}
                onChange={(e) => handleInputChange('violatorName', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                  errors.violatorName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ж.Намуунцэцэг"
              />
              {errors.violatorName && (
                <p className="text-red-500 text-sm mt-1">{errors.violatorName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                РД дугаар
              </label>
              <input
                type="text"
                value={formData.violatorId}
                onChange={(e) => handleInputChange('violatorId', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="УД1321106"
              />
            </div>
          </div>

          {/* Дэлгэрэнгүй мэдээлэл */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Хохирогчийн дэлгэрэнгүй мэдээлэл
            </label>
            <textarea
              value={formData.violatorDetails}
              onChange={(e) => handleInputChange('violatorDetails', e.target.value)}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              placeholder="Б.Урангоо УД01262203"
            />
          </div>

          {/* Товч утга */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Товч утга *
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={3}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.summary ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Хэргийн товч тайлбар..."
            />
            {errors.summary && (
              <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
            )}
          </div>

          {/* Шийдвэрлэлт */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Шийдвэрлэлт
              </label>
              <textarea
                value={formData.decision}
                onChange={(e) => handleInputChange('decision', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Хэргийн шийдвэр, арга хэмжээ..."
              />
            </div>

            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Төлөв
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'resolved' | 'pending')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  <option value="pending" className="text-gray-900 bg-white">Хүлээгдэж байна</option>
                  <option value="active" className="text-gray-900 bg-white">Идэвхтэй</option>
                  <option value="resolved" className="text-gray-900 bg-white">Шийдвэрлэгдсэн</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Шалгасан албан хаагч
                </label>
                <input
                  type="text"
                  value={formData.officer}
                  onChange={(e) => handleInputChange('officer', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Хэргсэхүй болгосон г.Менхтэрэл тай"
                />
              </div>
            </div>
          </div>

          {/* Товчлууд */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{violationCase ? 'Хадгалах' : 'Бүртгэх'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ViolationCaseForm
