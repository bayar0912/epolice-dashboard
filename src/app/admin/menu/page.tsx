"use client"

import { useEffect, useState } from 'react'

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editIdx, setEditIdx] = useState<number|null>(null)
  const [editName, setEditName] = useState('')
  const [editPath, setEditPath] = useState('')
  const [editRoles, setEditRoles] = useState('')
  const [addName, setAddName] = useState('')
  const [addPath, setAddPath] = useState('')
  const [addRoles, setAddRoles] = useState('user')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        setMenus(data.menus || [])
        setLoading(false)
      })
  }, [])

  const handleEdit = (idx: number) => {
    setEditIdx(idx)
    setEditName(menus[idx].name)
    setEditPath(menus[idx].path)
    setEditRoles(menus[idx].roles || 'user')
  }

  const handleSave = async (idx: number) => {
    const menu = menus[idx]
    const res = await fetch('/api/menu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: menu.id, name: editName, path: editPath, roles: editRoles })
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

  const handleAdd = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: addName, path: addPath, roles: addRoles })
    })
    const data = await res.json()
    if (data.success) {
      setMenus([...menus, data.menu])
      setAddName('')
      setAddPath('')
      setAddRoles('user')
      setShowAdd(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Цэс удирдлага</h1>
      <button onClick={() => setShowAdd(true)} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Шинэ цэс нэмэх</button>
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleAdd} className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Шинэ цэс нэмэх</h2>
            <div className="mb-2">
              <label className="block text-gray-900 mb-1">Цэсний нэр</label>
              <input value={addName} onChange={e => setAddName(e.target.value)} className="w-full border rounded p-2 text-gray-900" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 mb-1">Зам (path)</label>
              <input value={addPath} onChange={e => setAddPath(e.target.value)} className="w-full border rounded p-2 text-gray-900" required />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 mb-1">Эрхүүд (user,admin,superadmin,...) - таслалаар тусгаарлана</label>
              <input value={addRoles} onChange={e => setAddRoles(e.target.value)} className="w-full border rounded p-2 text-gray-900" required />
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
              <th className="p-2 border">Цэсний нэр</th>
              <th className="p-2 border">Зам (path)</th>
              <th className="p-2 border">Эрхүүд</th>
              <th className="p-2 border">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((m, idx) => (
              <tr key={idx} className="text-gray-900">
                <td className="p-2 border text-center">{idx+1}</td>
                <td className="p-2 border text-center">
                  {editIdx === idx ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)} className="border rounded p-1 text-gray-900" />
                  ) : m.name}
                </td>
                <td className="p-2 border text-center">
                  {editIdx === idx ? (
                    <input value={editPath} onChange={e => setEditPath(e.target.value)} className="border rounded p-1 text-gray-900" />
                  ) : m.path}
                </td>
                <td className="p-2 border text-center">
                  {editIdx === idx ? (
                    <input value={editRoles} onChange={e => setEditRoles(e.target.value)} className="border rounded p-1 text-gray-900" />
                  ) : m.roles}
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
