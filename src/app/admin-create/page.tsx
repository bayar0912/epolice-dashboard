"use client"

import { useState } from 'react'

export default function AdminCreatePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const res = await fetch('/api/admin-create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()
    if (data.success) {
      setSuccess('Админ хэрэглэгч амжилттай үүслээ!')
      setName('')
      setEmail('')
      setPassword('')
    } else {
      setError(data.message || 'Админ үүсгэхэд алдаа гарлаа')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleCreate} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Админ үүсгэх</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded text-sm">{success}</div>}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Нэр</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">И-мэйл</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Нууц үг</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Админ үүсгэх</button>
      </form>
    </div>
  )
}
