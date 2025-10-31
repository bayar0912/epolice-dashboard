"use client"

import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'

export default function AdminUsersManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<number|null>(null)
  const [editRole, setEditRole] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [addName, setAddName] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [addPassword, setAddPassword] = useState('')
  const [addRole, setAddRole] = useState('user')
  const [addStatus, setAddStatus] = useState('active')
  const [addError, setAddError] = useState('')

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEdit = (u: any) => {
    setEditId(u.id)
    setEditRole(u.role)
    setEditStatus(u.status || 'active')
  }

  const handleSave = async (id: number) => {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: editRole, status: editStatus })
    })
    const data = await res.json()
    if (data.success) {
      fetchUsers()
      setEditId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Хэрэглэгчийг устгахдаа итгэлтэй байна уу?')) return
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const data = await res.json()
    if (data.success) {
      fetchUsers()
    }
  }

  const handleAdd = async () => {
    setAddError('')
    if (!addName || !addEmail || !addPassword) {
      setAddError('Бүх талбарыг бөглөнө үү')
      return
    }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: addName, 
        email: addEmail, 
        password: addPassword, 
        role: addRole, 
        status: addStatus 
      })
    })
    const data = await res.json()
    if (data.success) {
      fetchUsers()
      setAddName('')
      setAddEmail('')
      setAddPassword('')
      setAddRole('user')
      setAddStatus('active')
      setShowAdd(false)
    } else {
      setAddError(data.message || 'Алдаа гарлаа')
    }
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Хэрэглэгчдийн удирдлага</h1>
          <p className="text-gray-600 mt-1">Системийн хэрэглэгчдийн тохиргоо</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Шинэ хэрэглэгч нэмэх</span>
        </button>
      </div>

      {showAdd && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="font-bold mb-4 text-gray-900">Шинэ хэрэглэгч нэмэх</h3>
          {addError && <div className="bg-red-100 text-red-800 p-2 rounded mb-4">{addError}</div>}
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Нэр" 
              value={addName} 
              onChange={e => setAddName(e.target.value)} 
              className="border rounded p-2 text-gray-900"
            />
            <input 
              type="email" 
              placeholder="И-мэйл" 
              value={addEmail} 
              onChange={e => setAddEmail(e.target.value)} 
              className="border rounded p-2 text-gray-900"
            />
            <input 
              type="password" 
              placeholder="Нууц үг" 
              value={addPassword} 
              onChange={e => setAddPassword(e.target.value)} 
              className="border rounded p-2 text-gray-900"
            />
            <select 
              value={addRole} 
              onChange={e => setAddRole(e.target.value)} 
              className="border rounded p-2 text-gray-900"
            >
              <option value="user" className="text-gray-900 bg-white">Хэрэглэгч</option>
              <option value="admin" className="text-gray-900 bg-white">Админ</option>
              <option value="superadmin" className="text-gray-900 bg-white">Супер админ</option>
            </select>
            <select 
              value={addStatus} 
              onChange={e => setAddStatus(e.target.value)} 
              className="border rounded p-2 text-gray-900"
            >
              <option value="active" className="text-gray-900 bg-white">Идэвхтэй</option>
              <option value="break" className="text-gray-900 bg-white">Амралт</option>
              <option value="off-duty" className="text-gray-900 bg-white">Ажлаас чөлөөтэй</option>
            </select>
          </div>
          <div className="mt-4">
            <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700">Нэмэх</button>
            <button onClick={() => setShowAdd(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Болих</button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">И-мэйл</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Эрх</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Төлөв</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editId === u.id ? (
                      <select value={editRole} onChange={e => setEditRole(e.target.value)} className="border rounded p-1 text-gray-900">
                        <option value="user" className="text-gray-900 bg-white">Хэрэглэгч</option>
                        <option value="admin" className="text-gray-900 bg-white">Админ</option>
                        <option value="superadmin" className="text-gray-900 bg-white">Супер админ</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        u.role === 'superadmin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role === 'superadmin' ? 'Супер админ' : 
                         u.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editId === u.id ? (
                      <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="border rounded p-1 text-gray-900">
                        <option value="active" className="text-gray-900 bg-white">Идэвхтэй</option>
                        <option value="break" className="text-gray-900 bg-white">Амралт</option>
                        <option value="off-duty" className="text-gray-900 bg-white">Ажлаас чөлөөтэй</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        u.status === 'active' ? 'bg-green-100 text-green-800' :
                        u.status === 'break' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {u.status === 'active' ? 'Идэвхтэй' : 
                         u.status === 'break' ? 'Амралт' : 'Ажлаас чөлөөтэй'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editId === u.id ? (
                      <div className="flex space-x-2">
                        <button onClick={() => handleSave(u.id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Хадгалах</button>
                        <button onClick={() => setEditId(null)} className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400">Болих</button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(u)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Засах</button>
                        <button onClick={() => handleDelete(u.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Устгах</button>
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
