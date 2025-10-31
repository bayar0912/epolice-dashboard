"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // Хэрэглэгчийн мэдээллийг localStorage-д хадгалах
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.success) {
      // Хэрэглэгчийн role болон мэдээллийг localStorage-д хадгална
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/')
    } else {
      setError(data.message || 'Нэвтрэхэд алдаа гарлаа')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-md space-y-6">
        {/* Цагдаагын лого */}
        <div className="flex justify-center mb-6">
          <img 
            src="/police-logo.svg" 
            alt="Монгол Улсын Цагдаагын байгууллага" 
            className="w-32 h-32"
          />
        </div>
        
        {/* Гарчиг */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Цагдаагын Систем</h1>
          <h2 className="text-lg font-medium text-gray-600">Нэвтрэх</h2>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">И-мэйл</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              placeholder="example@police.gov.mn"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Нууц үг</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Нэвтрэх
          </button>
        </form>
        
        {/* Хөл хэсэг */}
        <div className="text-center text-sm text-gray-500 mt-6">
          Монгол Улсын Цагдаагын байгууллага
        </div>
      </div>
    </div>
  )
}
