'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import {
  Shield,
  Users,
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  MapPin,
  Phone,
  Clock,
  Eye,
  Target,
  Zap
} from 'lucide-react'

// Өгөгдөл
const crimeStats = [
  { name: 'Хулгай', value: 234, color: '#ef4444' },
  { name: 'Дээрэм', value: 123, color: '#f59e0b' },
  { name: 'Зөрчил', value: 456, color: '#3b82f6' },
  { name: 'Согтуу', value: 189, color: '#10b981' },
  { name: 'Бусад', value: 78, color: '#8b5cf6' }
]

const dailyActivity = [
  { time: '00', calls: 12, incidents: 8 },
  { time: '04', calls: 5, incidents: 3 },
  { time: '08', calls: 45, incidents: 23 },
  { time: '12', calls: 78, incidents: 34 },
  { time: '16', calls: 65, incidents: 28 },
  { time: '20', calls: 89, incidents: 45 },
  { time: '24', calls: 34, incidents: 18 }
]

const regionData = [
  { name: 'Баянзүрх', incidents: 156, officers: 45, status: 'active' },
  { name: 'Хан-Уул', incidents: 134, officers: 38, status: 'normal' },
  { name: 'Сүхбаатар', incidents: 189, officers: 52, status: 'high' },
  { name: 'Чингэлтэй', incidents: 98, officers: 32, status: 'low' },
  { name: 'Сонгино', incidents: 167, officers: 41, status: 'normal' }
]

const DarkDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Цагдаагын Хяналтын Систем</h1>
                <p className="text-slate-400 text-sm">Бодит цагийн мониторинг дашбоард</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-lg font-mono text-blue-400">
                  {currentTime.toLocaleTimeString('mn-MN')}
                </div>
                <div className="text-sm text-slate-400">
                  {currentTime.toLocaleDateString('mn-MN')}
                </div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Нийт дуудлага</p>
                  <p className="text-3xl font-bold text-white">2,547</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">+12.5%</span>
                  </div>
                </div>
                <Phone className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Идэвхтэй хэрэг</p>
                  <p className="text-3xl font-bold text-white">187</p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                    <span className="text-red-400 text-sm">-3.2%</span>
                  </div>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-400" />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Ажилтнууд</p>
                  <p className="text-3xl font-bold text-white">208</p>
                  <div className="flex items-center mt-1">
                    <Activity className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">195 идэвхтэй</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full -translate-y-10 translate-x-10"></div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Хариу хугацаа</p>
                  <p className="text-3xl font-bold text-white">4.2</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-blue-400 text-sm">минут</span>
                  </div>
                </div>
                <Zap className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Crime Distribution */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Гэмт хэргийн төрөл</h3>
                <Target className="h-5 w-5 text-slate-400" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={crimeStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {crimeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {crimeStats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: stat.color }}
                    ></div>
                    <span className="text-sm text-slate-300">{stat.name}: {stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Activity */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Өдрийн идэвхжил</h3>
                <Activity className="h-5 w-5 text-slate-400" />
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="calls" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Дуудлага"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="incidents" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    fillOpacity={0.6}
                    name="Хэрэг"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Regional Status */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Дүүргийн статус</h3>
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        region.status === 'high' ? 'bg-red-400' :
                        region.status === 'active' ? 'bg-blue-400' :
                        region.status === 'normal' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                      <div>
                        <p className="font-medium text-white">{region.name}</p>
                        <p className="text-xs text-slate-400">{region.officers} ажилтан</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{region.incidents}</p>
                      <p className="text-xs text-slate-400">хэрэг</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Цагаар дүн шинжилгээ</h3>
              <Eye className="h-5 w-5 text-slate-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="calls" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  name="Дуудлага"
                />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 6 }}
                  name="Хэрэг"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DarkDashboard
