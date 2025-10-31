"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    const data = await res.json()
    if (data.success) {
      setSuccess('Бүртгэл амжилттай!')
      setTimeout(() => router.push('/login'), 1500)
    } else {
      setError(data.message || 'Бүртгэхэд алдаа гарлаа')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center">Бүртгүүлэх</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded text-sm">{success}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Нэр</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">И-мэйл</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Нууц үг</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Бүртгүүлэх</button>
        <p className="text-sm text-center mt-2">Бүртгэлтэй бол <a href="/login" className="text-blue-600 hover:underline">нэвтрэх</a></p>
      </form>
    </div>
  )
}
