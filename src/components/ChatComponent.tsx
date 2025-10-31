import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  user: string
  text: string
  time: string
}

const users = [
  { name: 'Админ' },
  { name: 'Ц.Болд' },
  { name: 'Б.Төмөр' },
  { name: 'Д.Оюун' },
  { name: 'Г.Баяр' },
  { name: 'М.Эрдэнэ' }
]

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [currentUser, setCurrentUser] = useState(users[0].name)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const newMsg: Message = {
      id: Date.now(),
      user: currentUser,
      text: input,
      time: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })
    }
    setMessages([...messages, newMsg])
    setInput('')
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-md flex flex-col h-[500px] border border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold text-white bg-blue-700 px-2 py-1 rounded">Хэрэглэгчийн чат</h2>
        <select
          className="border border-gray-700 rounded px-2 py-1 text-sm text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentUser}
          onChange={e => setCurrentUser(e.target.value)}
        >
          {users.map(u => (
            <option key={u.name} value={u.name}>{u.name}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-900">
        {messages.length === 0 && (
          <div className="text-gray-500 text-center mt-10">Ямар нэгэн зурвас хараахан ирээгүй байна.</div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.user === currentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-3 py-2 max-w-xs break-words shadow text-sm ${msg.user === currentUser ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-100'}`}>
              <div className="font-semibold mb-1">{msg.user}</div>
              <div>{msg.text}</div>
              <div className="text-xs text-right mt-1 opacity-70">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-gray-800 flex space-x-2 bg-gray-900">
        <input
          className="flex-1 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 bg-gray-800 placeholder-gray-500"
          placeholder="Зурвасаа бичнэ үү..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">Илгээх</button>
      </form>
    </div>
  )
}
