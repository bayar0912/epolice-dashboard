'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Users, Calendar, MapPin, Target, User, Clock, AlertCircle } from 'lucide-react'

interface TaskForce {
  id: number
  name: string
  description?: string
  objective: string
  startDate: string
  endDate?: string
  status: string
  priority: string
  location?: string
  commander: string
  members: TaskForceMember[]
  activities: TaskForceActivity[]
  createdAt: string
  updatedAt: string
}

interface TaskForceMember {
  id: number
  taskForceId: number
  officerId: number
  role: string
  joinDate: string
  leaveDate?: string
  status: string
  officer: {
    id: number
    badge: string
    firstName: string
    lastName: string
    rank: string
    department: string
  }
}

interface TaskForceActivity {
  id: number
  taskForceId: number
  title: string
  description?: string
  activityDate: string
  location?: string
  status: string
  result?: string
}

interface PoliceOfficer {
  id: number
  badge: string
  firstName: string
  lastName: string
  rank: string
  department: string
  status: string
}

const TaskForceManagement = () => {
  const [taskForces, setTaskForces] = useState<TaskForce[]>([])
  const [officers, setOfficers] = useState<PoliceOfficer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [showMembersList, setShowMembersList] = useState(false)
  const [editingTaskForce, setEditingTaskForce] = useState<TaskForce | null>(null)
  const [selectedTaskForce, setSelectedTaskForce] = useState<TaskForce | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    objective: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    priority: 'medium',
    location: '',
    commander: ''
  })

  const [memberFormData, setMemberFormData] = useState({
    officerId: '',
    role: '',
    joinDate: new Date().toISOString().slice(0, 10)
  })

  const priorities = [
    { value: 'high', label: 'Яаралтай', color: 'text-red-600 bg-red-50' },
    { value: 'medium', label: 'Дунд', color: 'text-yellow-600 bg-yellow-50' },
    { value: 'low', label: 'Бага', color: 'text-green-600 bg-green-50' }
  ]

  const statuses = [
    { value: 'active', label: 'Идэвхтэй', color: 'text-green-600 bg-green-50' },
    { value: 'completed', label: 'Дууссан', color: 'text-blue-600 bg-blue-50' },
    { value: 'cancelled', label: 'Цуцлагдсан', color: 'text-gray-600 bg-gray-50' }
  ]

  useEffect(() => {
    fetchTaskForces()
    fetchOfficers()
  }, [])

  const fetchTaskForces = async () => {
    try {
      const response = await fetch('/api/task-forces')
      const data = await response.json()
      if (data.success) {
        setTaskForces(data.taskForces)
      }
    } catch (error) {
      console.error('Алдаа:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOfficers = async () => {
    try {
      const response = await fetch('/api/officers')
      const data = await response.json()
      if (data.success) {
        setOfficers(data.officers.filter((officer: PoliceOfficer) => officer.status === 'active'))
      }
    } catch (error) {
      console.error('Алдаа:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = '/api/task-forces'
      const method = editingTaskForce ? 'PATCH' : 'POST'
      const body = editingTaskForce 
        ? { id: editingTaskForce.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      
      if (data.success) {
        fetchTaskForces()
        setShowForm(false)
        setEditingTaskForce(null)
        resetForm()
        alert(editingTaskForce ? 'Томилгоот баг амжилттай шинэчлэгдлээ' : 'Томилгоот баг амжилттай үүсгэгдлээ')
      } else {
        alert(data.message || 'Алдаа гарлаа')
      }
    } catch (error) {
      console.error('Алдаа:', error)
      alert('Серверийн алдаа гарлаа')
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTaskForce) return

    try {
      const response = await fetch('/api/task-force-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskForceId: selectedTaskForce.id,
          ...memberFormData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        fetchTaskForces()
        setShowMemberForm(false)
        setMemberFormData({
          officerId: '',
          role: '',
          joinDate: new Date().toISOString().slice(0, 10)
        })
        alert('Гишүүн амжилттай нэмэгдлээ')
      } else {
        alert(data.message || 'Алдаа гарлаа')
      }
    } catch (error) {
      console.error('Алдаа:', error)
      alert('Серверийн алдаа гарлаа')
    }
  }

  const handleEdit = (taskForce: TaskForce) => {
    setEditingTaskForce(taskForce)
    setFormData({
      name: taskForce.name,
      description: taskForce.description || '',
      objective: taskForce.objective,
      startDate: taskForce.startDate,
      endDate: taskForce.endDate || '',
      priority: taskForce.priority,
      location: taskForce.location || '',
      commander: taskForce.commander
    })
    setShowForm(true)
  }

  const handleDelete = async (taskForce: TaskForce) => {
    if (!confirm(`"${taskForce.name}" томилгоот багийг устгахдаа итгэлтэй байна уу?`)) {
      return
    }

    try {
      const response = await fetch('/api/task-forces', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskForce.id })
      })

      const data = await response.json()
      
      if (data.success) {
        fetchTaskForces()
        alert('Томилгоот баг амжилттай устгагдлаа')
      } else {
        alert('Алдаа гарлаа')
      }
    } catch (error) {
      console.error('Алдаа:', error)
      alert('Серверийн алдаа гарлаа')
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm('Энэ гишүүнийг багаас хасахдаа итгэлтэй байна уу?')) {
      return
    }

    try {
      const response = await fetch('/api/task-force-members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: memberId })
      })

      const data = await response.json()
      
      if (data.success) {
        fetchTaskForces()
        alert('Гишүүн амжилттай хасагдлаа')
      } else {
        alert('Алдаа гарлаа')
      }
    } catch (error) {
      console.error('Алдаа:', error)
      alert('Серверийн алдаа гарлаа')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      objective: '',
      startDate: new Date().toISOString().slice(0, 10),
      endDate: '',
      priority: 'medium',
      location: '',
      commander: ''
    })
  }

  const filteredTaskForces = taskForces.filter(taskForce =>
    taskForce.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    taskForce.commander.toLowerCase().includes(searchTerm.toLowerCase()) ||
    taskForce.objective.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-800 font-medium">Ачааллаж байна...</div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Томилгоот багийн удирдлага</h1>
          <p className="text-gray-600 mt-1">Тусгай зорилгот багууд болон тэдгээрийн гишүүдийн удирдлага</p>
        </div>
        <button
          onClick={() => {
            setEditingTaskForce(null)
            resetForm()
            setShowForm(true)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Шинэ баг үүсгэх</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Нийт баг</p>
              <p className="text-2xl font-bold text-white">{taskForces.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Идэвхтэй баг</p>
              <p className="text-2xl font-bold text-white">{taskForces.filter(tf => tf.status === 'active').length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Нийт гишүүд</p>
              <p className="text-2xl font-bold text-white">{taskForces.reduce((sum, tf) => sum + tf.members.length, 0)}</p>
            </div>
            <User className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Яаралтай баг</p>
              <p className="text-2xl font-bold text-white">{taskForces.filter(tf => tf.priority === 'high').length}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Багийн нэр, ахлагч, зорилго хайх..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Task Forces Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTaskForces.map((taskForce) => (
          <div key={taskForce.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{taskForce.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      statuses.find(s => s.value === taskForce.status)?.color || 'text-gray-800 bg-gray-100'
                    }`}>
                      {statuses.find(s => s.value === taskForce.status)?.label || taskForce.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      priorities.find(p => p.value === taskForce.priority)?.color || 'text-gray-800 bg-gray-100'
                    }`}>
                      {priorities.find(p => p.value === taskForce.priority)?.label || taskForce.priority}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(taskForce)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(taskForce)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-700 mb-4">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="truncate text-gray-800">{taskForce.objective}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-800">Ахлагч: {taskForce.commander}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-800">{taskForce.startDate} {taskForce.endDate && `- ${taskForce.endDate}`}</span>
                </div>
                {taskForce.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="truncate text-gray-800">{taskForce.location}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-800 font-medium">Гишүүд ({taskForce.members.length})</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTaskForce(taskForce)
                        setShowMembersList(true)
                      }}
                      className="text-xs text-gray-700 hover:text-gray-900 font-medium"
                    >
                      Харах
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTaskForce(taskForce)
                        setShowMemberForm(true)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      + Нэмэх
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  {taskForce.members.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs text-blue-600 font-medium">
                            {member.officer.firstName.charAt(0)}
                          </span>
                        </div>
                        <span className="text-gray-900 font-medium">
                          {member.officer.rank} {member.officer.firstName.charAt(0)}.{member.officer.lastName}
                        </span>
                      </div>
                      <span className="text-gray-600 text-xs font-medium">{member.role}</span>
                    </div>
                  ))}
                  {taskForce.members.length > 3 && (
                    <div className="text-xs text-gray-600 pl-8 font-medium">
                      ... дахиад {taskForce.members.length - 3} гишүүн
                    </div>
                  )}
                  {taskForce.members.length === 0 && (
                    <div className="text-xs text-gray-500 text-center py-2">
                      Гишүүн байхгүй
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTaskForces.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Томилгоот баг олдсонгүй</p>
          <p className="text-gray-600 text-sm mt-2">Шинэ томилгоот баг үүсгэхийн тулд дээрх товчийг дарна уу</p>
        </div>
      )}

      {/* Task Force Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingTaskForce ? 'Томилгоот баг засах' : 'Шинэ томилгоот баг үүсгэх'}
              </h2>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Багийн нэр *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Багийн ахлагч *
                  </label>
                  <select
                    value={formData.commander}
                    onChange={(e) => setFormData({...formData, commander: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  >
                    <option value="" className="text-gray-500 bg-white">Ахлагч сонгох</option>
                    {officers.map(officer => (
                      <option key={officer.id} value={`${officer.rank} ${officer.firstName} ${officer.lastName}`} className="text-gray-900 bg-white">
                        {officer.rank} {officer.firstName} {officer.lastName} - {officer.department}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.commander}
                      onChange={(e) => setFormData({...formData, commander: e.target.value})}
                      placeholder="Эсвэл шууд бичих..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Зорилго *
                </label>
                <input
                  type="text"
                  value={formData.objective}
                  onChange={(e) => setFormData({...formData, objective: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тайлбар
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Эхлэх огноо *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дуусах огноо
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Чухал байдал
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value} className="text-gray-900 bg-white">{priority.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Байршил
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingTaskForce ? 'Шинэчлэх' : 'Үүсгэх'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberForm && selectedTaskForce && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                "{selectedTaskForce.name}" багт гишүүн нэмэх
              </h2>
              <button 
                onClick={() => setShowMemberForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ажилтан сонгох *
                </label>
                <select
                  value={memberFormData.officerId}
                  onChange={(e) => setMemberFormData({...memberFormData, officerId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                >
                  <option value="" className="text-gray-500 bg-white">Ажилтан сонгох</option>
                  {officers.filter(officer => 
                    !selectedTaskForce.members.some(member => member.officerId === officer.id)
                  ).map(officer => (
                    <option key={officer.id} value={officer.id} className="text-gray-900 bg-white">
                      {officer.rank} {officer.firstName} {officer.lastName} - {officer.department} (Товч: {officer.badge})
                    </option>
                  ))}
                </select>
                {officers.filter(officer => 
                  !selectedTaskForce.members.some(member => member.officerId === officer.id)
                ).length === 0 && (
                  <p className="text-sm text-gray-700 mt-1 font-medium">
                    Бүх идэвхтэй ажилтан энэ багт орсон байна.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Багт гүйцэтгэх үүрэг *
                </label>
                <select
                  value={memberFormData.role}
                  onChange={(e) => setMemberFormData({...memberFormData, role: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                >
                  <option value="" className="text-gray-500 bg-white">Үүрэг сонгох</option>
                  <option value="Багийн гишүүн" className="text-gray-900 bg-white">Багийн гишүүн</option>
                  <option value="Дэд ахлагч" className="text-gray-900 bg-white">Дэд ахлагч</option>
                  <option value="Техникч" className="text-gray-900 bg-white">Техникч</option>
                  <option value="Эмч" className="text-gray-900 bg-white">Эмч</option>
                  <option value="Мэргэжилтэн" className="text-gray-900 bg-white">Мэргэжилтэн</option>
                  <option value="Харилцаа холбооны ажилтан" className="text-gray-900 bg-white">Харилцаа холбооны ажилтан</option>
                  <option value="Тээврийн хэрэгслийн жолооч" className="text-gray-900 bg-white">Тээврийн хэрэгслийн жолооч</option>
                  <option value="Нохойн ахлагч" className="text-gray-900 bg-white">Нохойн ахлагч</option>
                </select>
                <div className="mt-2">
                  <input
                    type="text"
                    value={memberFormData.role}
                    onChange={(e) => setMemberFormData({...memberFormData, role: e.target.value})}
                    placeholder="Эсвэл бусад үүрэг бичих..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Орсон огноо *
                </label>
                <input
                  type="date"
                  value={memberFormData.joinDate}
                  onChange={(e) => setMemberFormData({...memberFormData, joinDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowMemberForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Болих
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Нэмэх
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members List Modal */}
      {showMembersList && selectedTaskForce && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                "{selectedTaskForce.name}" багийн гишүүд
              </h2>
              <button 
                onClick={() => setShowMembersList(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-700 font-medium">
                  Нийт {selectedTaskForce.members.length} гишүүн
                </div>
                <button
                  onClick={() => {
                    setShowMembersList(false)
                    setShowMemberForm(true)
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Гишүүн нэмэх</span>
                </button>
              </div>

              {selectedTaskForce.members.length > 0 ? (
                <div className="bg-white rounded-lg border overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ажилтан</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цол</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хэлтэс</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үүрэг</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Орсон огноо</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedTaskForce.members.map((member) => (
                        <tr key={member.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-blue-600">
                                  {member.officer.firstName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {member.officer.firstName} {member.officer.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  Товч: {member.officer.badge}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.officer.rank}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.officer.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {member.joinDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Хасах</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 text-lg font-medium">Гишүүн байхгүй</p>
                  <button
                    onClick={() => {
                      setShowMembersList(false)
                      setShowMemberForm(true)
                    }}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Эхний гишүүнийг нэмэх
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskForceManagement
