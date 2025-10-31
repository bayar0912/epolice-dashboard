"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editIdx, setEditIdx] = useState<number|null>(null)
  const [editRole, setEditRole] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [addName, setAddName] = useState('')
  const [addDesc, setAddDesc] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/roles')
      .then(res => res.json())
      .then(data => {
        setRoles(data.roles || [])
        setLoading(false)
      })
  }, [])

  const handleEdit = (idx: number) => {
    setEditIdx(idx)
    setEditRole(roles[idx].name)
    setEditDesc(roles[idx].description)
  }

  const handleSave = async (idx: number) => {
    const role = roles[idx]
    const res = await fetch('/api/roles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: role.id, name: editRole, description: editDesc })
    })
    const data = await res.json()
    if (data.success) {
      const updated = [...roles]
      updated[idx] = data.role
      setRoles(updated)
      setEditIdx(null)
    }
  }

  const handleDelete = async (idx: number) => {
    if (!confirm('Устгахдаа итгэлтэй байна уу?')) return
    const role = roles[idx]
    const res = await fetch('/api/roles', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: role.id })
    })
    const data = await res.json()
    if (data.success) {
      setRoles(roles.filter((_, i) => i !== idx))
    }
  }

  const handleAdd = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addName, description: addDesc })
    })
    const data = await res.json()
    if (data.success) {
      setRoles([...roles, data.role])
      setAddName('')
      setAddDesc('')
      setShowAdd(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Эрх удирдлага</h1>
      <button onClick={() => setShowAdd(true)} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Шинэ эрх нэмэх</button>
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleAdd} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Шинэ эрх нэмэх</h2>
            <div className="mb-2">
              <label className="block text-gray-900 mb-1">Эрхийн нэр</label>
              <input value={addName} onChange={e => setAddName(e.target.value)} className="w-full border rounded p-2 text-gray-900" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 mb-1">Тайлбар</label>
              <input value={addDesc} onChange={e => setAddDesc(e.target.value)} className="w-full border rounded p-2 text-gray-900" required />
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
              <th className="p-2 border">#</th>
              <th className="p-2 border">Эрхийн нэр</th>
              <th className="p-2 border">Тайлбар</th>
              <th className="p-2 border">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r, idx) => (
              <tr key={idx} className="text-gray-900">
                <td className="p-2 border text-center">{idx+1}</td>
                <td className="p-2 border text-center">
                  {editIdx === idx ? (
                    <input value={editRole} onChange={e => setEditRole(e.target.value)} className="border rounded p-1 text-gray-900" />
                  ) : r.name}
                </td>
                <td className="p-2 border text-center">
                  {editIdx === idx ? (
                    <input value={editDesc} onChange={e => setEditDesc(e.target.value)} className="border rounded p-1 text-gray-900" />
                  ) : r.description}
                </td>
                <td className="p-2 border text-center">
                  {editIdx === idx ? (
                    <>
                      <button onClick={() => handleSave(idx)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Хадгалах</button>
                      <button onClick={() => setEditIdx(null)} className="bg-gray-300 px-2 py-1 rounded">Болих</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(idx)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Засах</button>
                      <button onClick={() => handleDelete(idx)} className="bg-red-500 text-white px-2 py-1 rounded">Устгах</button>
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
