import React, { useState } from 'react'
import { Calendar } from 'lucide-react'

// Жишээ өгөгдөл (сар, өдөр, гэмт хэргийн тоо)
const crimeCalendarData = [
  { date: '2025-09-01', count: 5 },
  { date: '2025-09-02', count: 2 },
  { date: '2025-09-03', count: 7 },
  { date: '2025-09-04', count: 3 },
  { date: '2025-09-05', count: 1 },
  { date: '2025-09-06', count: 4 },
  { date: '2025-09-07', count: 6 },
  { date: '2025-09-08', count: 2 },
  { date: '2025-09-09', count: 8 },
  { date: '2025-09-10', count: 3 },
  { date: '2025-09-11', count: 5 },
  { date: '2025-09-12', count: 2 },
  { date: '2025-09-13', count: 7 },
  { date: '2025-09-14', count: 3 },
  { date: '2025-09-15', count: 1 },
  { date: '2025-09-16', count: 4 },
  { date: '2025-09-17', count: 6 },
  { date: '2025-09-18', count: 2 },
  { date: '2025-09-19', count: 8 },
  { date: '2025-09-20', count: 3 },
  { date: '2025-09-21', count: 5 },
  { date: '2025-09-22', count: 2 },
  { date: '2025-09-23', count: 7 },
  { date: '2025-09-24', count: 3 },
  { date: '2025-09-25', count: 1 },
  { date: '2025-09-26', count: 4 },
  { date: '2025-09-27', count: 6 },
  { date: '2025-09-28', count: 2 },
  { date: '2025-09-29', count: 8 },
  { date: '2025-09-30', count: 3 }
]

function getMonthData(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: { date: string; count: number }[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const found = crimeCalendarData.find((c) => c.date === dateStr)
    days.push({ date: dateStr, count: found ? found.count : 0 })
  }
  return days
}

const CalendarDashboard: React.FC = () => {
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth())
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [search, setSearch] = useState('')

  const monthNames = [
    '1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар',
    '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'
  ]

  const days = getMonthData(selectedYear, selectedMonth)
  const filteredDays = days.filter(day =>
    !search || day.date.includes(search)
  )

  const totalMonth = days.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" /> Календарь - Гэмт хэргийн тоо
        </h2>
        <div className="flex gap-2">
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 text-gray-900"
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y} className="text-gray-900 bg-white">{y}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className="border rounded px-2 py-1 text-gray-900"
          >
            {monthNames.map((m, i) => (
              <option key={i} value={i} className="text-gray-900 bg-white">{m}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Өдөр хайх (YYYY-MM-DD)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>
      <div className="mb-2 text-gray-700 font-medium">
        {monthNames[selectedMonth]}-д нийт <span className="text-blue-600 font-bold">{totalMonth}</span> гэмт хэрэг бүртгэгдсэн
      </div>
      <div className="grid grid-cols-7 gap-2 mt-4">
        {filteredDays.map((day, i) => (
          <div key={i} className={`rounded-lg p-2 text-center border ${day.count > 0 ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
            <div className="text-xs">{day.date.slice(-2)}</div>
            <div className="text-lg">{day.count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarDashboard
