"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminUsersPage() {
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
  const router = useRouter()

  const fetchUsers = () => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.replace('/login')
      return
    }
    const user = JSON.parse(userStr)
    if (user.role !== 'admin' && user.role !== 'superadmin') {
      router.replace('/')
      return
    }
    fetchUsers()
  }, [router])

  const handleEdit = (u: any) => {
    setEditId(u.id)
    setEditRole(u.role)
    setEditStatus(u.status || 'active')
  }

  const handleSave = async (id: number) => {
    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: editRole, status: editStatus })
    })
    setEditId(null)
    fetchUsers()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchUsers()
  }

  const handleAddUser = async (e: any) => {
    e.preventDefault()
    setAddError('')
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
    if (!data.success) {
      setAddError(data.message || 'Алдаа гарлаа')
      return
    }
    setShowAdd(false)
    setAddName('')
    setAddEmail('')
    setAddPassword('')
    setAddRole('user')
    setAddStatus('active')
    fetchUsers()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Хэрэглэгчийн хяналт (Админ)</h1>
      <button onClick={() => setShowAdd(true)} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Шинэ хэрэглэгч нэмэх</button>
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleAddUser} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Шинэ хэрэглэгч нэмэх</h2>
            {addError && <div className="text-red-600 mb-2">{addError}</div>}
            <div className="mb-2">
              <label className="block text-gray-900 mb-1">Нэр</label>
              <input value={addName} onChange={e => setAddName(e.target.value)} className="w-full border rounded p-2 text-gray-900" required />
            </div>
            <div className="mb-2">
              <label className="block text-gray-900 mb-1">И-мэйл</label>
              <input type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} className="w-full border rounded p-2 text-gray-900" required />
            </div>
            <div className="mb-2">
              <label className="block text-gray-900 mb-1">Нууц үг</label>
              <input type="password" value={addPassword} onChange={e => setAddPassword(e.target.value)} className="w-full border rounded p-2 text-gray-900" required />
            </div>
            <div className="mb-2">
              <label className="block text-gray-900 mb-1">Эрх</label>
              <select value={addRole} onChange={e => setAddRole(e.target.value)} className="w-full border rounded p-2 text-gray-900">
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="superadmin">superadmin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 mb-1">Төлөв</label>
              <select value={addStatus} onChange={e => setAddStatus(e.target.value)} className="w-full border rounded p-2 text-gray-900">
                <option value="active">active</option>
                <option value="break">break</option>
                <option value="off-duty">off-duty</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="button" onClick={() => setShowAdd(false)} className="bg-gray-300 px-4 py-2 rounded">Болих</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Нэмэх</button>
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <div className="text-gray-900">Уншиж байна...</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow text-gray-900">
          <thead>
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Нэр</th>
              <th className="p-2 border">И-мэйл</th>
              <th className="p-2 border">Эрх</th>
              <th className="p-2 border">Төлөв</th>
              <th className="p-2 border">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="text-gray-900">
                <td className="p-2 border text-center">{u.id}</td>
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border text-center">
                  {editId === u.id ? (
                    <select value={editRole} onChange={e => setEditRole(e.target.value)} className="border rounded p-1 text-gray-900">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                  ) : u.role}
                </td>
                <td className="p-2 border text-center">
                  {editId === u.id ? (
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="border rounded p-1 text-gray-900">
                      <option value="active">active</option>
                      <option value="break">break</option>
                      <option value="off-duty">off-duty</option>
                    </select>
                  ) : u.status}
                </td>
                <td className="p-2 border text-center">
                  {editId === u.id ? (
                    <>
                      <button onClick={() => handleSave(u.id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Хадгалах</button>
                      <button onClick={() => setEditId(null)} className="bg-gray-300 px-2 py-1 rounded">Болих</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(u)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Засах</button>
                      <button onClick={() => handleDelete(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">Устгах</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
