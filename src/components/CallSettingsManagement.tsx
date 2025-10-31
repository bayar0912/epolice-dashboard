"use client"

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Settings } from 'lucide-react'

export default function CallSettingsManagement() {
  const [callTypes, setCallTypes] = useState<any[]>([])
  const [callCategories, setCallCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Call Types states
  const [editTypeIdx, setEditTypeIdx] = useState<number|null>(null)
  const [editTypeName, setEditTypeName] = useState('')
  const [addTypeName, setAddTypeName] = useState('')
  const [showAddType, setShowAddType] = useState(false)
  
  // Call Categories states
  const [editCategoryIdx, setEditCategoryIdx] = useState<number|null>(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [addCategoryName, setAddCategoryName] = useState('')
  const [showAddCategory, setShowAddCategory] = useState(false)

  const fetchData = () => {
    // Fetch call types
    fetch('/api/call-types')
      .then(res => res.json())
      .then(data => {
        setCallTypes(data.callTypes || [])
      })
      .catch(() => setCallTypes([
        {id: 1, name: 'Согтуулгатай холбоотой зөрчил'},
        {id: 2, name: 'Гэр бүлийн хүчирхийлэл'},
        {id: 3, name: 'Эзэмшил эрхийг зөрчих'},
        {id: 4, name: 'Замын хөдөлгөөний зөрчил'}
      ]))

    // Fetch call categories
    fetch('/api/call-categories')
      .then(res => res.json())
      .then(data => {
        setCallCategories(data.categories || [])
        setLoading(false)
      })
      .catch(() => {
        setCallCategories([
          {id: 1, name: 'Соттуу'},
          {id: 2, name: 'Яаралтай'},
          {id: 3, name: 'Маньсүргай'}
        ])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Call Types handlers
  const handleEditType = (idx: number) => {
    setEditTypeIdx(idx)
    setEditTypeName(callTypes[idx].name)
  }

  const handleSaveType = async (idx: number) => {
    const type = callTypes[idx]
    const res = await fetch('/api/call-types', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: type.id, name: editTypeName })
    })
    const data = await res.json()
    if (data.success) {
      fetchData()
      setEditTypeIdx(null)
    }
  }

  const handleDeleteType = async (idx: number) => {
    if (!confirm('Дуудлагын төрлийг устгахдаа итгэлтэй байна уу?')) return
    const type = callTypes[idx]
    const res = await fetch('/api/call-types', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: type.id })
    })
    const data = await res.json()
    if (data.success) {
      fetchData()
    }
  }

  const handleAddType = async () => {
    const res = await fetch('/api/call-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addTypeName })
    })
    const data = await res.json()
    if (data.success) {
      fetchData()
      setAddTypeName('')
      setShowAddType(false)
    } else {
      alert(data.message)
    }
  }

  // Call Categories handlers
  const handleEditCategory = (idx: number) => {
    setEditCategoryIdx(idx)
    setEditCategoryName(callCategories[idx].name)
  }

  const handleSaveCategory = async (idx: number) => {
    const category = callCategories[idx]
    const res = await fetch('/api/call-categories', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: category.id, name: editCategoryName })
    })
    const data = await res.json()
    if (data.success) {
      fetchData()
      setEditCategoryIdx(null)
    }
  }

  const handleDeleteCategory = async (idx: number) => {
    if (!confirm('Дуудлагын ангиллыг устгахдаа итгэлтэй байна уу?')) return
    const category = callCategories[idx]
    const res = await fetch('/api/call-categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: category.id })
    })
    const data = await res.json()
    if (data.success) {
      fetchData()
    }
  }

  const handleAddCategory = async () => {
    const res = await fetch('/api/call-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addCategoryName })
    })
    const data = await res.json()
    if (data.success) {
      fetchData()
      setAddCategoryName('')
      setShowAddCategory(false)
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="p-6 bg-white space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="h-6 w-6 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Дуудлагын тохиргоо</h1>
      </div>

      {/* Дуудлагын төрөл */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Дуудлагын төрөл</h2>
            <p className="text-gray-600 mt-1">Дуудлагын төрлийн жагсаалт</p>
          </div>
          <button 
            onClick={() => setShowAddType(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Шинэ төрөл нэмэх</span>
          </button>
        </div>

        {showAddType && (
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-bold mb-4 text-gray-900">Шинэ дуудлагын төрөл нэмэх</h3>
            <div className="flex space-x-4">
              <input 
                type="text" 
                placeholder="Төрлийн нэр" 
                value={addTypeName} 
                onChange={e => setAddTypeName(e.target.value)} 
                className="flex-1 border rounded p-2 text-gray-900"
              />
              <button onClick={handleAddType} className="bg-green-500 text-white px-4 py-2 rounded">Нэмэх</button>
              <button onClick={() => setShowAddType(false)} className="bg-gray-300 px-4 py-2 rounded">Болих</button>
            </div>
          </div>
        )}

        <div className="overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {callTypes.map((type, idx) => (
                <tr key={type.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editTypeIdx === idx ? (
                      <input value={editTypeName} onChange={e => setEditTypeName(e.target.value)} className="border rounded p-1 text-gray-900" />
                    ) : type.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editTypeIdx === idx ? (
                      <div className="flex space-x-2">
                        <button onClick={() => handleSaveType(idx)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Хадгалах</button>
                        <button onClick={() => setEditTypeIdx(null)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">Болих</button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditType(idx)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteType(idx)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Дуудлагын ангилал */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Дуудлагын ангилал</h2>
            <p className="text-gray-600 mt-1">Дуудлагын ангиллын жагсаалт</p>
          </div>
          <button 
            onClick={() => setShowAddCategory(true)} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Шинэ ангилал нэмэх</span>
          </button>
        </div>

        {showAddCategory && (
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h3 className="font-bold mb-4 text-gray-900">Шинэ дуудлагын ангилал нэмэх</h3>
            <div className="flex space-x-4">
              <input 
                type="text" 
                placeholder="Ангиллын нэр" 
                value={addCategoryName} 
                onChange={e => setAddCategoryName(e.target.value)} 
                className="flex-1 border rounded p-2 text-gray-900"
              />
              <button onClick={handleAddCategory} className="bg-green-500 text-white px-4 py-2 rounded">Нэмэх</button>
              <button onClick={() => setShowAddCategory(false)} className="bg-gray-300 px-4 py-2 rounded">Болих</button>
            </div>
          </div>
        )}

        <div className="overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {callCategories.map((category, idx) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editCategoryIdx === idx ? (
                      <input value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} className="border rounded p-1 text-gray-900" />
                    ) : category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editCategoryIdx === idx ? (
                      <div className="flex space-x-2">
                        <button onClick={() => handleSaveCategory(idx)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Хадгалах</button>
                        <button onClick={() => setEditCategoryIdx(null)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">Болих</button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button onClick={() => handleEditCategory(idx)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteCategory(idx)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
