import React from 'react'
import { MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface MapComponentProps {
  incidents: any[]
}

const MapComponent: React.FC<MapComponentProps> = ({ incidents }) => {
  const districts = [
    { name: 'Хан-Уул', x: 200, y: 150, incidents: 12 },
    { name: 'Баянзүрх', x: 350, y: 100, incidents: 18 },
    { name: 'Сүхбаатар', x: 150, y: 200, incidents: 8 },
    { name: 'Чингэлтэй', x: 300, y: 200, incidents: 15 },
    { name: 'Сонгинохайрхан', x: 100, y: 100, incidents: 22 }
  ]

  const getIncidentIcon = (count: number) => {
    if (count > 20) return { icon: AlertTriangle, color: 'text-red-500 bg-red-100' }
    if (count > 10) return { icon: Clock, color: 'text-yellow-500 bg-yellow-100' }
    return { icon: CheckCircle, color: 'text-green-500 bg-green-100' }
  }

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Background map outline */}
        <rect x="50" y="50" width="300" height="200" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" rx="10" />
        
        {/* District markers */}
        {districts.map((district, index) => {
          const { icon: Icon, color } = getIncidentIcon(district.incidents)
          return (
            <g key={index}>
              <circle 
                cx={district.x} 
                cy={district.y} 
                r="20" 
                className="fill-current text-white opacity-90"
                stroke="#374151" 
                strokeWidth="2"
              />
              <text 
                x={district.x} 
                y={district.y - 25} 
                textAnchor="middle" 
                className="text-xs font-medium fill-current text-gray-700"
              >
                {district.name}
              </text>
              <text 
                x={district.x} 
                y={district.y + 5} 
                textAnchor="middle" 
                className="text-xs font-bold fill-current text-gray-900"
              >
                {district.incidents}
              </text>
            </g>
          )
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-md">
        <div className="text-xs font-semibold mb-2">Гэмт хэргийн түвшин</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
            </div>
            <span>Өндөр (20+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
            </div>
            <span>Дундаж (10-20)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            </div>
            <span>Бага (10-)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapComponent
