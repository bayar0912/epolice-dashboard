import React, { useState } from 'react'
import { Search, Filter, Download, Plus, Edit, Trash2, Eye } from 'lucide-react'

interface DataTableProps {
  title: string
  data: any[]
  columns: string[]
  onAdd?: () => void
  onEdit?: (item: any) => void
  onDelete?: (id: number) => void
  onView?: (item: any) => void
}

const DataTable: React.FC<DataTableProps> = ({
  title,
  data,
  columns,
  onAdd,
  onEdit,
  onDelete,
  onView
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredData = data.filter(item => {
    const matchesSearch = Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex flex-wrap items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Хайх..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="all" className="text-gray-900 bg-white">Бүгд</option>
              <option value="active" className="text-gray-900 bg-white">Идэвхтэй</option>
              <option value="completed" className="text-gray-900 bg-white">Дууссан</option>
              <option value="pending" className="text-gray-900 bg-white">Хүлээгдэж буй</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
              <Filter className="h-4 w-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
              <Download className="h-4 w-4" />
            </button>
            {onAdd && (
              <button
                onClick={onAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Нэмэх</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Үйлдэл
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof item[column.toLowerCase()] === 'object' ? 
                      JSON.stringify(item[column.toLowerCase()]) : 
                      item[column.toLowerCase()] || '-'
                    }
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {onView && (
                      <button
                        onClick={() => onView(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Харах"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Засах"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Устгах"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Нийт <span className="font-medium">{filteredData.length}</span> бичлэг
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
              Өмнөх
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</span>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
              Дараах
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable
