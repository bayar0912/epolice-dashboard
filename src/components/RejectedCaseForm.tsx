'use client'

import { useState, useEffect } from 'react'
import { X, Save, FileText, Calendar, User, AlertTriangle } from 'lucide-react'

interface RejectedCase {
  // Үндсэн мэдээлэл
  caseNumber: string          // Гомдлын дугаар
  summary: string             // Товч утга
  complainantInfo: string     // Хохирогчийн өвөг, нэр, РД
  rejectionDate: string       // Шийдвэрлэгсэн огноо
  rejectionReason: string     // Шийдвэрлэгсэн үндэслэл
  responsibleUnit: string     // Шалгасан ЭЗАТ
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rejectedCase: RejectedCase) => void
  rejectedCase?: RejectedCase | null
}

const RejectedCaseForm = ({ isOpen, onClose, onSubmit, rejectedCase }: Props) => {
  // Автоматаар гомдлын дугаар үүсгэх функц
  const generateCaseNumber = (): string => {
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `3-${random}`
  }

  // Check if this is from a violation case
  const getViolationData = () => {
    if (typeof window !== 'undefined') {
      const violationData = localStorage.getItem('rejectedFromViolation')
      if (violationData) {
        const data = JSON.parse(violationData)
        localStorage.removeItem('rejectedFromViolation') // Clean up
        return data
      }
    }
    return null
  }

  const violationData = getViolationData()

  const [formData, setFormData] = useState<RejectedCase>({
    caseNumber: rejectedCase?.caseNumber || generateCaseNumber(),
    summary: rejectedCase?.summary || violationData?.summary || '',
    complainantInfo: rejectedCase?.complainantInfo || (violationData?.violatorName && violationData?.violatorId ? `${violationData.violatorName} ${violationData.violatorId}` : ''),
    rejectionDate: rejectedCase?.rejectionDate || new Date().toISOString().split('T')[0],
    rejectionReason: rejectedCase?.rejectionReason || (violationData?.sourceViolation ? `Зөрчлийн хэрэг ${violationData.sourceViolation}-ийг татгалзсан` : ''),
    responsibleUnit: rejectedCase?.responsibleUnit || violationData?.rejectedBy || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof RejectedCase, value: string) => {
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
      newErrors.caseNumber = 'Гомдлын дугаар шаардлагатай'
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'Товч утга шаардлагатай'
    }
    
    if (!formData.complainantInfo.trim()) {
      newErrors.complainantInfo = 'Хохирогчийн мэдээлэл шаардлагатай'
    }
    
    if (!formData.rejectionReason.trim()) {
      newErrors.rejectionReason = 'Шийдвэрлэгсэн үндэслэл шаардлагатай'
    }

    if (!formData.responsibleUnit.trim()) {
      newErrors.responsibleUnit = 'Шалгасан ЭЗАТ шаардлагатай'
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {rejectedCase ? 'Татгалзсан бүртгэл засах' : 'Шинэ татгалзсан бүртгэл үүсгэх'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Гомдлын дугаар */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Гомдлын дугаар *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.caseNumber}
                onChange={(e) => handleInputChange('caseNumber', e.target.value)}
                className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                  errors.caseNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="3-0008"
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

          {/* Товч утга */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Товч утга *
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={4}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.summary ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="НД-ийн 2-р хороонд 74-өө улсын дугаартай тээврийн хэрэгсэлтэй үл танин зарлуст зөрчилүүлсэн гэх"
            />
            {errors.summary && (
              <p className="text-red-500 text-sm mt-1">{errors.summary}</p>
            )}
          </div>

          {/* Хохирогчийн мэдээлэл */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Хохирогчийн өвөг, нэр, РД *
            </label>
            <input
              type="text"
              value={formData.complainantInfo}
              onChange={(e) => handleInputChange('complainantInfo', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.complainantInfo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Гэрэлийн Азжүү"
            />
            {errors.complainantInfo && (
              <p className="text-red-500 text-sm mt-1">{errors.complainantInfo}</p>
            )}
          </div>

          {/* Шийдвэрлэгсэн огноо */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-1" />
              Шийдвэрлэгсэн огноо *
            </label>
            <input
              type="date"
              value={formData.rejectionDate}
              onChange={(e) => handleInputChange('rejectionDate', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
          </div>

          {/* Шийдвэрлэгсэн үндэслэл */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Шийдвэрлэгсэн үндэслэл *
            </label>
            <textarea
              value={formData.rejectionReason}
              onChange={(e) => handleInputChange('rejectionReason', e.target.value)}
              rows={4}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.rejectionReason ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Хохирогчийн мэдээлэл хүрэлцээгүй"
            />
            {errors.rejectionReason && (
              <p className="text-red-500 text-sm mt-1">{errors.rejectionReason}</p>
            )}
          </div>

          {/* Шалгасан ЭЗАТ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Шалгасан ЭЗАТ *
            </label>
            <select
              value={formData.responsibleUnit}
              onChange={(e) => handleInputChange('responsibleUnit', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.responsibleUnit ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="" className="text-gray-500 bg-white">ЭЗАТ сонгоно уу</option>
              <option value="дн О.Маягарсүрэн" className="text-gray-900 bg-white">дн О.Маягарсүрэн</option>
              <option value="дн Б.Батбаяр" className="text-gray-900 bg-white">дн Б.Батбаяр</option>
              <option value="дн Д.Өнөржаргал" className="text-gray-900 bg-white">дн Д.Өнөржаргал</option>
              <option value="дн С.Төмөржаргал" className="text-gray-900 bg-white">дн С.Төмөржаргал</option>
              <option value="дн Ч.Болдбаатар" className="text-gray-900 bg-white">дн Ч.Болдбаатар</option>
            </select>
            {errors.responsibleUnit && (
              <p className="text-red-500 text-sm mt-1">{errors.responsibleUnit}</p>
            )}
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
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{rejectedCase ? 'Хадгалах' : 'Бүртгэх'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RejectedCaseForm
