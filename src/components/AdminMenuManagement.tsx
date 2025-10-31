"use client"

import { useEffect, useState } from 'react'

export default function AdminMenuManagement() {
  const [menus, setMenus] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editIdx, setEditIdx] = useState<number|null>(null)
  const [editName, setEditName] = useState('')
  const [editPath, setEditPath] = useState('')
  const [editRoles, setEditRoles] = useState('')
  const [editUserId, setEditUserId] = useState('')
  const [addName, setAddName] = useState('')
  const [addPath, setAddPath] = useState('')
  const [addRoles, setAddRoles] = useState('user')
  const [addUserId, setAddUserId] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    // Цэсний мэдээлэл татах
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenus(data.menus || [])
        setLoading(false)
      })
    
    // Хэрэглэгчдийн мэдээлэл татах
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || [])
      })
  }, [])

  const handleEdit = (idx: number) => {
    setEditIdx(idx)
    setEditName(menus[idx].name)
    setEditPath(menus[idx].path)
    setEditRoles(menus[idx].roles || 'user')
    setEditUserId(menus[idx].userId || '')
  }

  const handleSave = async (idx: number) => {
    const menu = menus[idx]
    const res = await fetch('/api/menu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: menu.id, 
        name: editName, 
        path: editPath, 
        roles: editRoles,
        userId: editUserId || null
      })
    })
    const data = await res.json()
    if (data.success) {
      const updated = [...menus]
      updated[idx] = data.menu
      setMenus(updated)
      setEditIdx(null)
    }
  }

  const handleDelete = async (idx: number) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return
    const menu = menus[idx]
    const res = await fetch('/api/menu', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: menu.id })
    })
    const data = await res.json()
    if (data.success) {
      setMenus(menus.filter((_, i) => i !== idx))
    }
  }

  const handleAdd = async () => {
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: addName, 
        path: addPath, 
        roles: addRoles,
        userId: addUserId || null
      })
    })
    const data = await res.json()
    if (data.success) {
      setMenus([...menus, data.menu])
      setAddName('')
      setAddPath('')
      setAddRoles('user')
      setAddUserId('')
      setShowAdd(false)
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Цэсний удирдлага</h1>
          <p className="text-gray-600 mt-1">Системийн цэсний тохиргоо</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Шинэ цэс нэмэх
        </button>
      </div>

      {showAdd && (
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="font-bold mb-4 text-gray-900">Шинэ цэс нэмэх</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Цэсний нэр" 
              value={addName} 
              onChange={e => setAddName(e.target.value)} 
              className="border rounded p-2 text-gray-900"
            />
            <input 
              type="text" 
              placeholder="Зам (жишээ: /dashboard)" 
              value={addPath} 
              onChange={e => setAddPath(e.target.value)} 
              className="border rounded p-2 text-gray-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Эрхүүд (жишээ: admin,user)" 
              value={addRoles} 
              onChange={e => setAddRoles(e.target.value)} 
              className="border rounded p-2 text-gray-900"
            />
            <select 
              value={addUserId} 
              onChange={e => setAddUserId(e.target.value)} 
              className="border rounded p-2 text-gray-900"
            >
              <option value="" className="text-gray-500 bg-white">Бүх хэрэглэгч</option>
              {users.map(user => (
                <option key={user.id} value={user.id} className="text-gray-900 bg-white">
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Нэмэх</button>
            <button onClick={() => setShowAdd(false)} className="bg-gray-300 px-4 py-2 rounded">Болих</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-900">Ачааллаж байна...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Зам</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Эрхүүд</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хэрэглэгч</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menus.map((m, idx) => (
                <tr key={m.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editIdx === idx ? (
                      <input value={editName} onChange={e => setEditName(e.target.value)} className="border rounded p-1 text-gray-900" />
                    ) : m.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editIdx === idx ? (
                      <input value={editPath} onChange={e => setEditPath(e.target.value)} className="border rounded p-1 text-gray-900" />
                    ) : m.path}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editIdx === idx ? (
                      <input value={editRoles} onChange={e => setEditRoles(e.target.value)} className="border rounded p-1 text-gray-900" />
                    ) : m.roles}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editIdx === idx ? (
                      <select value={editUserId} onChange={e => setEditUserId(e.target.value)} className="border rounded p-1 text-gray-900">
                        <option value="" className="text-gray-500 bg-white">Бүх хэрэглэгч</option>
                        {users.map(user => (
                          <option key={user.id} value={user.id} className="text-gray-900 bg-white">
                            {user.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      m.userId ? users.find(u => u.id == m.userId)?.name || 'Тодорхойгүй' : 'Бүх хэрэглэгч'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editIdx === idx ? (
                      <div className="flex space-x-2">
                        <button onClick={() => handleSave(idx)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Хадгалах</button>
                        <button onClick={() => setEditIdx(null)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">Болих</button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(idx)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Засах</button>
                        <button onClick={() => handleDelete(idx)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Устгах</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
